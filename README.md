# Jacks
Fluent extensible ajax framework.

GET http://my.api/todos?limit=50
```Javascript
jacks.get("http://my.api/todos")
     .query("limit", "50")
     .header("Accepts", "application/json")
     .send(function(jacksResponse) {
     	// Callback success
     }, function(jacksError) {
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
     }, function(jacksError) {
     	// Callback error
     });
```

# Api
## plugin(&lt;String&gt; pluginName, &lt;Function&gt; pluginFn)
You can add a plugin to jacks using the plugin() function on jacks (not on request)
```javascript
jacks.plugin("pluginName", function(jacksRequest) {
	// Access to all request methods
});
```
A plugin is a function wich receives the request as parameter.

## use(&lt;String&gt; pluginName) | use(&lt;Function&gt; pluginFn)
Use a plugin. Parameter can be the name of a declared plugin or a function for a live plugin
```Javascript
jacks.use("myPlugin")
     .use(function(jacksRequest) {
	// Plugin code
     })
```
This plugin will be used for all requests.

## Create a JacksRequest
Create a request with the get/post/put/delete methods. Each receives the url as argument.

```jacks.get(url)``` : creates a GET request with the url

```jacks.post(url)``` : creates a POST request with the url

```jacks.put(url)``` : creates a PUT request with the url

```jacks.delete(url)``` : creates a DELETE request with the url

```jacks.options(url)``` : creates a OPTIONS request with the url

```jacks.head(url)``` : creates a HEAD request with the url

## JacksRequest API
### jacksRequest.body(&lt;Object&gt; data)
Sets the body. Only for POST and PUT
```Javascript
jacks.post("http://myurl")
     .body({"age": 35, "city": "Bordeaux"})
     .send(function(jacksReponse) {
     	// Callback success
     }, function(jacksError) {
     	// Callback error
     });
```

### jacksRequest.query(&lt;String&gt; name, &lt;String&gt; value) | query(&lt;Object&gt; params)
Add query parameters. Will concatenate the query parameters to the URL.
```Javascript
jacks.get("http://myurl")
     .query("age", "35")
     .query({"age": 35, "city": "Bordeaux"})
     .send(function(jacksReponse) {
     	// Callback success
     }, function(jacksError) {
     	// Callback error
     });
```

### jacksRequest.header(&lt;String&gt; name, &lt;String&gt; value)
Add a request header.
```Javascript
jacks.get("http://myurl")
     .header("X-MY-HEADER", "foo")
```

### jacksRequest.use(&lt;String&gt; pluginName) | use(&lt;Function&gt; pluginFn)
Use a plugin. Parameter can be the name of a declared plugin or a function for a live plugin
```Javascript
jacks.get("http://myurl")
     .use("myPlugin")
     .use(function(jacksRequest) {
	// Plugin code
     })
```
The plugin will be used for this request only.

### jacksRequest.on(&lt;String&gt; eventName, &lt;Function&gt; callback)
Register a callback for an event on the request.

Available events
* open : when the xmlHttpRequest is opened
* send : when the xmlHttpRequest is sent
* timeout : when the request has been aborted due to a timeout
* abort : when the request has been aborted

### jacksRequest.abort()
Aborts the request.

### jacksRequest.timeout(&lt;int&gt; delay)
Defines a timeout for the request. After the delay (in ms) the request will be aborted.

### jacksRequest.send(&lt;Function&gt; callback, &lt;function&gt; error)
Sends the request.

#### callback
The callback function takes JacksResponse object as parameter witch contains
```Javascript
{
	url : <url called>
	status : <http status code>,
	statusText : <http status text>,
	responseText : <raw response body>,
	response : <parsed response body. The parser is selected with Content-Type header. If no parser is found, will contain the raw response body>
	headers : <response headers>
}
```

#### error
The error function takes a JacksError as parameter with contains
```Javascript
{
	url : <url called>
	type : <error type>
}
```
Type will be 
 - "timeout" if request has been interrupted after a timeout
 - "abort" if request has been aborted
