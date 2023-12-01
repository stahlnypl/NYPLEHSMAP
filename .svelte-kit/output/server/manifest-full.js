export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "NYPLEHSMAP/index.html/_app",
	assets: new Set([".DS_Store",".nojekyll","Data/.DS_Store","Data/images/lct_button.png","favicon.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.3e071dcc.js","app":"_app/immutable/entry/app.40e05f79.js","imports":["_app/immutable/entry/start.3e071dcc.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/singletons.1151925d.js","_app/immutable/chunks/paths.0c560f61.js","_app/immutable/entry/app.40e05f79.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/index.bb499846.js"],"stylesheets":[],"fonts":[]},
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
