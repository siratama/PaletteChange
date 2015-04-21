(function () { "use strict";
var LayersParser = function() {
	this.application = app;
	this.layers = this.application.activeDocument.layers;
	this.defaultVisibleSet = [];
	this.hideAll();
	this.execute();
	this.restoreVisible();
};
LayersParser.__name__ = true;
LayersParser.prototype = {
	hideAll: function() {
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var layer = this.layers[i];
			this.defaultVisibleSet[i] = layer.visible;
			layer.visible = false;
		}
	}
	,execute: function() {
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var layer = this.layers[i];
			var bounds = jsx.Bounds.convert(layer.bounds);
			js.Lib.alert(bounds);
		}
	}
	,restoreVisible: function() {
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var layer = this.layers[i];
			layer.visible = this.defaultVisibleSet[i];
		}
	}
};
var PalletChanger = function() {
	this.application = app;
	var code = prompt("" + "http://www.github.aaa/" + "\nenter code","");
	if(code == null) return;
	new LayersParser();
};
PalletChanger.__name__ = true;
PalletChanger.main = function() {
	new PalletChanger();
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Lib = function() { };
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var jsx = {};
jsx.Bounds = function(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};
jsx.Bounds.__name__ = true;
jsx.Bounds.convert = function(bounds) {
	return new jsx.Bounds(bounds[0].value,bounds[1].value,bounds[2].value,bounds[3].value);
};
jsx.Bounds.prototype = {
	toString: function() {
		return [this.x,this.y,this.width,this.height].join(":");
	}
};
String.__name__ = true;
Array.__name__ = true;
PalletChanger.PALLET_URL = "http://www.github.aaa/";
PalletChanger.main();
})();
