

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.4c199f25.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/index.bb499846.js","_app/immutable/chunks/singletons.5103ee1a.js","_app/immutable/chunks/paths.4b119887.js"];
export const stylesheets = [];
export const fonts = [];
