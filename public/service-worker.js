const CACHE_NAME = 'budget-tracker-v1';

const FILES_TO_CACHE = ["./index.html", "./manifest.json", "./css/styles.css", "./icons/icon-72x72.png", "./icons/icon-96x96.png", "./icons/icon-128x128.png", "./icons/icon-144x144.png", "./icons/icon-152x152.png", "./icons/icon-192x192.png", "./icons/icon-384x384.png", "./icons/icon-512x512.png", "./js/indexdb.js", "./js/index.js"];

self.addEventListener("install", function (e) {
	e.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(FILES_TO_CACHE))
			.then(() => console.log("Cache created"))
			.catch(function (err) {
				console.log("Cache Error: " + err);
			})
	);
});

self.addEventListener("activate", function (e) {
	e.waitUntil(
		caches
			.keys()
			.then(function (keyList) {
				let cacheKeepList = keyList.filter(function (key) {
					return key.indexOf(APP_PREFIX);
				});
				cacheKeepList.push(CACHE_NAME);
				return Promise.all(
					keyList.map(function (key, i) {
						if (cacheKeepList.indexOf(key) === -1) {
							console.log("Deleting Cache: " + keyList[i]);
							return caches.delete(keyList[i]);
						}
					})
				);
			})
			.catch((err) => console.log("Cache Deletion error: " + err))
	);
});
