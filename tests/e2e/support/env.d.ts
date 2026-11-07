// env.d.ts: the one Node global the config reads. The project has no @types/node and adding it is not needed for this.
declare const process: { env: Record<string, string | undefined> };
