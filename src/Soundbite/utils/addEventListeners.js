define([
	'utils/now',
	'utils/classList',
	'Soundbite/utils/startProgressLoop',
	'Soundbite/utils/showPlaying',
	'Soundbite/utils/showReady'
], function (
	now,
	classList,
	startProgressLoop,
	showPlaying,
	showReady
) {
	
	'use strict';

	return function ( soundbite ) {

		var handlers, outer, audio;

		outer = soundbite.outer;
		audio = soundbite.audio;

		handlers = soundbite._handlers = {};
		
		// respond to click and tap
		outer.addEventListener( 'click', handlers.click = function () {
			if ( !soundbite.ready ) {
				return;
			}

			if ( !soundbite.playing ) {
				soundbite.play();
			} else {
				soundbite.playing = false; // do this immediately, so that progress bar stops in IE9
				// TODO show paused icon immediately
				soundbite.pause();
			}
		}, false );

		handlers.touchend = function () {
			if ( !soundbite.playing ) {
				soundbite.play();
			} else {
				soundbite.playing = false;
				// TODO show paused icon immediately
				soundbite.pause();
			}

			outer.removeEventListener( 'touchend', handlers.touchend, false );
		};

		outer.addEventListener( 'touchstart', handlers.touchstart = function ( event ) {
			event.preventDefault();

			if ( !soundbite.ready ) {
				return;
			}

			this.addEventListener( 'touchend', handlers.touchend, false );

			setTimeout( function () {
				outer.removeEventListener( 'touchend', handlers.touchend, false );
			}, 400 );
		}, false );


		// detect ready event
		audio.addEventListener( 'durationchange', handlers.ready = function () {
			soundbite.duration = this.duration;

			if ( !soundbite.ready ) {
				classList.add( outer, 'soundbite-ready' );
				classList.add( outer, 'soundbite-play' );
				//soundbite.icon.src = 'src/play.png';

				soundbite.ready = true;
			}
		}, false );

		// required for mobile safari
		audio.addEventListener( 'progress', handlers.ready, false );



		audio.addEventListener( 'play', handlers.play = function () {
			soundbite.playing = true;

			showPlaying( soundbite );
			startProgressLoop( soundbite );
		}, false );

		audio.addEventListener( 'pause', handlers.pause = function () {
			soundbite.playing = false;
			showReady( soundbite );
		}, false );

		audio.addEventListener( 'ended', handlers.ended = function () {
			this.pause();
			soundbite.playing = false;

			// mark as complete
			showReady( soundbite );
			soundbite.progress.style.width = '100%';
		}, false );
	};

});