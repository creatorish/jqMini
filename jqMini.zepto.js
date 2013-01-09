/*****************************************************************
 *
 * jqMini.zepto.js
 * スマートフォン向け画面遷移フレームワークjqMiniをzepto.jsで使うための差分関数群
 *
 * Required: zepto.js(http://zeptojs.com)
 * License: MIT
 * Update: 2012/01/09
 * Version: 0.1
 *
*******************************************************************/
(function($){
	if (!$) {
		return;
	}
	$.zepto.Z.prototype.isWindow = function(obj) {
		return (obj !== null && obj === obj.window);
	};
	$.zepto.Z.prototype.isDocument = function(obj) {
		return (obj !== null && obj.body !== null);
	};
	$.zepto.Z.prototype.scrollTop = function(val) {
		if (this.length === 0) {
			return null;
		}
		var obj = this[0];
		if (this.isWindow(obj) || this.isDocument(obj)) {
			if( typeof( window.pageYOffset ) == 'number' ) {
				if (val) {
					window.pageYOffset = val;
				} else {
					return window.pageYOffset;
				}
			} else {
				if (val) {
					document.body.scrollTop = val;
				} else {
					return document.body.scrollTop;
				}
			}
		} else if (val) {
			obj.scrollTop = val;
		}
		return this;
	};
	$.zepto.Z.prototype.scrollLeft = function(val) {
		if (this.length === 0) {
			return null;
		}
		var obj = this[0];
		if (Zepto.isWindow(obj) || Zepto.isDocument(obj)) {
			if(typeof(window.pageXOffset) == 'number' ) {
				if (val) {
					window.pageXOffset = val;
				} else {
					return window.pageXOffset;
				}
			} else {
				if (val) {
					document.body.scrollLeft = val;
				} else {
					return document.body.scrollLeft;
				}
			}
		} else if (val) {
			obj.scrollTop = val;
		}
		return this;
	};
	$.zepto.Z.prototype.fadeTo = function(duration,opacity,callback) {
		this.animate({
			opacity: opacity
		}, {
			duration: duration,
			easing: "ease-out",
			complete: callback
		});
	};
	$.zepto.Z.prototype.fadeOut = function(duration,callback) {
		this.fadeTo(duration,0,function() {
			$(this).hide();
			if (typeof callback === "function") {
				callback.apply(this);
			}
		});
	};
	$.zepto.Z.prototype.fadeIn = function(duration,callback) {
		$(this).show();
		this.fadeTo(duration,1,function() {
			if (typeof callback === "function") {
				callback.apply(this);
			}
		});
	};
})(Zepto);