var url = "./specs/foo.json";
describe("Url query params test", function() {

	it("constructs the url", function() {
		var request = jacks().get(url)
		.query("param1", "value1")
		.query({"param2": "value2"});

		expect(request.url).toBe(url + "?param1=value1&param2=value2");
	});
	it("gets the url", function(done) {
		var request = jacks().get(url)
		.query("param1", "value1")
		.query({"param2": "value2"})
		.send(function(response) {
			expect(response).not.toBe(null);
			done();
		}, function(err) {
			expect(err).toBe(null);
			done();
		});
	});
});

describe("Plugins", function() {

	it("Uses a live plugin on request", function(done) {

		function notVader(jacksRequest) {
			// All request must have this query parameter
			jacksRequest.query("iAmNot", "Vader");
		}
		jacks().get(url)
		.query("param1", "value")
		.use(notVader)
		.send(function(response) {
			expect(response.url).toBe(url + "?param1=value&iAmNot=Vader")
			done();
		});
	});

	it("Uses a live plugin on global", function(done) {
		function yoda(jacksRequest) {
			// All request must have this query parameter
			jacksRequest.query("iAm", "Yoda");
		}
		var myJacks = jacks();
		myJacks
		.use(yoda)
		.get(url)
		.query("param1", "value")
		.send(function(response) {
			expect(response.url).toBe(url + "?iAm=Yoda&param1=value");
			// Try again to that the plugin is still there
			myJacks
			.get(url)
			.query("param1", "value")
			.send(function(response) {
				expect(response.url).toBe(url + "?iAm=Yoda&param1=value");
				done();
			});
		});

	});

	it("Uses a configured plugin on request", function(done) {

		jacks.plugin("notVader", function notVader(jacksRequest) {
			// All request must have this query parameter
			jacksRequest.query("iAmNot", "Vader");
		});
		jacks()
		.get(url)
		.query("param1", "value")
		.use("notVader")
		.send(function(response) {
			expect(response.url).toBe(url + "?param1=value&iAmNot=Vader")
			done();
		});
	});

	it("Uses a configured plugin on global", function(done) {
		jacks.plugin("yoda", function yoda(jacksRequest) {
			// All request must have this query parameter
			jacksRequest.query("iAm", "Yoda");
		});

		var myJacks = jacks();
		
		myJacks
		.use("yoda")
		.get(url)
		.query("param1", "value")
		.send(function(response) {
			expect(response.url).toBe(url + "?iAm=Yoda&param1=value")
		
			myJacks
			.get(url)
			.query("param1", "value")
			.send(function(response) {
				// Try again to that the plugin is still there
				expect(response.url).toBe(url + "?iAm=Yoda&param1=value")
				done();
			});
		});

	});
});

describe("Get", function() {
	it("Gets the URL", function(done) {
		jacks().get(url).send(function(response) {
			expect(response.response.data).toBe("foo");
			done();
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


