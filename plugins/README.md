# Plugin Jacks-Q
This plugin promises jacks. The send methods is wrapped to send a promise. The new send methods does not take parameters.

## Dependencies
This plugin is based on Q : https://github.com/kriskowal/q

You must include Q in your application

## Exemple

```Javascript
jacks.get("http://localhost")
.use("Q")
.send()
.then(function(res) {
	alert(JSON.stringify(res));
});
```

# Plugin Jacks-cache
This plugin loads the GET request and then puts the response in a cache. The key is the URL. The cache is very basic for now, it's more like a lazy loading as it does not handle any time to live for the elements.

## Dependencies
None

## Exemple

```Javascript
jacks.get("http://localhost")
.use("cache")
.send()
.then(function(res) {
	alert(JSON.stringify(res));
});
```
