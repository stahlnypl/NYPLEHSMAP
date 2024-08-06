import * as server from '../entries/pages/_page.server.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.js";
export const imports = ["_app/immutable/nodes/2.b9d6d68c.js","_app/immutable/chunks/2.375ddc08.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/index.bb499846.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/paths.3c6a5e52.js"];
export const stylesheets = ["_app/immutable/assets/2.1f0815b9.css"];
export const fonts = [];
