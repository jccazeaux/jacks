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


## Define a plugin
You can add a plugin to jacks using the plugin() function on jacks (not on request)
```javascript
jacks.plugin("pluginName", function(jacksRequest) {
	// Access to all request methods
});
```
A plugin is a function wich receives the request as parameter.

## Use a plugin
To use au plugin, simplye call it with use() function
```javascript
// Global use, will impact all jacks requests
jacks.use("pluginName");
// Request specific
jacks.get("http://myrurl")
.use("pluginName")
```

### Anonymous plugin
Jacks accepts anonymous plugins. An anonymous plugin is a plugin that will not be defined using the plugin() function.

Call anonymous plugins with use() function by passing a function :

```javascript
// Global anonymous plugin
jacks.use(function(jacksRequest) {
	// All request must have this query parameter
	jacksRequest.query("iAm", "Yoda");
});
// Request specific anonymous plugin
jacks.get("http://myrurl")
.use(function(jacksRequest) {
	// plugin code
})
```

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

