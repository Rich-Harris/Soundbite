module.exports = function ( grunt ) {

	'use strict';

	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

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
					out: 'tmp/Soundbite.js',
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
		}

	});

	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );


	grunt.registerTask( 'default', [

	]);

	
};