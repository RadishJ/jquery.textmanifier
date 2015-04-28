﻿/*!
 * jQuery TextMagnifier
 *
 * Parameters :
 *
 * 	foreground    : '#000000'
 * 	background    : '#FFFFCC'
 * 	height        : 40
 * 	width         : 'auto'
 * 	fontsize      : 30
 * 	align         : 'top'
 * 	alignlen      : 5
 *  maxlength     : 5
 *  font          : 'Consolas'
 *  autocomplete  : 'off'
 *  excision      : ['off',4,'-']
 * Example: 
 *	$('#inpXX1').textMagnifier({align : 'bottom',height : 60});
 *  $('.inpXX1').textMagnifier();
 *
 * Version        : V2.00
 * Maintained by  : Hj
 * Create Date    : 2014-12-4
 * Last Fix Date  : 2015-04-28
 */
(function($) {
    var privateFunction = {
        _createHtml:function($this) {
            var ori_left = $this.offset().left, ori_top = $this.offset().top, ori_width = $this.outerWidth(), ori_height = $this.outerHeight(), settings = $this.data("config");
            var $div = $("<div class='text-magnifier-plug'></div>");
            $div.css("clear", "both");
            $div.css("position", "absolute");
            $div.css("font-family", settings.font);
            $div.css("min-width", ori_width + "px");
            if ("hide" == settings.width) {
                $div.css("width", ori_width + "px");
                $div.css("overflow", "hidden");
                $div.css("text-overflow", "ellipsis");
            } else {
                $div.css("width", "auto");
            }
            $div.css("word-break", "keep-all");
            $div.css("white-space", "nowrap");
            $div.css("height", settings.height + "px");
            $div.css("line-height", settings.height + "px");
            $div.css("background-color", settings.background);
            $div.css("color", settings.foreground);
            $div.css("font-size", settings.fontsize + "px");
            $div.css("border", "solid 1px #ffd2b2");
            $div.css("z-index", "999");
            $div.css("display", "none");
            switch (settings.align) {
              case "left":
                {
                    $div.css({
                        top:ori_top + "px",
                        left:ori_left - (ori_width + settings.alignlen) + "px"
                    });
                }
                ;
                break;

              case "right":
                {
                    $div.css({
                        top:ori_top + "px",
                        left:ori_left + ori_width + settings.alignlen + "px"
                    });
                }
                ;
                break;

              case "bottom":
                {
                    $div.css({
                        top:ori_top + ori_height + settings.alignlen + "px",
                        left:ori_left + "px"
                    });
                }
                ;
                break;

              default:
                {
                    $div.css({
                        top:ori_top - (settings.height + settings.alignlen) + "px",
                        left:ori_left + "px"
                    });
                }
                ;
            }
            if ("auto" != settings.maxlength) {
                $this.attr("maxlength", settings.maxlength);
            }
            $this.attr("autocomplete", settings.autocomplete);
            $this.after($div);
        },
        _resize:function($this) {
            var ori_left = $this.offset().left, ori_top = $this.offset().top, ori_width = $this.outerWidth(), ori_height = $this.outerHeight(), settings = $this.data("config");
        },
        _bindEve:function($this) {
            if (undefined == $this.next("div") || "text-magnifier-plug" != $this.next("div").attr("class")) this._createHtml();
            var $div = $this.next("div");
            $this.bind("keyup", function(e) {
                var value = $.trim(e.target.value);
                if (value == "") {
                    privateFunction._hide($this);
                } else {
                    $div.html(privateFunction._txtHandle(value, $this.data("config")));
                    privateFunction._show($this);
                }
            }).bind("focus", function(e) {
                var value = $.trim(e.target.value);
                if (value == "") {
                    privateFunction._hide($this);
                } else {
                    $div.html(privateFunction._txtHandle(value, $this.data("config")));
                    privateFunction._show($this);
                }
            }).bind("blur", function(e) {
                privateFunction._hide($this);
            });
        },
        _txtHandle:function(txt, settings) {
            if (undefined == txt || 0 == txt.length || undefined == settings) {
                return txt;
            } else {
                if (undefined == settings) {
                    return txt;
                } else {
                    if (settings.excision[0] == "on") {
                        eval(" var regular = /(.{" + settings.excision[1] + "})(?=[^" + settings.excision[2] + "])/g");
                        return txt.replace(regular, "$1" + settings.excision[2]);
                    } else {
                        return txt;
                    }
                }
            }
        },
        _hide:function($this) {
            if (!privateFunction._exist($this)) privateFunction._createHtml($this);
            var $div = $this.next("div");
            $div.fadeOut(200);
        },
        _show:function($this) {
            if (!privateFunction._exist($this)) privateFunction._createHtml($this);
            var $div = $this.next("div");
            $div.fadeIn(200);
        },
        _exist:function($this) {
            if (undefined == $this || undefined == $this.next("div") || "text-magnifier-plug" != $this.next("div").attr("class")) {
                return false;
            } else {
                return true;
            }
        },
        _log:function(txt) {
            if (window.console && window.console.log) {
                var localDate = new Date();
                window.console.log("[TextMagnifier Log][" + localDate.toLocaleTimeString() + "][" + txt + "]");
            }
        }
    };
    var publicFunction = {
        init:function(options) {
            return this.each(function() {
                var $this = $(this);
                if (!privateFunction._exist($this)) {
                    var settings = $this.data("config");
                    if (undefined == settings) {
                        var defaults = {
                            foreground:"#ff7800",
                            background:"#fdfdee",
                            height:40,
                            width:"auto",
                            fontsize:30,
                            align:"top",
                            alignlen:5,
                            maxlength:"auto",
                            font:"Consolas",
                            autocomplete:"off",
                            excision:[ "off", 4, "-" ]
                        };
                        settings = $.extend({}, defaults, options);
                        $this.data("config", settings);
                    }
                    privateFunction._createHtml($this);
                    privateFunction._bindEve($this);
                    privateFunction._log("Hello TextMagnifier ..");
                }
            });
        },
        show:function() {
            return this.each(function() {
                var $this = $(this);
                if (privateFunction._exist($this)) {
                    privateFunction._show($this);
                } else {
                    privateFunction._createHtml($this);
                    privateFunction._show($this);
                }
            });
        }
    };
    $.fn.textMagnifier = function() {
        var method = arguments[0];
        if (publicFunction[method]) {
            method = publicFunction[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (!!!method || typeof method == "object") {
            method = publicFunction.init;
        } else {
            privateFunction._log("Method [" + method + "] does not exist.");
            return this;
        }
        return method.apply(this, arguments);
    };
})(jQuery);