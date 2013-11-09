/*
	
	Ractive - v0.1.0 - 2013-11-09
	==============================================================

	Next-generation DOM manipulation - http://ractivejs.org
	Follow @RactiveJS for updates

	--------------------------------------------------------------

	Copyright 2013 2013 Rich Harris and contributors

	Permission is hereby granted, free of charge, to any person
	obtaining a copy of this software and associated documentation
	files (the "Software"), to deal in the Software without
	restriction, including without limitation the rights to use,
	copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following
	conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.

*/

(function ( global ) {


var utils_now = function () {
        
        if (window.performance && window.performance.now) {
            return function () {
                return window.performance.now();
            };
        }
        return function () {
            return new Date().getTime();
        };
    }();
var utils_classList = function () {
        
        var div = document.createElement('div'), removeBlanks, trim, leadingWhitespace, trailingWhitespace;
        if (div.classList && div.classList.add && div.classList.remove) {
            return {
                add: function (el, className) {
                    el.classList.add(className);
                },
                remove: function (el, className) {
                    el.classList.remove(className);
                }
            };
        }
        removeBlanks = function (className) {
            return !!className;
        };
        leadingWhitespace = /^\s+/;
        trailingWhitespace = /\s+$/;
        trim = function (className) {
            return className.replace(leadingWhitespace, '').replace(trailingWhitespace, '');
        };
        return {
            add: function (el, className) {
                var classNames;
                classNames = el.className.split(' ').filter(removeBlanks).map(trim);
                if (classNames.indexOf(className) === -1) {
                    el.className += ' ' + className;
                }
            },
            remove: function (el, className) {
                var classNames, index;
                classNames = el.className.split(' ').filter(removeBlanks).map(trim);
                index = classNames.indexOf(className);
                if (index !== -1) {
                    classNames.splice(index, 1);
                }
                el.className = classNames.join(' ');
            }
        };
    }();
var utils_getOptions = function () {
        
        return function (el) {
            var str, options;
            if (str = el.getAttribute('data-soundbite')) {
                options = JSON.parse(str);
            } else {
                options = {};
            }
            if (str = el.getAttribute('data-audio')) {
                if (str.indexOf(',') !== -1) {
                    options.sources = str.split(',');
                }
                if (!/\.(?:mp3|ogg)$/.test(str)) {
                    options.sources = [
                        str + '.mp3',
                        str + '.ogg'
                    ];
                }
                options.sources = [str];
            }
            if (!options.sources) {
                throw new Error('You must specify at least one audio source');
            }
            return options;
        };
    }();
var utils_requestAnimationFrame = function () {
        
        (function (vendors, lastTime, window) {
            var x, setTimeout;
            if (window.requestAnimationFrame) {
                return;
            }
            for (x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            }
            if (!window.requestAnimationFrame) {
                setTimeout = window.setTimeout;
                window.requestAnimationFrame = function (callback) {
                    var currTime, timeToCall, id;
                    currTime = Date.now();
                    timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    id = setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
        }([
            'ms',
            'moz',
            'webkit',
            'o'
        ], 0, window));
        return window.requestAnimationFrame;
    }();
var utils_startProgressLoop = function (now, requestAnimationFrame) {
        
        return function (soundbite) {
            var loop = function () {
                var timeNow, elapsed, approxTime;
                if (!soundbite.playing) {
                    return;
                }
                requestAnimationFrame(loop);
                timeNow = now();
                elapsed = timeNow - soundbite._currentTimeSampleTime;
                approxTime = soundbite._currentTime + elapsed / 1000;
                soundbite.progress.style.width = 100 * approxTime / soundbite.duration + '%';
            };
            loop();
        };
    }(utils_now, utils_requestAnimationFrame);
var utils_showPlaying = function (now, classList) {
        
        return function (soundbite) {
            soundbite._currentTime = soundbite.audio.currentTime;
            soundbite._currentTimeSampleTime = now();
            classList.remove(soundbite.outer, 'soundbite-ready');
            classList.add(soundbite.outer, 'soundbite-playing');
        };
    }(utils_now, utils_classList);
var utils_showReady = function (now, classList) {
        
        return function (soundbite) {
            soundbite._currentTime = soundbite.audio.currentTime;
            soundbite._currentTimeSampleTime = now();
            classList.remove(soundbite.outer, 'soundbite-playing');
            classList.add(soundbite.outer, 'soundbite-ready');
        };
    }(utils_now, utils_classList);
var utils_addEventListeners = function (now, classList, startProgressLoop, showPlaying, showReady) {
        
        return function (soundbite) {
            var handlers, outer, audio;
            outer = soundbite.outer;
            audio = soundbite.audio;
            handlers = soundbite._handlers = {};
            outer.addEventListener('click', handlers.click = function () {
                if (!soundbite.playing) {
                    soundbite.play();
                } else {
                    soundbite.playing = false;
                    soundbite.pause();
                }
            }, false);
            handlers.touchend = function () {
                if (!soundbite.playing) {
                    soundbite.play();
                } else {
                    soundbite.playing = false;
                    soundbite.pause();
                }
                outer.removeEventListener('touchend', handlers.touchend, false);
            };
            outer.addEventListener('touchstart', handlers.touchstart = function (event) {
                event.preventDefault();
                this.addEventListener('touchend', handlers.touchend, false);
                setTimeout(function () {
                    outer.removeEventListener('touchend', handlers.touchend, false);
                }, 400);
            }, false);
            audio.addEventListener('durationchange', handlers.ready = function () {
                soundbite.duration = this.duration;
                if (!soundbite.ready) {
                    classList.add(outer, 'soundbite-ready');
                    classList.add(outer, 'soundbite-play');
                    soundbite.ready = true;
                }
            }, false);
            audio.addEventListener('progress', handlers.ready, false);
            audio.addEventListener('play', handlers.play = function () {
                soundbite.playing = true;
                showPlaying(soundbite);
                startProgressLoop(soundbite);
            }, false);
            audio.addEventListener('pause', handlers.pause = function () {
                soundbite.playing = false;
                showReady(soundbite);
            }, false);
            audio.addEventListener('ended', handlers.ended = function () {
                this.pause();
                soundbite.playing = false;
                showReady(soundbite);
                soundbite.progress.style.width = '100%';
            }, false);
        };
    }(utils_now, utils_classList, utils_startProgressLoop, utils_showPlaying, utils_showReady);
var utils_removeEventListeners = function () {
        
        var outerEventListeners, audioEventListeners;
        outerEventListeners = [
            'click',
            'touchstart',
            'touchend'
        ];
        audioEventListeners = [
            'play',
            'pause',
            'ended'
        ];
        return function (soundbite) {
            var handlers, outer, audio;
            outer = soundbite.outer;
            audio = soundbite.audio;
            handlers = soundbite._handlers;
            outerEventListeners.forEach(function (eventName) {
                outer.removeEventListener(eventName, handlers[eventName], false);
            });
            audioEventListeners.forEach(function (eventName) {
                audio.removeEventListener(eventName, handlers[eventName], false);
            });
            audio.removeEventListener('durationchange', handlers.ready, false);
            audio.removeEventListener('progress', handlers.ready, false);
        };
    }();
var utils_addDom = function (classList) {
        
        return function (soundbite) {
            soundbite.outer = document.createElement('span');
            classList.add(soundbite.outer, 'soundbite-outer');
            classList.add(soundbite.outer, 'soundbite-idle');
            soundbite.bg = document.createElement('span');
            classList.add(soundbite.bg, 'soundbite-bg');
            classList.add(soundbite.bg, 'soundbite-idle');
            soundbite.outer.appendChild(soundbite.bg);
            soundbite.progress = document.createElement('span');
            classList.add(soundbite.progress, 'soundbite-progress');
            soundbite.bg.appendChild(soundbite.progress);
            soundbite.el.parentNode.insertBefore(soundbite.outer, soundbite.el);
            soundbite.outer.appendChild(soundbite.el);
        };
    }(utils_classList);
var utils_removeDom = function () {
        
        return function (soundbite) {
            soundbite.outer.parentNode.insertBefore(soundbite.el, soundbite.outer);
            soundbite.outer.parentNode.removeChild(soundbite.outer);
            soundbite.audio = null;
            soundbite.el = null;
            soundbite.outer = null;
            soundbite.bg = null;
            soundbite.progress = null;
            soundbite.icon = null;
        };
    }();
var Soundbite__Soundbite = function (now, classList, getOptions, addEventListeners, removeEventListeners, addDom, removeDom) {
        
        var Soundbite, instances = [], noop;
        if (!document.createElement('audio').play) {
            noop = function () {
            };
            Soundbite = function () {
            };
            Soundbite.prototype = {
                play: noop,
                pause: noop,
                teardown: noop
            };
            Soundbite.init = Soundbite.teardown = noop;
            return Soundbite;
        }
        Soundbite = function (el, options) {
            var self = this;
            if (el.soundbite) {
                return el.soundbite;
            }
            if (!(this instanceof Soundbite)) {
                return new Soundbite(el, options);
            }
            this.options = options || getOptions(el);
            this.el = el;
            this.audio = new Audio();
            this.audio.volume = this.options.volume || 1;
            addDom(this);
            addEventListeners(this);
            this.options.sources.forEach(function (url) {
                var source = document.createElement('source');
                source.src = url;
                self.audio.appendChild(source);
            });
            el.soundbite = this;
            instances.push(this);
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
                removeEventListeners(this);
                removeDom(this);
            }
        };
        Soundbite.init = function (elements) {
            var i;
            if (elements === undefined) {
                elements = document.getElementsByClassName('soundbite');
            } else if (typeof elements === 'string') {
                elements = document.querySelectorAll(elements);
            }
            i = elements.length;
            while (i--) {
                new Soundbite(elements[i]);
            }
        };
        Soundbite.teardown = function () {
            while (instances.length) {
                instances.pop().teardown();
            }
        };
        return Soundbite;
    }(utils_now, utils_classList, utils_getOptions, utils_addEventListeners, utils_removeEventListeners, utils_addDom, utils_removeDom);
var Soundbite = function (Soundbite) {
        
        return Soundbite;
    }(Soundbite__Soundbite);

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