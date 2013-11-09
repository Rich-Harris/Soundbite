define( function () {
	
	'use strict';

	return function ( el ) {
		var str, options;

		if ( str = el.getAttribute( 'data-soundbite' ) ) {
			options = JSON.parse( str );
		} else {
			options = {};
		}

		if ( str = el.getAttribute( 'data-audio' ) ) {
			if ( str.indexOf( ',' ) !== -1 ) {
				options.sources = str.split( ',' );
			}

			if ( !/\.(?:mp3|ogg)$/.test( str ) ) {
				options.sources = [
					str + '.mp3',
					str + '.ogg'
				];
			}

			options.sources = [ str ];
		}

		if ( !options.sources ) {
			throw new Error( 'You must specify at least one audio source' );
		}

		return options;
	};

});