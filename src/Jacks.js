var jacks = (function () {
	"use strict";

	var xhrLevel;

	/** Array of mocks */
	var mocks = [];

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
	 * Adds a mock
	 * @param {Object} request - request to mock. Can contain url and method
	 * @param {Object|Function} response - response settings for this mock. If it's a function, it must return a settings object
	 */
	exports.mock = function(req, res) {
		mocks.push({request: req, response: res});
		return this;
	};
	/**
	 * Clears all the mocks
	 */
	exports.clearMocks = function() {
		mocks = [];
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

		/** registered event listeners */
		var listeners = {};

		/** registered hooks */
		var hooks = {};


		/**
		 * XHR polyfills
		 * - sendAsBinary
		 */
		function polyfillXhr() {
			if (typeof XMLHttpRequest.prototype.sendAsBinary !== "function") {
				// http://javascript0.org/wiki/Portable_sendAsBinary
				XMLHttpRequest.prototype.sendAsBinary = function(text){
					var data = new ArrayBuffer(text.length);
					var ui8a = new Uint8Array(data, 0);
					for (var i = 0; i < text.length; i++) ui8a[i] = (text.charCodeAt(i) & 0xff);
		 
					var bb = new BlobBuilder(); // doesn't exist in Firefox 4
					bb.append(data);
					var blob = bb.getBlob();
					this.send(blob);
				};
			}
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
			this.xhr = xhr;
			this.url = xhr.responseURL;
			this.status = xhr.status;
			this.statusText = xhr.statusText;
			this.responseText = xhr.responseText;
			var contentType = xhr.getResponseHeader("Content-Type");
			if (parsers[contentType]){
				this.response = parsers[contentType](xhr.responseText);
			} else {
				this.response = xhr.responseText;
			}
			this.headers = xhr.getAllResponseHeaders();
			this.getHeader = xhr.getResponseHeader;
		}

		/**
		 * JacksError Object
		 * @param {XMLHttpRequest} xhr
		 * @param {JacksRequest} jacksRequest
		 */
		function JacksError(xhr, jacksRequest, type, origin) {
			this.xhr = xhr;
			this.type = type;
			this.origin = origin;
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
			/** async mode */
			var async = true;
			/** request type */
			this.requestType = requestType;
			/** url */
			this.url = url;
			/** XHR, instanciate it now to initiate all */
			this.xhr = getXHR();
			var that = this;

			// OpenXhr function, will be setted with xhr1 or xhr2. Depends on browser
			var openXhr;

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
			 * Switches to sync mode
			 * @returns this or the body if first param is undefined
			 */
			this.sync = function() {
				async = false;
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
			 * Cross browser XHR
			 * It will also distinguish xhr level 1 or level 2
			 */
			function getXHR() {
			  if (window.XMLHttpRequest) {
				// First we test wich xhr we can use
				if (new XMLHttpRequest().upload) {
					xhrLevel = 2;
					openXhr = openXhr2;
				} else {
					xhrLevel = 1;
					openXhr = openXhr1;
				}
				return new XMLHttpRequest();
			  } else {
			  	xhrLevel = 1;
			  	openXhr = openXhr1;
			    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
			    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
			    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
			    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
			  }
			  return false;
			}
			/**
			 * Send mocked
			 * @param {Function} callback - OK callback
			 * @param {error} error - error callback
			 * @param {mock} mock - object containing mock response
			 */
			function sendMocked(callback, error, mock) {

				var done = function() {
					var xhr = {
						responseText: mock.responseText,
						getAllResponseHeaders: function() {
							return mock.headers;
						},
						getResponseHeader: function(name) {
							var headersFound = [];
							if (mock.headers) {
								for (var headerName in mock.headers) {
									if (headerName.toLowerCase() === name.toLowerCase()) {
										headersFound.push(mock.headers[headerName]);
									}
								}
							}
							return headersFound.join(", ");
						},
						status: mock.status,
						statusText: mock.statusText
					};
					
					var endingFn;
					if (mock.error) {
						endingFn = function() {
							var err = new JacksError(xhr, that, mock.error.type, mock.error);
							triggerHook("beforeError", {request: that, error: err});
							if (error) error(err);
						};
					} else {
						endingFn = function() {
							try {
				   				var response = new JacksResponse(xhr, that);
								triggerHook("beforeResponse", {request: that, response: response});
								callback && callback(response);
							} catch(e) {
								var err = new JacksError(xhr, that, "parsing", e);
								triggerHook("beforeError", {request: that, error: err});
								error && error(err);
							}
						};
					}
					if (async) {
						setTimeout(endingFn, mock.delay||0);
					} else {
						endingFn();
					}

				};

				// If we have a function in mock.response, execute it. 
				if (typeof mock.response === "function") {
					// If it has no parameter, execute done synchronously
					if (mock.response.length === 0) {
						mock.response();
						done();
					} else {
						// If it has one parameter, send the done
						mock.response(done);
					}
				} else {
					done();
				}
			}

			/**
			 * Open XHR level 1
			 */
			function openXhr1(callback, error) {
				var xhr = that.xhr;
				// state change
				xhr.onreadystatechange = function(e){
					if (xhr.readyState != 4) return;

					stopTimeout();
					// IE9 bug fix (status read if request aborted results in error...)
					var status;
	   				try { status = xhr.status; } catch(e) { status = 0; }

	   				if (status === 0) {
	   					// if request is aborted or timed out, then we launch error.
	   					if (that.aborted) {
							var err = {type:"abort", url: that.url};
							triggerHook("beforeError", {request: that, error: err});
							if (error) return error(err);
	   					} else if (that.timedout) {
							var err = {type:"timeout", url: that.url};
							triggerHook("beforeError", {request: that, error: err});
							if (error) return error(err);
	   					}
	   					// else error, ignore statechange
	   					return;
	   				}
	   				try {
	   					var response = new JacksResponse(xhr, that);
						triggerHook("beforeResponse", {request: that, response: response});
						if (callback) callback(response);
	   				} catch(e) {
	   					var err = new JacksError(xhr, that, "parsing", e);
						triggerHook("beforeError", {request: that, error: err});
						if (error) error(err);
					}
				};
				xhr.onerror = function(e) {
					var err = new JacksError(xhr, that, e.type, e);
					triggerHook("beforeError", {request: that, error: err});
					if (error) error(err, that);
				};

				triggerHook("beforeOpen", {request: that});
				xhr.open(requestType, that.url, async);
				for (var header in headers) {
					xhr.setRequestHeader(header, headers[header]);
				}
			}

			/**
			 * Open XHR level 2
			 */
			function openXhr2(callback, error) {
				var xhr = that.xhr;
		  		// state change
				xhr.onload = function(e){
					stopTimeout();

	   				try {
	   					var response = new JacksResponse(xhr, that);
						triggerHook("beforeResponse", {request: that, response: response});
						if (callback) callback(response);
	   				} catch(e) {
	   					var err = new JacksError(xhr, that, "parsing", e);
						triggerHook("beforeError", {request: that, error: err});
						if (error) error(err);
					}
				};
				xhr.onerror = function(e) {
					var err = new JacksError(xhr, that, e.type, e);
					triggerHook("beforeError", {request: that, error: err});
					error(err);
				};
				xhr.onprogress = function(e) {
					emit("progress", e);
				};
				xhr.onabort = function(e) {
					emit("abort", e);
				};
				xhr.ontimeout = function(e) {
					emit("timeout", e);
				};
				xhr.onloadstart = function(e) {
					emit("loadstart", e);
				};
				xhr.onloadend = function(e) {
					emit("loadend", e);
				};
				xhr.upload.onprogress = function(e) {
					emit("upload-progress", e);
				};
				triggerHook("beforeOpen", {request: that});
				xhr.open(requestType, that.url, async);
				for (var header in headers) {
					xhr.setRequestHeader(header, headers[header]);
				}
			}

			/**
			 * Sends the request
			 * @param {Function} callback
			 * @param {Function} error
			 */
			this.send = function(callback, error) {

				var mockedResponse = getMock();
				if (mockedResponse) {
					sendMocked(callback, error, mockedResponse);
					return this;
				}
				openXhr(callback, error);

				var bodySerialized = null;
				if (body != null && typeof body === "object") {
	   				try {
						bodySerialized = serialize(body, headers["Content-Type"]);
	   				} catch(e) {
	   					var err = new JacksError(xhr, that, "serializer", e);
						triggerHook("beforeError", {request: that, error: err});
						error && error(err);
					}
				} else {
					bodySerialized = body;
				}

				this.xhr.send(bodySerialized);
				return this;
			};

			/**
			 * Sends the request
			 * @param {Function} callback
			 * @param {Function} error
			 */
			this.sendAsbinary = function(callback, error) {

				var mockedResponse = getMock();
				if (mockedResponse) {
					sendMocked(callback, error, mockedResponse);
					return this;
				}
				openXhr(callback, error);

				var bodySerialized = null;
				if (body != null && typeof body === "object") {
	   				try {
						bodySerialized = serialize(body, headers["Content-Type"]);
	   				} catch(e) {
	   					var err = new JacksError(xhr, that, "serializer", e);
						triggerHook("beforeError", {request: that, error: err});
						error && error(err, that);
					}
				} else {
					bodySerialized = body;
				}

				xhr.sendAsBinary(bodySerialized);
				return this;
			};

			/**
			 * Abord a request
			 */
			this.abort = function() {
				this.aborted = true;
				this.xhr.abort();
				return this;
			};

			/**
			 * Define a timeout on the request
			 */
			this.timeout = function(delay) {
				setTimeout(function() {
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

			/**
			 * Register to an event on the request.
			 */
			this.hook = function(hookName, fn) {
				hooks[hookName] = hooks[hookName] || [];
				hooks[hookName].push(fn);
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
			 * Emit event
			 * @param {String} hookName
			 * @param {Object} data
			 */
			function triggerHook(hookName, data) {
				var hooksListeners = hooks[hookName];
				if (hooksListeners) {
					for (var i = 0 ; i < hooksListeners.length ; i++) {
						hooksListeners[i](data);
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

			/**
			 * Gets the mock corresponding to this request, if exists
			 * @return {Object} mock found, or undefined
			 */
			function getMock() {
				var mock;
				for (var i in mocks) {
					mock = mocks[i];
					var sameUrl = false;
					if (mock.request.url instanceof RegExp) {
						sameUrl = mock.request.url.test(that.url);
					} else {
						sameUrl = (mock.request.url === that.url);
					}
					if (sameUrl && (!mock.request.method || mock.request.method.toUpperCase() === that.requestType.toUpperCase())) {
						return mock.response;
					}
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