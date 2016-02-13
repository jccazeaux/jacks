describe("Post", function() {
	var url = "./foo.json";
	
	it("Posts on the URL", function(done) {
		jacks().post(url)
		.body({name:"Vader",job:"Sith knight"})
		.header("Content-Type", "application/json")
		.send(function(response) {
			Should(response.response).not.be.exactly(null);
			done();
		});
	});
});

