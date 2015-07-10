var url = "./specs/foo.json";

describe("Get", function() {
	it("Gets the URL", function(done) {
		jacks().get(url).send(function(response) {
			expect(response.response.data).toBe("foo");
			done();
		}, function(err) {
			alert(JSON.stringify(err))
		});
	});
});

describe("Parsers", function() {
	it("Uses the defined parser", function(done) {
		jacks()
		.parser("application/json", function(data) {
			var dataParsed = JSON.parse(data);
			dataParsed.foo = "bar";
			return dataParsed;
		})
		.get(url).send(function(response) {
			expect(response.response.foo).toBe("bar");
			done();
		});
	});
});


