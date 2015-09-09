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
	});

	it("Gets headers from mock", function(done) {
		jacks.clearMocks().mock({
			url: url,
			method: "get"
		},
		{
			headers: {
				"content-type": "application/json",
				"Content-Type": "application/x-json",
				"foo": "bar"
			},
			responseText: "Hello"
		});
		var request = jacks().get(url)
		.send(function(response) {
			expect(response.getHeader("content-type")).toBe("application/json, application/x-json");
			expect(response.getHeader("foo")).toBe("bar");
			expect(response.getHeader("FOO")).toBe("bar");

			done();
		});
	});

	it("Clones the mock", function(done) {
		jacks.clearMocks().mock({
			url: url,
			method: "get"
		},
		{
			response: function() {
				if (!this.responseText) {
					this.responseText = "";	
				}
				this.responseText += "Mocked";
			}
		});
		jacks().get(url)
		.send(function(response) {
			expect(response.responseText).toBe("Mocked");
		});
		jacks().get(url)
		.send(function(response) {
			expect(response.responseText).toBe("Mocked");
			done();
		});
	});


});

