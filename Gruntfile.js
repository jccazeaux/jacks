module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      build: {
        files: {'dist/jacks.js': ['src/Jacks.js']},
        options: {
          debug: false,
          //transform: ['uglifyify']
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
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  
  grunt.registerTask('default', ['browserify']);
  
};