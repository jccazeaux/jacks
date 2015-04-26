describe("Url query params test", function() {
	var url = "/";

	it("constructs the url", function() {
		var request = jacks.get(url)
		.query("param1", "value1")
		.query({"param2": "value2"});

		expect(request.url).toBe(url + "?param1=value1&param2=value2");
	});
	it("gets the url", function(done) {
		var request = jacks.get(url)
		.query("param1", "value1")
		.query({"param2": "value2"})
		.send(function(response) {
			console.log(JSON.stringify(response))
			expect(response).not.toBe(null);
			done();
		}, function(err) {
			expect(err).toBe(null)
			done();
		});
	});
});