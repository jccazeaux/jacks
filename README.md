# Jacks
Fluent extensible ajax framework.

GET http://my.api/todos?limit=50
```Javascript
jacks.get("http://my.api/todos")
     .query("limit", "50")
     .header("Accepts", "application/json")
     .send(function(jacksResponse) {
     	// Callback success
     }, function(e) {
     	// Callback error
     });
```

POST 
```Javascript
jacks.post("http://my.api/todos")
     .body({"title", "Finish the job", 
	    "date", "2015/12/31"})
     .header("Content-Type", "application/json")
     .send(function(jacksResponse) {
     	// Callback success
     }, function(e) {
     	// Callback error
     });
```

# Api
## plugin(<String> pluginName, <Function> pluginFn)
You can add a plugin to jacks using the plugin() function on jacks (not on request)
```javascript
jacks.plugin("pluginName", function(jacksRequest) {
	// Access to all request methods
});
```
A plugin is a function wich receives the request as parameter.

## use(<String> pluginName) | use(<Function> pluginFn)
Use a plugin. Parameter can be the name of a declared plugin or a function for a live plugin
```Javascript
jacks.use("myPlugin")
     .use(function(jacksRequest) {
	// Plugin code
     })
```
This plugin will be used for all requests.

## Requests
Create a request with the get/post/put/delete methods. Each receives the url as argument.

```jacks.get(url)``` : creates a GET request with the url

```jacks.post(url)``` : creates a POST request with the url

```jacks.put(url)``` : creates a PUT request with the url

```jacks.delete(url)``` : creates a DELETE request with the url

## Request API
### body(<Object> data)
Sets the body. Only for POST and PUT
```Javascript
jacks.post("http://myurl")
     .body({"age": 35, "city": "Bordeaux"})
     .send(function(jacksReponse) {
     	// Callback success
     }, function(e) {
     	// Callback error
     });
```

### query(<String> name, <String> value) | query(<object> params)
Add query parameters. Will concatenate the query parameters to the URL.
```Javascript
jacks.get("http://myurl")
     .query("age", "35")
     .query({"age": 35, "city": "Bordeaux"})
     .send(function(jacksReponse) {
     	// Callback success
     }, function(e) {
     	// Callback error
     });
```

### header(<String> name, <String> value)
Add a request header.
```Javascript
jacks.get("http://myurl")
     .header("X-MY-HEADER", "foo")
```

### use(<String> pluginName) | use(<Function> pluginFn)
Use a plugin. Parameter can be the name of a declared plugin or a function for a live plugin
```Javascript
jacks.get("http://myurl")
     .use("myPlugin")
     .use(function(jacksRequest) {
	// Plugin code
     })
```
The plugin will be used for this request only.

### send(<Function> callback, <function> error)
Sends the request.

The callback function will receive a JacksResponse object witch contains
```Javascript
{
	status : <http status code>,
	statusText : <http status text>,
	responseText : <raw response body>,
	response : <parsed response body. The parser is selected with Content-Type header. If no parser is found, will contain the raw response body>
	headers : <response headers>
}
```
# Exemples
```javascript
jacks.get("http://localhost/")
     .query("param1", "value1")
     .query("param2", "value2")
     .send(function(jacksReponse) {
     	// Callback success
     }, function(e) {
     	// Callback error
     });
```

