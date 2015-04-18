# Jacks
Fluent extensible ajax framework.

# Api
## Requests
### Create a request
Create a request with the get/post/put/delete methods. Each receives the url as argument.

jacks.get(url) : creates a GET request with the url
jacks.post(url) : creates a POST request with the url
jacks.put(url) : creates a PUT request with the url
jacks.delete(url) : creates a DELETE request with the url

### Request API
#### data()
#### query()
#### header()
#### send()
#### plugin()


## Global plugin
You can add a plugin to all requests with the plugin method on jacks
```javascript
jacks.plugin(function(jacksRequest) {
	// Access to all request methods
});
```
A plugin is a function wich receives the request as parameter.

# Exemples
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
