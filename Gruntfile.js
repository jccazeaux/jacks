module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),

    connect: {
      server: {
        options: {
          keepalive: true,
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

            return middlewares;
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  
  grunt.registerTask('default', ['connect']);
  
};