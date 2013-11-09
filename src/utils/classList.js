define( function () {
	
	'use strict';

	var div = document.createElement( 'div' ), removeBlanks, trim, leadingWhitespace, trailingWhitespace;

	if ( div.classList && div.classList.add && div.classList.remove ) {
		return {
			add: function ( el, className ) {
				el.classList.add( className );
			},

			remove: function ( el, className ) {
				el.classList.remove( className );
			}
		};
	}

	// internet exploder
	removeBlanks = function ( className ) {
		return !!className;
	};

	leadingWhitespace = /^\s+/;
	trailingWhitespace = /\s+$/;

	trim = function ( className ) {
		return className.replace( leadingWhitespace, '' ).replace( trailingWhitespace, '' );
	};

	return {
		add: function ( el, className ) {
			var classNames;

			classNames = el.className.split( ' ' ).filter( removeBlanks ).map( trim );

			if ( classNames.indexOf( className ) === -1 ) {
				el.className += ' ' + className;
			}
		},

		remove: function ( el, className ) {
			var classNames, index;

			classNames = el.className.split( ' ' ).filter( removeBlanks ).map( trim );

			index = classNames.indexOf( className );
			if ( index !== -1 ) {
				classNames.splice( index, 1 );
			}

			el.className = classNames.join( ' ' );
		}
	};

});