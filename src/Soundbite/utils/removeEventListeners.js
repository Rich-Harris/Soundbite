define( function () {
	
	'use strict';

	var outerEventListeners, audioEventListeners;

	outerEventListeners = [ 'click', 'touchstart', 'touchend' ];
	audioEventListeners = [ 'play', 'pause', 'ended' ];

	return function ( soundbite ) {
		var handlers, outer, audio;

		outer = soundbite.outer;
		audio = soundbite.audio;

		handlers = soundbite._handlers;

		outerEventListeners.forEach( function ( eventName ) {
			outer.removeEventListener( eventName, handlers[ eventName ], false );
		});

		audioEventListeners.forEach( function ( eventName ) {
			audio.removeEventListener( eventName, handlers[ eventName ], false );
		});

		audio.removeEventListener( 'durationchange', handlers.ready, false );
		audio.removeEventListener( 'progress', handlers.ready, false );
	};

});