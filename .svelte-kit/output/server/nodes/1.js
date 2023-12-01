

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.c4ad4f5a.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/index.bb499846.js","_app/immutable/chunks/singletons.6ad6236c.js","_app/immutable/chunks/paths.4f3dd8c5.js"];
export const stylesheets = [];
export const fonts = [];
