var url = "./specs/foo.json";

describe("Post", function() {
	it("Posts on the URL", function(done) {
		jacks().post(url)
		.body({name:"Vader",job:"Sith knight"})
		.header("Content-Type", "application/json")
		.send(function(response) {
			expect(response.response).not.toBe(null);
			done();
		});
	});
});

