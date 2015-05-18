var url = "./specs/foo.json";
describe("Mocks", function() {

	it("Mocks a get", function(done) {
		jacks.clearMocks().mock({
			url: url,
			method: "get"
		},
		{
			responseText: "Hello"
		});
		var request = jacks().get(url)
		.send(function(response) {
			expect(response.responseText).toBe("Hello");
			done();
		});
	});

	it("Mocks a get with regexp", function(done) {
		jacks.clearMocks().mock({
			url: /.*specs.*/,
			method: "get"
		},
		{
			responseText: "Hello"
		});
		var request = jacks().get(url)
		.send(function(response) {
			expect(response.responseText).toBe("Hello");
			done();
		});
	});

	it("Mocks the correct url", function(done) {
		jacks.clearMocks().mock({
			url: url,
			method: "get"
		},
		{
			responseText: "Hello"
		});
		var request = jacks().get(url + "?dummy")
		.send(function(response) {
			expect(response.responseText).not.toBe("Hello");
			done();
		});
	});

	it("Doesn't mock if wrond verb is defined", function(done) {
		jacks.clearMocks().mock({
			url: url,
			method: "post"
		},
		{
			responseText: "Mocked"
		});
		var request = jacks().get(url)
		.send(function(response) {
			expect(response.responseText).not.toBe("Mocked");
			done();
		});
	});
	it("Mocks with delay", function(done) {

		jacks.clearMocks().mock({
			url: url,
			method: "get"
		},
		{
			responseText: "Mocked",
			delay: 1000
		});
		var start = new Date();
		var request = jacks().get(url)
		.send(function(response) {
			var end = new Date();
			expect(response.responseText).toBe("Mocked");
			expect(end.getTime() - start.getTime() >= 1000).toBe(true);
			done();
		});
	});

	it("Mocks with function", function(done) {
		jacks.clearMocks().mock({
			url: url,
			method: "get"
		},
		{
			response: function() {
				this.responseText = "Mocked"
			}
		});
		var request = jacks().get(url)
		.send(function(response) {
			expect(response.responseText).toBe("Mocked");
			done();
		});
	});

	it("Mocks with asynchronous function", function(done) {
		jacks.clearMocks().mock({
			url: url,
			method: "get"
		},
		{
			response: function(done) {
				var that = this;
				setTimeout(function() {
					that.responseText = "Mocked";
					done();
				}, 0);
			}
		});
		var request = jacks().get(url)
		.send(function(response) {
			expect(response.responseText).toBe("Mocked");
			done();
		});
	})

	
});

