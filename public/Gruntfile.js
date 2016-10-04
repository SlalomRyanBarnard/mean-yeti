/**
 * Running the default task will trigger the watch task which looks for SCSS and JS changes
 * under the "homepage-redesign" folder.
 * When a change is detected, the SCSS and/or JS files will be rebuilt and placed into the "dist" folder
 * for inclusion.
 *
 */
module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        // Watches for files changing.
        watch:{
            server:{
                files:[
                    './sass/**/*.scss',
                    './js/**/*.js',
                    './html/**/*.html'
                ],
                tasks: ['sass', 'cssmin', 'ngtemplates', 'concat', 'uglify'],
                options: { event: ['all'], livereload:true }
            }
        },

        // Compiles the SASS
        sass: {
          dist: {
              files: {
                  './dist/mean-yeti.css': './sass/main.scss'
              }
          }
        },

        // Minimizes CSS
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: './dist',
                    src: ['mean-yeti.css'],
                    dest: './dist',
                    ext: '.min.css'
                }]
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['./js/app/**/*.js'],
                dest: './dist/mean-yeti.js'
            }
        },

        // Minimizes JavaScript
        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    sourceMapName: './dist/mean-yeti.js.map'
                },
                files: {
                    './dist/mean-yeti.min.js': './dist/mean-yeti.js'
                }
            }
        },

        // Adds html templates to the angular template cache.
        ngtemplates: {
            'bb-homepage': {
                src: ['js/app/**/*.html'],
                dest: 'js/templates.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-angular-templates');

    grunt.registerTask('default', ['sass', 'cssmin', 'ngtemplates', 'concat', 'uglify', 'watch']);
};

