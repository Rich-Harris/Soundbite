define( function () {
	
	'use strict';

	if ( window.performance && window.performance.now ) {
		return function () {
			return window.performance.now();
		};
	}

	return function () {
		return new Date().getTime();
	};

});