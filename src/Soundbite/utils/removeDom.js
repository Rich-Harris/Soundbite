define( function () {
	
	'use strict';

	return function ( soundbite ) {

		soundbite.outer.parentNode.insertBefore( soundbite.el, soundbite.outer );
		soundbite.outer.parentNode.removeChild( soundbite.outer );

		// null out references, in case this soundbite is still referenced somewhere
		soundbite.audio = null;
		soundbite.el = null;
		soundbite.outer = null;
		soundbite.bg = null;
		soundbite.progress = null;
		soundbite.icon = null;
	};

});