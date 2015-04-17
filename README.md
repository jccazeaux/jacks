# Jacks
Fluent ajax framework

# Exemple
```javascript
jacks
.get("http://localhost/")
.query("param1", "value1")
.query("param2", "value2")
.send(function(res) {
	alert(res);
});
```

## Global plugin
```javascript
jacks.plugin(function(jacksRequest) {
	// All request must have this query parameter
	jacksRequest.query("iAm", "Yoda");
});
```

## Request specific plugin
```javascript
function notVader(jacksRequest) {
	// All request must have this query parameter
	jacksRequest.query("iAmNot", "Vader");
}

jacks
.get("http://localhost/")
.plugin(notVader);
.query("param1", "value1")
.query("param2", "value2")
.send(function(res) {
	alert(res);
});
```
