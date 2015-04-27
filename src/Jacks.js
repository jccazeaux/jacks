var jacks = (function () {
	"use strict";
	
	var exports = function() {
		return new Jacks();
	};

	/** Plugins configured */
	var plugins = {};

	/**
	 * Add a plugin, this doesn't activate it
	 * @param {String} name - Name of the plugin
	 * @param {Function} fn - plugin function. Will receive the JacksRequest as parameter
	 */
	exports.plugin = function(name, fn) {
		plugins[name] = fn;
		return this;
	};

	/**
	 * Jacks main object
	 * This constructor construct a Jacks object. Having Jacks objects authorize many instances. You can configure plugin uses 
	 * and parsers by instance
	 */
	function Jacks() {
		var globalUses = [];

		/** Serializers initialized with default serializers */
		var serializers = {
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

		/** Parsers initialized with default parsers */
		var parsers = {
			"application/json": function(data) {
				return JSON.parse(data);
			}
		};
		var listeners = {};


		function getXHR() {
		  if (window.XMLHttpRequest) {
		    return new XMLHttpRequest();
		  } else {
		    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
		    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
		    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
		    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
		  }
		  return false;
		}
		/**
		 * Serialize body with chosen type
		 * @param {Object} body
		 * @return String
		 */
		function serialize(body, type) {
			var serializer = serializers[type];
			if (serializer === undefined || serializer === null) {
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
				for (var param in query) {
					actualUrl += token + param + "=" + encodeURIComponent(query[param]);
					token = "&";
				}
			}
			return actualUrl;
		}

		/**
		 * JacksResponse Object
		 * @param {XMLHttpRequest} xhr
		 * @param {JacksRequest} jacksRequest
		 */
		function JacksResponse(xhr, jacksRequest) {
			this.url = jacksRequest.url;
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
		 * JacksError Object
		 * @param {XMLHttpRequest} xhr
		 * @param {JacksRequest} jacksRequest
		 */
		function JacksError(xhr, jacksRequest) {
			this.type = xhr.type;
			this.url = jacksRequest.url;
		}


		/**
		 * Request object with all request elements
		 * @param {String} requestType
		 * @param {String} url
		 */
		function JacksRequest(requestType, url) {
			/** timeout handler */
			var timeoutHandler = null;
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
			};

			/**
			 * Sends the request
			 * @param {Function} callback
			 * @param {Function} error
			 */
			this.send = function(callback, error) {
				var xhr = getXHR();
				this.xhr = xhr;
		  		// state change
				xhr.onreadystatechange = function(){
					if (xhr.readyState != 4) return;

					stopTimeout();
					// IE9 bug fix (status read if request aborted results in error...)
					var status;
	   				try { status = xhr.status; } catch(e) { status = 0; }

	   				if (status === 0) {
	   					// if request is aborted or timed out, then we launch error.
	   					if (that.aborted) {
	   						return error({type:"abort", url: that.url}, that);
	   					} else if (that.timedout) {
	   						return error({type:"timeout", url: that.url}, that);
	   					}
	   					// else error, ignore statechange
	   					return;
	   				}
					callback(new JacksResponse(xhr, that));
				};
				xhr.onerror = function(e) {
					error(new JacksError(e, that), that);
				};
				xhr.open(requestType, that.url);
				emit("open");
				for (var header in headers) {
					xhr.setRequestHeader(header, headers[header]);
				}

				var bodySerialized = null;
				if (body != null && typeof body === "object") {
					bodySerialized = serialize(body, headers["Content-Type"]);
				} else {
					bodySerialized = body;
				}

				xhr.send(bodySerialized);
				emit("send");
				return this;
			};

			/**
			 * Abord a request
			 */
			this.abort = function() {
				this.aborted = true;
				emit("abort");
				this.xhr.abort();
				return this;
			};

			/**
			 * Define a timeout on the request
			 */
			this.timeout = function(delay) {
				setTimeout(function() {
					emit("timeout");
					this.timedout = true;
					this.xhr.abort();
				}, delay);
				return this;
			};

			/**
			 * Register to an event on the request.
			 */
			this.on = function(eventName, fn) {
				listeners[eventName] = listeners[eventName] || [];
				listeners[eventName].push(fn);
				return this;
			};

			// Exec plugins
			for (var i = 0 ; i < globalUses.length ; i++) {
				this.use(globalUses[i]);
			}


			/**
			 * Emit event
			 * @param {String} eventName
			 * @param {Object} data
			 */
			function emit(eventName, data) {
				var eventListeners = listeners[eventName];
				if (eventListeners) {
					for (var i = 0 ; i < eventListeners.length ; i++) {
						eventListeners[i](data);
					}
				}
			}

			/**
			 * stops the current timeout if exists
			 */
			function stopTimeout() {
				if (timeoutHandler) {
					clearTimeout(timeoutHandler);
					timeoutHandler = null;
				}
			}
		}

		this.get = function(url) {
			return new JacksRequest("GET", url);
		};
		this.post = function(url) {
			return new JacksRequest("POST", url);
		};
		this.put = function(url) {
			return new JacksRequest("PUT", url);
		};
		this.options = function(url) {
			return new JacksRequest("OPTIONS", url);
		};
		this.head = function(url) {
			return new JacksRequest("HEAD", url);
		};
		this["delete"] = function(url) {
			return new JacksRequest("DELETE", url);
		};
		this.use = function(pluginNameOrFn) {
			globalUses.push(pluginNameOrFn);
			return this;
		};
		this.parser = function(type, parserFn) {
			parsers[type] = parserFn;
			return this;
		};
		this.serializer = function(type, serializerFn) {
			serializers[type] = serializerFn;
			return this;
		};
		return this;
	}
	return exports;
})();

window.jacks = jacks;