describe("Events", function() {
	it("hooks before open", function(done) {
		jacks()
			.get(url)
			.hook('beforeOpen', function(data) {
				expect(data.request).not.toBe(null);
				data.request.query("hook", "hook");
			})
			.send(function(response) {
				var query = response.url.substring(response.url.indexOf("?"));
				expect(query).toBe("?hook=hook");
				done();
			});
	});
	it("hooks before error", function(done) {
		jacks()
			.get("htp://error")
			.hook('beforeError', function(data) {
				data.error.hook = "hook";
			})
			.send(null, function(err) {
				expect(err.hook).toBe("hook");
				done();
			});
	});
	it("hooks before response", function(done) {
		jacks()
			.get(url)
			.hook('beforeResponse', function(data) {
				data.response.hook = "hook";
			})
			.send(function(response) {
				expect(response.hook).toBe("hook");
				done();
			});
	});
});