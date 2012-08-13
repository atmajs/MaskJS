if (typeof Date.now === 'undefined') {
    Date.now = function() {
        return new Date().getTime();
    }
}

if (typeof Function.prototype.bind === 'undefined') {
    Function.prototype.bind = function() {
        if (arguments.length < 2 && typeof arguments[0] == "undefined") return this;
        var __method = this,
            args = Array.prototype.slice.call(arguments),
            object = args.shift();
        return function() {
            return __method.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        }
    }
}


var Scroller = function($scroller) {
    this.scroller = $scroller;
    this.target = $('#' + $scroller.data('target'));

    this.scroller //
    .on('mousedown', function(e) {
        this.lastX = e.pageX;
        this.startUpdating();
        return false;
    }.bind(this));
    this.updateDelagate = this.update.bind(this);
}
Scroller.prototype = {
    startUpdating: function() {
        $(document) //
        .on('mouseup.scroller', function() {
            this.stopUpdating();
            $(document).off('mouseup.scroller');
        }.bind(this));

        $(document).on('mousemove', function(e) {
            if (e.pageX == 0) return;
            this.dx = e.pageX - this.lastX;
            this.lastX = e.pageX;

        }.bind(this));

        this.animationId = window.webkitRequestAnimationFrame(this.updateDelagate);
    },
    stopUpdating: function() {
        this.dx = null;
        this.lastX = null;
        window.webkitCancelAnimationFrame(this.animationId);
        console.log('stop');
        $(document).off('mousemove');
    },
    update: function() {
        if (this.dx) {

            var x = this.scrollerx + this.dx;
            if (x > -1 && x + this.scrollerWidth < this.scrollerContainerWidth) {
                //this.scroller.css('left', (this.scrollerx += this.dx));
                this.translateX(this.scroller, (this.scrollerx += this.dx));



                this.translateX(this.target, -this.scrollerx * this.xt);

            }
            this.dx = null;
        }
        this.animationId = window.webkitRequestAnimationFrame(this.updateDelagate);
    },
    refresh: function() {
        var width = this.target.outerWidth(),
            containerWidth = document.body.clientWidth;
        this.scrollerContainerWidth = containerWidth;



        this.scrollerx = 0;
        this.translateX(this.target, 0);
        this.translateX(this.scroller, 0);

        console.log('container', containerWidth, width);
        if (containerWidth > width - 1) {
            this.scroller.hide();
            return;
        }

        this.scrollerWidth = containerWidth * containerWidth / width;
        this.xt = -(containerWidth - width) / (containerWidth - this.scrollerWidth);
        this.scroller.css('width', this.scrollerWidth + 'px');
        this.scroller.show();
    },
    translateX: function(element, x) {
        var style = this.target.get(0).style;
        var prefix = null;

        if ('webkitTransform' in style) prefix = '-webkit-';
        else if ('mozTransform' in style) prefix = '-moz-';
        else if ('oTransform' in style) prefix = '-o-';
        else if ('khtmlTransform' in style) prefix = '-khtml-';
        else if ('Transform' in style) prefix = '';

        if (prefix) {
            this.translateX = function(element, x) {
                element.css(prefix + 'transform', 'translate3d(' + x + 'px,0px,0px)');
            }
        } else {
            this.translateX = function(element, x) {
                element.css(prefix + 'left', x + 'px');
            }
        }
        this.translateX(element, x);
    }
}

var FormatJSON = (function() {

    function RealTypeOf(v) {
        if (typeof(v) == "object") {
            if (v === null) return "null";
            if (v.constructor == (new Array).constructor) return "array";
            if (v.constructor == (new Date).constructor) return "date";
            if (v.constructor == (new RegExp).constructor) return "regex";
            return "object";
        }
        return typeof(v);
    }

    return function(oData, sIndent) {
        if (oData == null) return '';
        if (arguments.length < 2) {
            var sIndent = "";
        }
        var sIndentStyle = "    ";
        var sDataType = RealTypeOf(oData);

        // open object
        if (sDataType == "array") {
            if (oData.length == 0) {
                return "[]";
            }
            var sHTML = "[";
        } else {
            var iCount = 0;
            $.each(oData, function() {
                iCount++;
                return;
            });
            if (iCount == 0) { // object is empty
                return "{}";
            }
            var sHTML = "{";
        }

        // loop through items
        var iCount = 0;
        $.each(oData, function(sKey, vValue) {
            if (iCount > 0) {
                sHTML += ",";
            }
            if (sDataType == "array") {
                sHTML += ("\n" + sIndent + sIndentStyle);
            } else {
                sHTML += ("\n" + sIndent + sIndentStyle + "\"" + sKey + "\"" + ": ");
            }

            // display relevant data type
            switch (RealTypeOf(vValue)) {
            case "array":
            case "object":
                sHTML += FormatJSON(vValue, (sIndent + sIndentStyle));
                break;
            case "boolean":
            case "number":
                sHTML += vValue.toString();
                break;
            case "null":
                sHTML += "null";
                break;
            case "string":
                sHTML += ("\"" + vValue + "\"");
                break;
            default:
                sHTML += ("TYPEOF: " + typeof(vValue));
            }

            // loop
            iCount++;
        });

        // close object
        if (sDataType == "array") {
            sHTML += ("\n" + sIndent + "]");
        } else {
            sHTML += ("\n" + sIndent + "}");
        }

        // return
        return sHTML;
    }
})();