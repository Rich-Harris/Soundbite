define([
	'utils/now',
	'utils/classList'
], function (
	now,
	classList
) {
	
	'use strict';

	return function ( soundbite ) {
		soundbite._currentTime = soundbite.audio.currentTime;
		soundbite._currentTimeSampleTime = now();

		classList.remove( soundbite.outer, 'soundbite-playing' );
		classList.add( soundbite.outer, 'soundbite-ready' );
	};

	

});