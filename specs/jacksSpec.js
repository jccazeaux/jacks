describe("Query", function() {
	var url = "./foo.json";

	it("constructs the url", function() {
		var request = jacks().get(url)
		.query("param1", "value1")
		.query({"param2": "value2"});

		Should(request.url).be.exactly(url + "?param1=value1&param2=value2");
	});
});

describe("Headers", function() {
	var url = "/dump";

	it("Can read response header in request", function(done) {
		jacks().get(url)
		.send(function(res) {
			Should(res.getHeader("content-type").be.exactly("application/json");
			done();
		});

		foo = false;
	});

	it("Can send header in request", function(done) {
		jacks().get(url)
		.header("my-header", "foo")
		.send(function(res) {
			Should(res.response.headers["my-header"]).be.exactly("foo");
			done();
		});

		foo = false;
	});
});

describe("Sync mode", function() {
	var url = "./foo.json";

	it("Sends sync request", function(done) {
		var foo = true;
		jacks().get(url)
		.sync()
		.send(function() {
			Should(foo).be.exactly(true);
			done();
		});

		foo = false;
	});
	
	it("Sends async request", function(done) {
		var foo = true;
		jacks().get(url)
		.send(function() {
			Should(foo).be.exactly(false);
			done();
		});

		foo = false;
	});
});
