

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.49ae9ae2.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/index.bb499846.js","_app/immutable/chunks/singletons.242df523.js","_app/immutable/chunks/paths.fd473664.js"];
export const stylesheets = [];
export const fonts = [];
