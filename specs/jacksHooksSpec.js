describe("Hooks", function() {
	var url = "/dump"
	it("hooks before open", function(done) {
		jacks()
			.get(url)
			.hook('beforeOpen', function(data) {
				Should(data.request).not.be.eql(null);
				data.request.query("hook", "hook");
			})
			.send(function(response) {
				var query = response.response.url.substring(response.response.url.indexOf("?"));
				Should(query).be.exactly("?hook=hook");
				done();
			});
	});
	it("hooks before error", function(done) {
		jacks()
			.get("http://local:33/error")
			.hook('beforeError', function(data) {
				data.error.hook = "hook";
			})
			.send(null, function(err) {
				Should(err.hook).be.exactly("hook");
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
				Should(response.hook).be.exactly("hook");
				done();
			});
	});
});