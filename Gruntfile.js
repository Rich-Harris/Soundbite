module.exports = function ( grunt ) {

	'use strict';

	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		clean: {
			tmp: [ 'tmp' ],
			build: [ 'Soundbite.js', 'Soundbite.max.js' ]
		},

		jshint: {
			files: [ 'src/**/*.js' ],
			options: {
				undef: true,
				unused: true,
				boss: true,
				globals: {
					define: true,
					document: true,
					setTimeout: true,
					window: true,
					Audio: true
				}
			}
		},

		requirejs: {
			main: {
				options: {
					baseUrl: 'src/',
					name: 'Soundbite',
					out: 'tmp/Soundbite.max.js',
					optimize: 'none',
					findNestedDependencies: true,
					onBuildWrite: function( name, path, contents ) {
						return require( 'amdclean' ).clean( contents );
					},

					wrap: {
						startFile: 'wrapper/intro.js',
						endFile: 'wrapper/outro.js'
					}
				}
			}
		},

		uglify: {
			main: {
				src: 'Soundbite.max.js',
				dest: 'Soundbite.js'
			}
		},

		concat: {
			options: {
				banner: grunt.file.read( 'wrapper/banner.js' ),
				process: {
					data: { version: '<%= pkg.version %>' }
				}
			},
			tmpToRoot: {
				src: 'tmp/Soundbite.max.js',
				dest: 'Soundbite.max.js'
			}
		}

	});

	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );


	grunt.registerTask( 'default', [
		'jshint',
		'clean:tmp',
		'requirejs',
		// TODO add tests!
		'clean:build',
		'concat:tmpToRoot',
		'uglify'
	]);

	
};