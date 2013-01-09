/*****************************************************************
 *
 * jqMini.js
 * スマートフォン向け画面遷移フレームワーク
 *
 * Required: jQuery(http://jquery.com/)
 * Inspired: jQuery Mobile(http://jquerymobile.com/)
 * License: MIT
 * Update: 2012/01/09
 * Version: 1.3
 * Author: yuu.creatorish
 * URL: http://creatorish.com
 * PluginURL: http://dev.creatorish.com/jqmini/
 *
*******************************************************************/

(function() {
	var jqMiniEvent = {
		changeStart: "changestart",
		changeEnd: "changeend",
		show: "show",
		hide: "hide",
		preHide: "prehide",
		preShow: "preshow"
	};
	$.fn.jqMini = function(op) {
		var setting = {
			transition: "fade",
			fadeTime: 200,
			scrollTime: 450,
			scrollEasing: "swing",
			scrollCheck: true,
			external: "external",
			hash: true
		};
		$.extend(setting,op);

		var self = this;
		var isAnimation = false;

		var lastHash = null;
		var history = {};

		var CHANGE_OPTION = {
			transition: setting.transition,
			back: false,
			reverse: false,
			scrollTarget: null,
			scrollPos: 0,
			hash: true,
			sync: false,
			direction: "out",
			from: null,
			to: null,
			inline: false
		};
		var currentId = null;

		var animationEnd = "webkitTransitionEnd";
		var animationEnabled = true;
		var pushStateEnabled = (window.history.pushState !== undefined);

		var scrollData = $({st: 0, sl: 0});

		var css3support = (function(elm){
			var props = [
				{
					tansition: "transition",
					animationEnd: "animationend"
				},
				{
					tansition: "WebkitTransition",
					animationEnd: "webkitAnimationEnd"
				},
				{
					tansition: "MozTransition",
					animationEnd: "animationend"
				},
				{
					tansition: "msTransition",
					animationEnd: "MSAnimationEnd"
				},
				{
					tansition: "OTransition",
					animationEnd: "oanimationend"
				}
			];
			for(var i = 0; i < props.length; i++){
			    if(elm.style[props[i].tansition + "Property"] !== undefined){
					return props[i];
			    }
			}
			return null;
		})(this.get(0));

		function init() {
			var current = self.children(".current");

			if (current.length === 0) {
				current = self.children().eq(0).addClass("current");
			}
			currentId = "#"+current.attr("id");

			$.each(self.find("a"),function(index) {
				if (this.rel !== "external") {
					$(this).on("click",clickHandler);
				}
			});
			if (setting.hash) {
				if (pushStateEnabled) {
					popStateHandler();
					$(window).on("popstate", popStateHandler);
				} else {
					window.setInterval(popStateHandler,100);
				}
			}
		}
		function popStateHandler(e) {
			var hash = location.hash;
			if (!hash) {
				hash = currentId;
			}
			if (!pushStateEnabled && hash !== lastHash) {
				location.hash = hash;
			} else if (!pushStateEnabled && hash === lastHash) {
				return;
			}

			var hist = getHistory(hash);
			if (hist) {
				if (hist.to !== lastHash && hist.from !== lastHash) {
					hist.transition = setting.transition;
				}
				hist.reverse = !hist.reverse;
				hist.hash = false;

				self.goTo(hash,hist);
			} else {
				if (hash === currentId) {
					self.goTo(hash,{
						transition: "none",
						hash: false
					});
				} else {
					self.goTo(hash,{
						transition: setting.transition,
						hash: false
					});
				}
			}
		}
		function getHistory(hash) {
			return history[hash];
		}
		function addHistory(to,options) {
			history[to] = options;
		}
		function clickHandler(e) {
			var href = $(this).attr("href");
			if (href && href.charAt(0) === "#") {
				var trans = $(this).attr("data-transition") || undefined;
				var reverse = $(this).attr("data-reverse") || undefined;
				var back = $(this).attr("data-back") || undefined;
				var hash = $(this).attr("data-hash") || undefined;
				var scrollTarget = $(this).attr("data-scrollTarget") || undefined;
				var inline = Boolean($(this).attr("data-inline")) || undefined;
				changePage(href,{
					transition: trans,
					reverse: reverse,
					back: back,
					hash: hash,
					scrollTarget: scrollTarget,
					inline: inline
				});
			}
			e.preventDefault();
		}

		function getHash(val) {
			val = String(val);
			var index = val.indexOf("?");
			if (index !== -1) {
				return val.slice(0,index);
			} else {
				return val;
			}
		}

		function consoleError(message) {
			if (window.console) {
				window.console.error(message);
			} else {
				alert(message);
			}
		}

		function changePage(id,op) {
			var from = self.children(".current");
			var to = $(getHash(id));
			var options = $.extend({},CHANGE_OPTION,op);
			if (isAnimation) {
				return;
			} else if (to.length === 0) {
				consoleError('Not Found "To Page"');
				return;
			}

			if (window.history.length !== 0 && setting.hash && options.reverse && options.hash) {
				isAnimation = false;
				window.history.back();
				return;
			}

			if (options.inline) {
				smoothScroll(to.offset().left,to.offset().top);
				return;
			}

			if (self.triggerHandler(jqMiniEvent.changeStart,[from,to]) === false) {
				return;
			}
			if (to.triggerHandler(jqMiniEvent.preShow,[from]) === false) {
				return;
			}
			if (from.triggerHandler(jqMiniEvent.preHide,[to]) === false) {
				return;
			}

			isAnimation = true;

			switch(options.transition) {
				case "fade":
				case "flowleft":
				case "flowright":
				case "slidefadeleft":
				case "slidefaderight":
				case "shuffleleft":
				case "shuffleright":
				case "shuffleup":
				case "shuffledown":
					options.sync = true;
					break;
				case "flipleft":
				case "flipright":
				case "flipup":
				case "flipdown":
					self.addClass("viewport-flip");
					options.sync = true;
					break;
				case "turnleft":
				case "turnright":
					self.addClass("viewport-turn");
					options.sync = true;
					break;
				default:
					break;
			}

			options.scrollPos = $(window).scrollTop();
			options.from = "#"+from.attr("id");
			options.to = "#"+to.attr("id");

			from.prop("scroll",options.scrollPos);

			addHistory(options.from,options);
			var toOptions = $.extend({},options);
			toOptions.direction = "in";
			addHistory(options.to,toOptions);
			lastHash = id;
			if (setting.hash && options.hash === true) {

				if (pushStateEnabled) {
					window.history.pushState(null,null,id);
				} else {
					location.hash = id;
				}
			}
			executeChange(from,to,options);
		}

		function executeChange(from,to,options) {
			var rev = "";
			if (options.reverse) {
				rev = " reverse";
			}

			if(!css3support) {
				options.transition = "none";
			}

			if (options.reverse) {
				to.children(".page-inner").css("opacity", "0");
			}

			if (options.transition === "none") {
				from.removeClass("current");
				to.addClass("current rev");
				isAnimation = false;
				self.trigger(jqMiniEvent.changeEnd,[from,to]);

				from.trigger(jqMiniEvent.hide,[to]);
				to.trigger(jqMiniEvent.show,[from]);

				if (options.reverse && setting.scrollCheck && to.prop("scroll")) {
					scrollTo(to.prop("scroll"),0);
				} else {
					scrollTo(1,0);
				}
				to.children(".page-inner").fadeTo(setting.fadeTime,1,function() {
					to.removeClass("rev");
				});
				return;
			}

			from.prop("option",[options,rev,from,to]);
			to.prop("option",[options,rev,from,to]);
			from.on(css3support.animationEnd, fromAnimationEnd);
			to.on(css3support.animationEnd, toAnimationEnd);
			from.children(".page-inner").css("margin-top",-options.scrollPos+"px");
			from.addClass("out").addClass(options.transition + " " + rev);
			if (!options.sync) {
				to.addClass("in").addClass(options.transition + " " + rev);
			}
			if (!options.reverse) {
				scrollTo(1,0);
			}
		}

		function fromAnimationEnd(e) {
			var data = $(this).prop("option");
			var options = data[0];
			var rev = data[1];
			var from = data[2];
			var to = data[3];
			$(this).off(css3support.animationEnd,fromAnimationEnd);
			$(this).removeClass(options.transition + " out current" + rev);
			if (options.sync) {
				to.addClass("in").addClass(options.transition + " " + rev );
			}
			$(this).trigger(jqMiniEvent.hide,[to]);
		}
		function toAnimationEnd(e) {
			var data = $(this).prop("option");
			var options = data[0];
			var rev = data[1];
			var from = data[2];
			var to = data[3];

			from.children(".page-inner").css("margin-top","0px");
			var my = $(this);
			my.off(css3support.animationEnd, toAnimationEnd);
			my.removeClass(options.transition + " in rev" + rev).addClass("current");
			self.removeClass("viewport-flip viewport-turn");

			if (options.reverse && setting.scrollCheck && $(this).prop("scroll")) {
				scrollTo($(this).prop("scroll"),0);
			}
			if (options.reverse) {
				my.children(".page-inner").fadeTo(setting.fadeTime,1);
			}

			isAnimation = false;

			$(this).trigger(jqMiniEvent.show,[from]);
			self.trigger(jqMiniEvent.changeEnd,[from,to]);
		}

		function smoothScroll(x,y) {
			scrollData.attr({
				st: $(window).scrollTop(),
				sl: $(window).scrollLeft()
			});
			scrollData.stop().animate({
				st: y,
				sl: x
			}, {
				duration: setting.scrollTime,
				easing: setting.scrollEasing,
				step: scrollHandler,
				complete: scrollHandler
			});
		}

		function scrollHandler() {
			window.scrollTo(this.sl,this.st);
		}

		function scrollTo(val,time) {
			window.setTimeout(function() {
				window.scrollTo(0,val);
			},time);
		}

		self.goTo = function(id,op) {
			changePage(id,op);
		};
		self.next = function() {
			var next = self.find("div.current").next(".page");
			if (next.length !== 0) {
				self.goTo("#"+next.attr("id"),{
					transition: setting.transition
				});
			}
		};
		self.prev = function() {
			var prev = self.find("div.current").prev(".page");
			if (prev.length !== 0) {
				self.goTo("#"+prev.attr("id"),{
					transition: setting.transition,
					reverse: true
				});
			}
		};

		scrollTo(1,100);

		init();
		return self;
	};

	if (!window.jqMiniEvent) {
		window.jqMiniEvent = jqMiniEvent;
	}
})();