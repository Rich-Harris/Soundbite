

// Export as AMD module...
if ( typeof define === 'function' && define.amd ) {
	define( function () { return Soundbite; });
}

// ...or as Browserify module
else if ( typeof module !== 'undefined' && module.exports ) {
	module.exports = Soundbite;
}

else {
	global.Soundbite = Soundbite;
}


}( typeof window !== 'undefined' ? window : this ));