// Screenshot.ts: marks a capture whose file failed to load, so CSS can show its alt text on the solid placeholder (DESIGN.md section 8, "Image failed").
const markFailed = (img: Element) => img.closest('.screenshot')?.setAttribute('data-failed', '');

// The error event does not bubble, so listen while it travels down.
document.addEventListener('error', (event) => event.target instanceof HTMLImageElement && markFailed(event.target), true);

// A capture that failed before this script ran is already complete with no pixels.
document.querySelectorAll<HTMLImageElement>('.screenshot img').forEach((img) => img.complete && !img.naturalWidth && markFailed(img));
