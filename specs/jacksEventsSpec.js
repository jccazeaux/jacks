describe("Events", function() {
	it("loadstarts", function(done) {
		var eventCheck = false;
		jacks()
			.get(url)
			.on('loadstart', function(e) {
				eventCheck = true;
			})
			.send(function(response) {
				expect(eventCheck).toBe(true);
				done();
			});
	});
	it("loadends", function(done) {
		var eventCheck = false;
		jacks()
			.get(url)
			.on('loadend', function(e) {
				eventCheck = true;
				expect(eventCheck).toBe(true);
				done();
			})
			.send(function(response) {
				
			});
	});
	it("progress", function(done) {
		var eventCheck = false;
		jacks()
			.get(url)
			.on('progress', function(e) {
				eventCheck = true;
			})
			.send(function(response) {
				expect(eventCheck).toBe(true);
				done();
			});
	});
});