describe("Get", function() {
	var url = "./foo.json";

	it("Gets the URL", function(done) {
		jacks().get(url).send(function(response) {
			Should(response.response.data).be.exactly("foo");
			done();
		});
	});
});

describe("Parsers", function() {
	var url = "./foo.json";
	it("Uses the defined parser", function(done) {
		jacks()
		.parser("application/json", function(data) {
			var dataParsed = JSON.parse(data);
			dataParsed.foo = "bar";
			return dataParsed;
		})
		.get(url).send(function(response) {
			Should(response.response.foo).be.exactly("bar");
			done();
		});
	});
});


