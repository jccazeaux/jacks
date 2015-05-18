module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>\n' + 
          ' * https://github.com/jccazeaux/Jacks\n' +
          ' * Copyright (c) 2015 Jean-Christophe Cazeaux.\n' +
          ' * Licensed under the MIT license.\n' +
          ' */'
      },
      build: {
        files: {
          'dist/jacks.min.js': ['src/Jacks.js']
        }
      }
    },

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
    },

    jasmine: {
      tests: {
        src: ['dist/jacks.js', 'plugins/*.js'],
        options: {
          specs: 'tests/*Spec.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('default', ['browserify']);
  
};