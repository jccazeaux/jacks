![Travis CI](https://travis-ci.org/jccazeaux/Jacks.svg?branch=master)

# Jacks
Fluent extensible ajax framework.

GET http://my.api/todos?limit=50
```Javascript
jacks().get("http://my.api/todos")
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
jacks().post("http://my.api/todos")
     .body({"title": "Finish the job", 
	    "date": "2015/12/31"})
     .header("Content-Type", "application/json")
     .send(function(jacksResponse) {
     	// Callback success
     }, function(jacksError) {
     	// Callback error
     });
```

# Installation

* Download the [latest release](https://github.com/jccazeaux/jacks/releases/download/v0.2.1/jacks.min.js).
* Clone the repo: `git clone https://github.com/jccazeaux/jacks.git`.
* Install with npm: `npm install jacks-js`.


# Main API
## jacks()
This creates a new instance of jacks. This instance will be an empty shell and the base to create requests. Each instance will have its own configuration (see plugins and use). So you can have many instances of jacks, each using different sorts of configuration. In your application you should keep the instances in a context to avoid a recreation each time you need it.

A jacks instance is only the beginning, to start a request use the methods described below.

## jacks().get(&lt;String&gt; url)
Creates a GET JacksRequest with the url

## jacks().post(&lt;String&gt; url)
Creates a POST JacksRequest with the url

## jacks().put(&lt;String&gt; url)
Creates a PUT JacksRequest with the url

## jacks().delete(&lt;String&gt; url)
Creates a DELETE JacksRequest with the url

## jacks().options(&lt;String&gt; url)
Creates a OPTIONS JacksRequest with the url

## jacks().head(&lt;String&gt; url)
Creates a HEAD JacksRequest with the url

## jacks.plugin(&lt;String&gt; pluginName, &lt;Function&gt; pluginFn)
You can add a plugin to jacks using the plugin() function on jacks (not on request)
```javascript
jacks.plugin("pluginName", function(jacksRequest) {
	// Access to all request methods
});
```
A plugin is a function wich receives the request as parameter.

## jacks.use(&lt;String&gt; pluginName) | use(&lt;Function&gt; pluginFn)
Use a plugin. Parameter can be the name of a declared plugin or a function for a live plugin
```Javascript
jacks().use("myPlugin")
     .use(function(jacksRequest) {
	// Plugin code
     })
```
This plugin will be used for all requests.

## Mocks
Jacks comes with a mock API.

```Javascript
jacks.mock(request, response);
```

### request
Request defines wich requests are mocked. It contains two attributes

* url : url of mocked resource. Can be a String or a regular expression
* method : mocked method. If not specifed, all methods will be mocked

### response
Mocked response to send

* responseText : Text of the response
* response : function callback to create a dynamic responseText. The function takes as only parameter a "done" callback. Use it if your callback is asynchronous.
* headers : response headers
* status : status code
* statusText : status text
* error : mock an error
* delay : simulates a delayed response. In ms.

### Exemples
#### Basic mock

```Javascript
jacks.mock({
     url: "/myurl"
}, {
     responseText: "My mocked response",
     headers: {"Content-Type": "plain/text"}
});
```
#### Dynamic mock

```Javascript
jacks.mock({
     url: "/myurl"
}, {
     response: function() {
          this.responseText = "My dynamic mock";
     },
     headers: {"Content-Type": "plain/text"}
});
```

#### Asynchronous dynamic mock

```Javascript
jacks.mock({
     url: "/myurl"
}, {
     response: function(done) {
          var that = this;
          setTimeout(function() {
               that.responseText = "My dynamic mock";
               done();
          }, 0);
     },
     headers: {"Content-Type": "plain/text"}
});
```


# JacksRequest API
## jacksRequest.body(&lt;Object&gt; data)
Sets the body. Only for POST and PUT
```Javascript
jacks().post("http://myurl")
     .body({"age": 35, "city": "Bordeaux"})
     .send(function(jacksReponse) {
     	// Callback success
     }, function(jacksError) {
     	// Callback error
     });
```

## jacksRequest.query(&lt;String&gt; name, &lt;String&gt; value) | query(&lt;Object&gt; params)
Add query parameters. Will concatenate the query parameters to the URL.
```Javascript
jacks().get("http://myurl")
     .query("age", "35")
     .query({"age": 35, "city": "Bordeaux"})
     .send(function(jacksReponse) {
     	// Callback success
     }, function(jacksError) {
     	// Callback error
     });
```

## jacksRequest.header(&lt;String&gt; name, &lt;String&gt; value)
Add a request header.
```Javascript
jacks().get("http://myurl")
     .header("X-MY-HEADER", "foo")
```

## jacksRequest.use(&lt;String&gt; pluginName) | use(&lt;Function&gt; pluginFn)
Use a plugin. Parameter can be the name of a declared plugin or a function for a live plugin
```Javascript
jacks().get("http://myurl")
     .use("myPlugin")
     .use(function(jacksRequest) {
	// Plugin code
     })
```
The plugin will be used for this request only.

## jacksRequest.on(&lt;String&gt; eventName, &lt;Function&gt; callback)
Register a callback for an event on the request.

Available events
* timeout : when the request has been aborted due to a timeout
* abort : when the request has been aborted
* loadstart : XMLHttpRequest loadstart event
* loadend : XMLHttpRequest loadend event
* progress : XMLHttpRequest progress event
* upload-progress : XMLHttpRequest upload progress event

## jacksRequest.abort()
Aborts the request.

## jacksRequest.sync()
Switches the request to synchronous mode. By default it's asynchronous.

## jacksRequest.timeout(&lt;int&gt; delay)
Defines a timeout for the request. After the delay (in ms) the request will be aborted.

## jacksRequest.send(&lt;Function&gt; callback, &lt;function&gt; error)
Sends the request.

## jacksRequest.sendAsBinary(&lt;Function&gt; callback, &lt;function&gt; error)
Sends the request as binary.

### callback
The callback function takes JacksResponse object as parameter witch contains
```Javascript
{
	status : <http status code>,
	statusText : <http status text>,
	responseText : <raw response body>,
	response : <parsed response body. The parser is selected with Content-Type header. If no parser is found, will contain the raw response body>,
	headers : <response headers>,
     getHeader(name): <function to get one header. Delegates it to xhr>
}
```

### error
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
