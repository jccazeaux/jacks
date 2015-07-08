describe("Events", function() {
	it("hooks before open", function(done) {
		var eventCheck = false;
		jacks()
			.get(url)
			.hook('beforeOpen', function(data) {
				eventCheck = true;
			})
			.send(function(response) {
				expect(eventCheck).toBe(true);
				done();
			});
	});
	it("hooks before send", function(done) {
		var eventCheck = false;
		jacks()
			.get(url)
			.hook('beforeSend', function(data) {
				eventCheck = true;
			})
			.send(function(response) {
				expect(eventCheck).toBe(true);
				done();
			});
	});
	it("hooks before error", function(done) {
		var eventCheck = false;
		jacks()
			.get("htp://error")
			.hook('beforeError', function(data) {
				eventCheck = true;
			})
			.send(null, function(err) {
				expect(eventCheck).toBe(true);
				done();
			});
	});
	it("hooks before response", function(done) {
		var eventCheck = false;
		jacks()
			.get(url)
			.hook('beforeResponse', function(data) {
				eventCheck = true;
			})
			.send(function(err) {
				expect(eventCheck).toBe(true);
				done();
			});
	});
});