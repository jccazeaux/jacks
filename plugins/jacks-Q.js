var jacksQ =function(request) {
	var oldSend = request.send;
	request.send = function() {
		var defer = Q.defer();
		oldSend(function(res) {
			defer.resolve(res);
		},
		function(e) {
			Q.reject(e);
		})
		return defer.promise;
	}
};