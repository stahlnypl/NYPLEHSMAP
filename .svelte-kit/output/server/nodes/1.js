

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.1df73629.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/index.bb499846.js","_app/immutable/chunks/singletons.f471c44d.js","_app/immutable/chunks/paths.025b0af7.js"];
export const stylesheets = [];
export const fonts = [];
