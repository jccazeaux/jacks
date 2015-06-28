var url = "./specs/foo.json";
describe("Url query params test", function() {

	it("constructs the url", function() {
		var request = jacks().get(url)
		.query("param1", "value1")
		.query({"param2": "value2"});

		expect(request.url).toBe(url + "?param1=value1&param2=value2");
	});
});
describe("Sync mode", function() {

	it("Sends sync request", function(done) {
		var foo = true;
		jacks().get(url)
		.sync()
		.send(function() {
			expect(foo).toBe(true);
			done();
		});

		foo = false;
	});
	it("Sends async request", function(done) {
		var foo = true;
		jacks().get(url)
		.send(function() {
			expect(foo).toBe(false);
			done();
		});

		foo = false;
	});
});
