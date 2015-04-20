(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var jacks = (function() {
	var plugins = {};
	var globalUses = [];
	var exports = {};
	var serializers = require("./serializers");
	var parsers = require("./parsers");


	function getXHR() {
	  if (window.XMLHttpRequest) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	};
	/**
	 * Serialize body with chosen type
	 * @param {Object} body
	 * @return String
	 */
	function serialize(body, type) {
		var serializer = serializers[type];
		if (serializer == null) {
			throw "No serializer found for type " + type; 
		}
		return serializer(body);
	}

	/**
	 * ProcessUrl with query parameters
	 * @param {String} url
	 * @return String
	 */
	function processUrl(url, query) {
		var token,
			actualUrl = url;
		if (actualUrl.indexOf("?") > 0) {
			token = "&";
		} else {
			token = "?";
		}
		if (query != null) {
			for (param in query) {
				actualUrl += token + param + "=" + encodeURIComponent(query[param]);
				token = "&";
			}
		}
		return actualUrl;
	}

	function JacksResponse(xhr) {
		this.status = xhr.status;
		this.statusText = xhr.statusText;
		this.responseText = xhr.responseText;
		var contentType = xhr.getResponseHeader("Content-Type");
		if (parsers[contentType]){
			this.response = parsers[contentType](xhr.responseText);
		} else {
			xhr.response = xhr.responseText;
		}
		this.headers = xhr.getAllResponseHeaders();
	}


	/**
	 * Request object with all request elements
	 * @param {String} requestType
	 * @param {String} url
	 */
	function JacksRequest(requestType, url) {
		/** Request headers */
		var headers = {};
		/** Body, only for post/put */
		var body = null;
		/** Query parameters, to append on url */
		var query = null;
		/**
		 * request type
		 */
		this.requestType = requestType;
		/**
		 * url
		 */
		this.url = url;
		var that = this;

		/**
		 * Add one or more headers. To add one, send param and value. To add more, send an key/value object.
		 * @param name - name of the header or key/value object
		 * @param value - value of the header. Ignored if name is an object
		 * @returns this or the headers if first param is undefined
		 */
		this.header = function(name, value) {
			if (name === undefined) {
				return headers;
			}
			headers[name] = value;
			return this;
		};

		/**
		 * Add one or more body. To add one, send param and value. To add more, send an key/value object.
		 * @param name - name of the body or key/value object
		 * @param value - value of the body. Ignored if name is an object
		 * @returns this or the body if first param is undefined
		 */
		this.body = function(value) {
			if (name === undefined) {
				return body;
			}
			body = value;
			return this;
		};

		/**
		 * Add one or more query parameters. To add one, send param and value. To add more, send an key/value object.
		 * @param name - name of the query parameter or key/value object
		 * @param value - value of the query parameter. Ignored if name is an object
		 * @returns this or the query parameters if first param is undefined
		 */
		this.query = function(name, value) {
			if (name === undefined) {
				return query;
			}
			query = query || {};
			if (typeof name === "string") {
				query[name] = value;
				var queryTemp = {};
				queryTemp[name] = value;
				that.url = processUrl(that.url, queryTemp);
			} else if (typeof name === "object") {
				for (var attr in name) {
					query[attr] = name[attr];
					that.url = processUrl(that.url, name);
				}
			}
			return this;
		};

		/**
		 * executes a plugin
		 * @param {Function} pluginFn
		 */
		this.use = function(pluginNameOrFn) {
			if (typeof pluginNameOrFn == "string") {
				if (plugins[pluginNameOrFn] == null) {
					throw "Plugin " + globalUses[i] + " not found";
				}
				plugins[pluginNameOrFn](this);
			} else if (typeof pluginNameOrFn === "function") {
				pluginNameOrFn(this);
			}
			return this;
		}

		/**
		 * Sends the request
		 * @param {Function} callback
		 * @param {Function} error
		 */
		this.send = function(callback, error) {
			var xhr = getXHR();
	  		// state change
			xhr.onreadystatechange = function(){
				if (xhr.readyState != 4) return;

				callback(new JacksResponse(xhr));
			};
			xhr.onerror = function(e) {
				error(e);
			}
			xhr.open(requestType, that.url);
			for (var header in headers) {
				xhr.setRequestHeader(header, headers[header]);
			}

			var bodySerialized = null;
			if (body != null && typeof body === "object") {
				bodySerialized = serialize(body, headers["Content-Type"])
			} else {
				bodySerialized = body;
			}

			xhr.send(bodySerialized);
		}

		// Exec plugins
		for (var i = 0 ; i < globalUses.length ; i++) {
			this.use(globalUses[i]);
		}
	}

	exports.get = function(url) {
		return new JacksRequest("GET", url);
	}
	exports.post = function(url) {
		return new JacksRequest("POST", url);
	}
	exports.put = function(url) {
		return new JacksRequest("PUT", url);
	}
	exports["delete"] = function(url) {
		return new JacksRequest("DELETE", url);
	}
	exports.plugin = function(name, pluginObject) {
		plugins[name] = pluginObject;
		return this;
	}
	exports.use = function(pluginNameOrFn) {
		globalUses.push(pluginNameOrFn);
		return this;
	}
	exports.parser = function(type, parserFn) {
		parsers[type] = parserFn;
		return this;
	}
	exports.serializer = function(type, serializerFn) {
		serializers[type] = serializerFn;
		return this;
	}
	return exports;
})();

window.jacks = jacks;
},{"./parsers":2,"./serializers":3}],2:[function(require,module,exports){
module.exports = {
	"application/json": function(data) {
		return JSON.parse(data);
	}
};
},{}],3:[function(require,module,exports){
module.exports = {
		"application/json": function(data) {
			return JSON.stringify(data);
		},
		"application/x-www-form-urlencoded": function(data) {
			var arr = [];
			for (var attr in data) {
				arr.push(encodeURIComponent(attr) + '=' + encodeURIComponent(data[attr]));
			}
			return arr.join('&');
		}
	};

},{}]},{},[1]);
