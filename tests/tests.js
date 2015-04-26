function notVader(jacksRequest) {
	// All request must have this query parameter
	jacksRequest.query("iAmNot", "Vader");
}
var url = "./foo.json";
jacks.get(url)
.query("param1", "value")
.use(notVader)
.send(function(res) {
	alert("1\n" + JSON.stringify(res));
});

jacks.get(url)
.query("param2", "value")
.use("Q")
.send()
.then(function(res) {
	alert("2\n" + JSON.stringify(res));
});

jacks
.get(url)
.use("cache")
.query("param3", "value")
.send(function(res) {
	alert("31\n" + JSON.stringify(res));
	jacks.get(url)
	.use("cache")
	.query("param3", "value")
	.send(function(res) {
		alert("32\n" + JSON.stringify(res));
	});	
});

jacks
.get("http://localhost:9001/tests.js")
.query("param4", "value")
.on("abort", function() {
	alert("aborted !!");
})
//.timeout(0)
.send(function(res) {
	alert("4\n" + JSON.stringify(res));
}, function(e) {
	alert("error\n" + JSON.stringify(e));
});
//.abort();
