module.exports = {
		"application/json": function(data) {
			return JSON.stringify(data);
		},
		"application/x-www-form-urlencoded": function(data) {
			var arr = [];
			for (var attr in data) {
				arr.push(encodeURIComponent(attr) + '=' + encodeURIComponent(data[attr]));
			}
			return arr.join('&');
		}
	};
