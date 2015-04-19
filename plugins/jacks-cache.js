(function(jacks) {
	jacks.plugin("cache", function jacksCache(request) {
		jacksCache.cache = jacksCache.cache || {};
		var oldSend = request.send;
		request.send = function(callback, error) {
			// Seuls les gets sont en cache
			if (request.requestType === "GET") {
				if (jacksCache.cache[request.url]) {
					callback(jacksCache.cache[request.url])
				} else {
					oldSend(function(response) {
						jacksCache.cache[request.url] = response;
						callback(response);
					}, error);
				}
			}
		}
	});
})(jacks);