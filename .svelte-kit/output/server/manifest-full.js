export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store",".nojekyll","Data/images/lct_button.png","favicon.svg","favicon_152.png","favicon_167.png","favicon_180.png","touch-icon-iphone.png","user-dark.svg","user-light.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.132d9f62.js","app":"_app/immutable/entry/app.884cd68e.js","imports":["_app/immutable/entry/start.132d9f62.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/singletons.33ad856c.js","_app/immutable/chunks/paths.849fead4.js","_app/immutable/entry/app.884cd68e.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/index.bb499846.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
