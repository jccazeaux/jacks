var jacks = (function() {
	var plugins = [];
	var exports = {};
	var serializers = {
		"application/json": function(data) {
			return JSON.stringify(data);
		},
		"application/x-www-form-urlencoded": function(data) {

		}
	}

	function JacksRequest(requestType, url) {
		var headers = {};
		var data = null;
		var query = null;
		var type = "application/json";

		/**
		 * Ajout d'un header. Si le nom du header est null on renvoie les headers.
		 */
		this.header = function(name, value) {
			if (name == null) {
				return headers;
			}
			headers[name] = value;
			return this;
		};

		/**
		 * Définitition du type de donnée
		 * Si le parametre est null on renvoie le type
		 */
		this.type = function(value) {
			if (value == null) {
				return type;
			}
			type = value;
			return this;
		};

		/**
		 * Ajoute un data
		 * Si le nom est null on renvoie les data
		 */
		this.data = function(name, value) {
			if (name == null) {
				return data;
			}
			data = data || {};
			if (typeof name === "string") {
				// On envoie un seul parametre
				data[name] = value;
			} else if (typeof name === "object") {
				// On en envoie plusieures sous forme d'objet
				for (var attr in name) {
					data[name[attr]] = name[value];
				}
			}
			return this;
		};

		/**
		 * Ajoute un paramètre en queryString
		 * Si le nom est null on renvoie les données de queryString courantes
		 */
		this.query = function(name, value) {
			if (name == null) {
				return query;
			}
			query = query || {};
			if (typeof name === "string") {
				// On envoie un seul parametre
				query[name] = value;
			} else if (typeof name === "object") {
				// On en envoie plusieures sous forme d'objet
				for (var attr in name) {
					query[name[attr]] = name[value];
				}
			}
			return this;
		};

		/**
		 * Exécute un plugin
		 */
		this.plugin = function(pluginFn) {
			pluginFn.apply(this);
			return this;
		}

		/**
		 * envoie de la requete
		 */
		this.send = function(callback, error) {
			for (var i = 0 ; i < plugins.length ; i++) {
				plugin[i].apply(this);
			}
			var xhr = new XMLHttpRequest();
			xhr.onload = callback;
			xhr.onerror = error;
			if (requestType === "GET")
			xhr.open(requestType, url);
			for (var header in headers) {
				xhr.setRequestHeader(header, headers[header]);
			}
			xhr.send(serialize(data));
		}
	}

	exports.get = function(url) {
		var jacksRequest = new JacksRequest("GET", url);
		return jacksRequest;
	}
	exports.post = function(url) {
		var jacksRequest = new JacksRequest("POST", url);
		return jacksRequest;
	}
	exports.put = function(url) {
		var jacksRequest = new JacksRequest("PUT", url);
		return jacksRequest;
	}
	exports["delete"] = function(url) {
		var jacksRequest = new JacksRequest("DELETE", url);
		return jacksRequest;
	}
	exports.plugin = function(pluginObject) {
		plugins.push(pluginObject);
		return this;
	}
	return exports;
})();