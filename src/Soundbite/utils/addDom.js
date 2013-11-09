define([ 'utils/classList' ], function ( classList ) {
	
	'use strict';

	return function ( soundbite ) {
		
		// create outer element, put inner in it
		soundbite.outer = document.createElement( 'span' );
		classList.add( soundbite.outer, 'soundbite-outer' );
		classList.add( soundbite.outer, 'soundbite-idle' );

		// add background element
		soundbite.bg = document.createElement( 'span' );
		classList.add( soundbite.bg, 'soundbite-bg' );
		classList.add( soundbite.bg, 'soundbite-idle' );
		soundbite.outer.appendChild( soundbite.bg );

		// add progress bar
		soundbite.progress = document.createElement( 'span' );
		classList.add( soundbite.progress, 'soundbite-progress' );
		soundbite.bg.appendChild( soundbite.progress );

		// add icon
		// soundbite.icon = document.createElement( 'img' );
		// soundbite.icon.src = playIcon;
		//soundbite.bg.appendChild( soundbite.icon );

		// insert at current location
		soundbite.el.parentNode.insertBefore( soundbite.outer, soundbite.el );

		soundbite.outer.appendChild( soundbite.el );
	};

});