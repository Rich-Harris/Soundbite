define([
	'utils/now',
	'utils/requestAnimationFrame'
], function (
	now,
	requestAnimationFrame
) {
	
	'use strict';

	return function ( soundbite ) {
		var loop = function () {
			var timeNow, elapsed, approxTime;

			if ( !soundbite.playing ) {
				return;
			}

			// TODO if guessed position > duration, show paused (for benefit of IE...)

			requestAnimationFrame( loop );

			timeNow = now();
			elapsed = timeNow - soundbite._currentTimeSampleTime;

			approxTime = soundbite._currentTime + ( elapsed / 1000 );
			
			soundbite.progress.style.width = ( 100 * approxTime / soundbite.duration ) + '%';
		};

		loop();
	};

});