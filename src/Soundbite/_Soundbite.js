define([
	'utils/now',
	'utils/classList',
	'Soundbite/utils/getOptions',
	'Soundbite/utils/addEventListeners',
	'Soundbite/utils/removeEventListeners',
	'Soundbite/utils/addDom',
	'Soundbite/utils/removeDom'
], function (
	now,
	classList,
	getOptions,
	addEventListeners,
	removeEventListeners,
	addDom,
	removeDom
) {
	
	'use strict';

	var Soundbite, instances = [], noop;
	

	// first, check this browser supports HTML5 audio
	if ( !document.createElement( 'audio' ).play ) {
		noop = function () {};

		Soundbite = function () {};
		Soundbite.prototype = {
			play: noop,
			pause: noop,
			teardown: noop
		};

		Soundbite.init = Soundbite.teardown = noop;

		return Soundbite;
	}


	Soundbite = function ( el, options ) {
		var self = this;

		// Only one Soundbite instance per element
		if ( el.soundbite ) {
			return el.soundbite;
		}

		// The `new` operator is preferred but optional
		if ( !( this instanceof Soundbite ) ) {
			return new Soundbite( el, options );
		}

		// Options can be passed, or inferred from data-soundbite/data-audio attributes
		this.options = options || getOptions( el );

		this.el = el;
		this.audio = new Audio();

		this.audio.volume = this.options.volume || 1;
		
		// modify the DOM, add event listeners
		addDom( this );
		addEventListeners( this );

		// add sources
		this.options.sources.forEach( function ( url ) {
			var source = document.createElement( 'source' );

			source.src = url;
			self.audio.appendChild( source );
		});

		el.soundbite = this;
		instances.push( this );
	};

	Soundbite.prototype = {
		constructor: Soundbite,

		play: function () {
			this.audio.play();
		},

		pause: function () {
			this.audio.pause();
		},

		teardown: function () {
			removeEventListeners( this );
			removeDom( this );
		}
	};

	Soundbite.init = function ( elements ) {
		var i;

		if ( elements === undefined ) {
			elements = document.getElementsByClassName( 'soundbite' );
		}

		else if ( typeof elements === 'string' ) {
			elements = document.querySelectorAll( elements );
		}

		i = elements.length;
		while ( i-- ) {
			new Soundbite( elements[i] );
		}
	};

	Soundbite.teardown = function () {
		while ( instances.length ) {
			instances.pop().teardown();
		}
	};

	return Soundbite;

});