jacks.plugin(function jacksCache(request) {
	jacksCache.cache = jacksCache.cache || {};
	var oldSend = request.send;
	request.send = function(callback, error) {
		// Seuls les gets sont en cache
		if (requestType === "GET") {
			if (jacksCache.cache[url]) {
				callback(jacksCache.cache[url])
			} else {
				oldSend(function(response) {
					callback(response);
					jacksCache.cache[url] = response;
				}, error);
			}
	}
})