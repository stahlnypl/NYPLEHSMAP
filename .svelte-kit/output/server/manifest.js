export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store",".nojekyll","Data/.DS_Store","Data/images/lct_button.png","favicon.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.58df47a6.js","app":"_app/immutable/entry/app.382fb60d.js","imports":["_app/immutable/entry/start.58df47a6.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/singletons.4e18b281.js","_app/immutable/chunks/paths.c0622c9b.js","_app/immutable/entry/app.382fb60d.js","_app/immutable/chunks/preload-helper.41c905a7.js","_app/immutable/chunks/scheduler.b108d059.js","_app/immutable/chunks/index.bb499846.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
