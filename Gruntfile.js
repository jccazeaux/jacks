module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    connect: {
      server: {
        options: {
          keepalive: false,
          hostname: "127.0.0.1",
          port: 9000,
          base: './',
          middleware: function (connect, options, middlewares) {
            var fs = require('fs');
            var path = require('path');
            var support = ['POST', 'PUT', 'DELETE'];
            middlewares.unshift(function (req, res, next) {
              if (support.indexOf(req.method.toUpperCase()) != -1) {
                var filepath = path.join(options.base[0], req.url);
                if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                  return res.end(fs.readFileSync(filepath));
                }
              }
              return next();
            });
            middlewares.unshift(function (req, res, next) {
              // Get returns request info in response
              if (/dump[.]*/.test(req.url)) {
                var result = {
                  headers: req.headers,
                  url: req.url
                };
                res.setHeader("Content-Type", "application/json")
                return res.end(JSON.stringify(result));
              } else {
                return next();
              }
            });

            return middlewares;
          }
        }
      }
    },
    mocha_phantomjs: {
      all: {
        options: {
          urls: ['http://127.0.0.1:9000/specs/runner.html']
        }
      }
    }
});


  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.registerTask('default', ['connect']);
  
};