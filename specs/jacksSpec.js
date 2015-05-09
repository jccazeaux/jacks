var url = "./specs/foo.json";
describe("Url query params test", function() {

	it("constructs the url", function() {
		var request = jacks().get(url)
		.query("param1", "value1")
		.query({"param2": "value2"});

		expect(request.url).toBe(url + "?param1=value1&param2=value2");
	});
});

