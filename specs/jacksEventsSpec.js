describe("Events", function() {
	var url = "./foo.json";
	
	it("loadstarts", function(done) {
		var eventCheck = false;
		jacks()
			.get(url)
			.on('loadstart', function(e) {
				eventCheck = true;
			})
			.send(function(response) {
				Should(eventCheck).be.exactly(true);
				done();
			});
	});
	it("loadends", function(done) {
		var eventCheck = false;
		jacks()
			.get(url)
			.on('loadend', function(e) {
				eventCheck = true;
				Should(eventCheck).be.exactly(true);
				done();
			})
			.send(function(response) {
				
			});
	});
	it("progress", function(done) {
		var eventUploadCheck = false;
		var eventCheck = false;
		jacks()
			.get(url)
			.on('progress', function(e) {
				eventCheck = true;
			})
			.on('upload-progress', function(e) {
				eventUploadCheck = true;
			})
			.send(function(response) {
				Should(eventCheck).be.exactly(true);
				Should(eventUploadCheck).be.exactly(false);
				done();
			});
	});
	it("upload-progress", function(done) {
		var eventUploadCheck = false;
		var eventCheck = false;
		jacks()
			.post(url)
			.body({data:"my data"})
			.header("Content-Type", "application/json")
			.on('progress', function(e) {
				eventCheck = true;
			})
			.on('upload-progress', function(e) {
				eventUploadCheck = true;
			})
			.send(function(response) {
				Should(eventCheck).be.exactly(true);
				Should(eventUploadCheck).be.exactly(true);
				done();
			});
	});
});