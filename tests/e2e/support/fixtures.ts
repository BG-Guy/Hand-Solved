// fixtures.ts: the shared `test`. Every test gets a watcher that records what the browser reports (console errors, uncaught errors, CSP violations, requests),
// and fails at the end if the page broke its own rules, whatever the test was checking. Specs import `test` and `expect` from here, never from @playwright/test.
import { test as base, expect } from '@playwright/test';

export interface Watch {
  /** Console errors, minus the browser's own "Failed to load resource ... 404" line for a page that is itself answered with a 404 (the 404 page). */
  readonly consoleErrors: string[];
  consoleWarnings: string[];
  pageErrors: string[];
  /** Content Security Policy violations, from the page's own `securitypolicyviolation` event. */
  csp: string[];
  /** fetch, XMLHttpRequest and sendBeacon calls made by page script, recorded even when the CSP then blocks them. */
  scriptNetwork: string[];
  /** Every request the browser issued, as "METHOD url". */
  requests: string[];
  failedRequests: string[];
  /** Responses with status 400 or more, as "status url". */
  badResponses: string[];
  /** Forget everything seen so far, for a test that provokes violations on purpose and has already asserted them. */
  clear(): void;
}

// Runs in the page before any of its own script. Reports go through exposed functions so they survive navigation.
function installProbes() {
  const w = window as unknown as Record<string, (...a: unknown[]) => void>;
  const say = (name: string, text: string) => {
    try {
      w[name]?.(text);
    } catch {
      /* the page is going away */
    }
  };
  addEventListener('securitypolicyviolation', (e) => say('__hsCsp', `${e.violatedDirective} blocked ${e.blockedURI || 'inline'}`));
  const realFetch = window.fetch;
  window.fetch = function (this: unknown, ...args: Parameters<typeof fetch>) {
    say('__hsNet', `fetch ${String((args[0] as Request)?.url ?? args[0])}`);
    return realFetch.apply(this, args);
  };
  const realOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (this: XMLHttpRequest, method: string, url: string | URL, ...rest: unknown[]) {
    say('__hsNet', `xhr ${method} ${String(url)}`);
    return (realOpen as (...a: unknown[]) => void).call(this, method, url, ...rest);
  } as typeof XMLHttpRequest.prototype.open;
  const realBeacon = navigator.sendBeacon?.bind(navigator);
  if (realBeacon) {
    navigator.sendBeacon = (url: string | URL, data?: BodyInit | null) => {
      say('__hsNet', `beacon ${String(url)}`);
      return realBeacon(url, data);
    };
  }
}

export const test = base.extend<{ watch: Watch }>({
  watch: [
    async ({ page, javaScriptEnabled }, use) => {
      const rawErrors: string[] = [];
      const answered404: string[] = [];
      const watch: Watch = {
        get consoleErrors() {
          return rawErrors.filter((line) => !answered404.some((url) => line.includes('status of 404') && line.includes(`(${url})`)));
        },
        consoleWarnings: [],
        pageErrors: [],
        csp: [],
        scriptNetwork: [],
        requests: [],
        failedRequests: [],
        badResponses: [],
        clear() {
          rawErrors.length = 0;
          watch.consoleWarnings.length = 0;
          watch.pageErrors.length = 0;
          watch.csp.length = 0;
          watch.scriptNetwork.length = 0;
          watch.failedRequests.length = 0;
          watch.badResponses.length = 0;
        },
      };
      page.on('console', (message) => {
        if (message.type() === 'error') rawErrors.push(`${message.text()} (${message.location().url})`);
        else if (message.type() === 'warning') watch.consoleWarnings.push(message.text());
      });
      page.on('pageerror', (error) => watch.pageErrors.push(String(error)));
      page.on('request', (request) => watch.requests.push(`${request.method()} ${request.url()}`));
      page.on('requestfailed', (request) => watch.failedRequests.push(`${request.url()} ${request.failure()?.errorText ?? ''}`.trim()));
      page.on('response', (response) => {
        if (response.status() >= 400) watch.badResponses.push(`${response.status()} ${response.url()}`);
        if (response.status() === 404 && response.request().isNavigationRequest() && response.frame() === page.mainFrame()) answered404.push(response.url());
      });
      if (javaScriptEnabled !== false) {
        await page.exposeFunction('__hsCsp', (text: string) => watch.csp.push(text));
        await page.exposeFunction('__hsNet', (text: string) => watch.scriptNetwork.push(text));
        await page.addInitScript(installProbes);
      }

      await use(watch);

      // Soft, so one broken page reports every kind of problem at once.
      expect.soft(watch.pageErrors, 'uncaught errors on the page').toEqual([]);
      expect.soft(watch.csp, 'Content Security Policy violations').toEqual([]);
      expect.soft(watch.consoleErrors, 'console errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
