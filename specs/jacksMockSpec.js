describe("Mocks", function() {
	var url = "./foo.json";

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
			Should(response.responseText).be.exactly("Hello");
			done();
		});
	});

	it("Mocks a get with regexp", function(done) {
		jacks.clearMocks().mock({
			url: /.*foo.*/,
			method: "get"
		},
		{
			responseText: "Hello"
		});
		var request = jacks().get(url)
		.send(function(response) {
			Should(response.responseText).be.exactly("Hello");
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
			Should(response.responseText).not.be.exactly("Hello");
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
			Should(response.responseText).not.be.exactly("Mocked");
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
			Should(response.responseText).be.exactly("Mocked");
			Should(end.getTime() - start.getTime() >= 1000).be.exactly(true);
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
			Should(response.responseText).be.exactly("Mocked");
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
			Should(response.responseText).be.exactly("Mocked");
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
			Should(response.getHeader("content-type")).be.exactly("application/json, application/x-json");
			Should(response.getHeader("foo")).be.exactly("bar");
			Should(response.getHeader("FOO")).be.exactly("bar");

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
			Should(response.responseText).be.exactly("Mocked");
		});
		jacks().get(url)
		.send(function(response) {
			Should(response.responseText).be.exactly("Mocked");
			done();
		});
	});


});

