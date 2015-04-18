# Plugin Jacks-Q
This plugin promises jacks. The send methods is wrapped to send a promise. The new send methods does not take parameters.

## Dependencies
This plugin is based on Q : https://github.com/kriskowal/q

You must include Q in your application

## Exemple

```Javascript
jacks.get("http://localhost")
.send()
.then(function(res) {
	alert(JSON.stringify(res));
});
```