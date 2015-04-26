(function () { "use strict";
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
};
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.setField = function(o,field,value) {
	o[field] = value;
};
var Std = function() { };
Std.__name__ = true;
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	addSub: function(s,pos,len) {
		if(len == null) this.b += HxOverrides.substr(s,pos,null); else this.b += HxOverrides.substr(s,pos,len);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var common = {};
common.CSV = function() { };
common.CSV.__name__ = true;
var haxe = {};
haxe.format = {};
haxe.format.JsonParser = function(str) {
	this.str = str;
	this.pos = 0;
};
haxe.format.JsonParser.__name__ = true;
haxe.format.JsonParser.prototype = {
	parseRec: function() {
		while(true) {
			var c = StringTools.fastCodeAt(this.str,this.pos++);
			switch(c) {
			case 32:case 13:case 10:case 9:
				break;
			case 123:
				var obj = { };
				var field = null;
				var comma = null;
				while(true) {
					var c1 = StringTools.fastCodeAt(this.str,this.pos++);
					switch(c1) {
					case 32:case 13:case 10:case 9:
						break;
					case 125:
						if(field != null || comma == false) this.invalidChar();
						return obj;
					case 58:
						if(field == null) this.invalidChar();
						Reflect.setField(obj,field,this.parseRec());
						field = null;
						comma = true;
						break;
					case 44:
						if(comma) comma = false; else this.invalidChar();
						break;
					case 34:
						if(comma) this.invalidChar();
						field = this.parseString();
						break;
					default:
						this.invalidChar();
					}
				}
				break;
			case 91:
				var arr = [];
				var comma1 = null;
				while(true) {
					var c2 = StringTools.fastCodeAt(this.str,this.pos++);
					switch(c2) {
					case 32:case 13:case 10:case 9:
						break;
					case 93:
						if(comma1 == false) this.invalidChar();
						return arr;
					case 44:
						if(comma1) comma1 = false; else this.invalidChar();
						break;
					default:
						if(comma1) this.invalidChar();
						this.pos--;
						arr.push(this.parseRec());
						comma1 = true;
					}
				}
				break;
			case 116:
				var save = this.pos;
				if(StringTools.fastCodeAt(this.str,this.pos++) != 114 || StringTools.fastCodeAt(this.str,this.pos++) != 117 || StringTools.fastCodeAt(this.str,this.pos++) != 101) {
					this.pos = save;
					this.invalidChar();
				}
				return true;
			case 102:
				var save1 = this.pos;
				if(StringTools.fastCodeAt(this.str,this.pos++) != 97 || StringTools.fastCodeAt(this.str,this.pos++) != 108 || StringTools.fastCodeAt(this.str,this.pos++) != 115 || StringTools.fastCodeAt(this.str,this.pos++) != 101) {
					this.pos = save1;
					this.invalidChar();
				}
				return false;
			case 110:
				var save2 = this.pos;
				if(StringTools.fastCodeAt(this.str,this.pos++) != 117 || StringTools.fastCodeAt(this.str,this.pos++) != 108 || StringTools.fastCodeAt(this.str,this.pos++) != 108) {
					this.pos = save2;
					this.invalidChar();
				}
				return null;
			case 34:
				return this.parseString();
			case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:case 45:
				return this.parseNumber(c);
			default:
				this.invalidChar();
			}
		}
	}
	,parseString: function() {
		var start = this.pos;
		var buf = new StringBuf();
		while(true) {
			var c = StringTools.fastCodeAt(this.str,this.pos++);
			if(c == 34) break;
			if(c == 92) {
				buf.addSub(this.str,start,this.pos - start - 1);
				c = StringTools.fastCodeAt(this.str,this.pos++);
				switch(c) {
				case 114:
					buf.b += "\r";
					break;
				case 110:
					buf.b += "\n";
					break;
				case 116:
					buf.b += "\t";
					break;
				case 98:
					buf.b += "\x08";
					break;
				case 102:
					buf.b += "\x0C";
					break;
				case 47:case 92:case 34:
					buf.b += String.fromCharCode(c);
					break;
				case 117:
					var uc = Std.parseInt("0x" + HxOverrides.substr(this.str,this.pos,4));
					this.pos += 4;
					buf.b += String.fromCharCode(uc);
					break;
				default:
					throw "Invalid escape sequence \\" + String.fromCharCode(c) + " at position " + (this.pos - 1);
				}
				start = this.pos;
			} else if(c != c) throw "Unclosed string";
		}
		buf.addSub(this.str,start,this.pos - start - 1);
		return buf.b;
	}
	,parseNumber: function(c) {
		var start = this.pos - 1;
		var minus = c == 45;
		var digit = !minus;
		var zero = c == 48;
		var point = false;
		var e = false;
		var pm = false;
		var end = false;
		while(true) {
			c = StringTools.fastCodeAt(this.str,this.pos++);
			switch(c) {
			case 48:
				if(zero && !point) this.invalidNumber(start);
				if(minus) {
					minus = false;
					zero = true;
				}
				digit = true;
				break;
			case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
				if(zero && !point) this.invalidNumber(start);
				if(minus) minus = false;
				digit = true;
				zero = false;
				break;
			case 46:
				if(minus || point) this.invalidNumber(start);
				digit = false;
				point = true;
				break;
			case 101:case 69:
				if(minus || zero || e) this.invalidNumber(start);
				digit = false;
				e = true;
				break;
			case 43:case 45:
				if(!e || pm) this.invalidNumber(start);
				digit = false;
				pm = true;
				break;
			default:
				if(!digit) this.invalidNumber(start);
				this.pos--;
				end = true;
			}
			if(end) break;
		}
		var f = Std.parseFloat(HxOverrides.substr(this.str,start,this.pos - start));
		var i = f | 0;
		if(i == f) return i; else return f;
	}
	,invalidChar: function() {
		this.pos--;
		throw "Invalid char " + this.str.charCodeAt(this.pos) + " at position " + this.pos;
	}
	,invalidNumber: function(start) {
		throw "Invalid number at position " + start + ": " + HxOverrides.substr(this.str,start,this.pos - start);
	}
	,__class__: haxe.format.JsonParser
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
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
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js.Lib = function() { };
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var jsx = {};
jsx.Converter = function() {
	if(jsx.PaletteInfo.instance == null) this.palletInfo = jsx.PaletteInfo.instance = new jsx.PaletteInfo(); else this.palletInfo = jsx.PaletteInfo.instance;
	this.application = app;
	this.activeDocument = this.application.activeDocument;
	this.layers = this.activeDocument.layers;
	this.layersDisplay = new jsx.util.LayersDisplay(this.layers);
	this.layersDisplay.hide();
	this.execute();
	this.layersDisplay.restore();
};
jsx.Converter.__name__ = true;
jsx.Converter.prototype = {
	selectPixel: function(x,y) {
		this.activeDocument.selection.select([[x,y],[x + 1,y],[x + 1,y + 1],[x,y + 1]]);
	}
	,execute: function() {
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var layer = this.layers[i];
			if(layer.allLocked) continue;
			this.application.activeDocument.activeLayer = layer;
			layer.visible = true;
			var conversionDataSet = this.getConversionDataSet(layer);
			this.paint(layer,conversionDataSet);
			layer.visible = false;
		}
	}
	,getConversionDataSet: function(layer) {
		var conversionDataSet = [];
		var bounds = jsx.util.Bounds.convert(layer.bounds);
		var _g1 = bounds.top | 0;
		var _g = bounds.bottom | 0;
		while(_g1 < _g) {
			var y = _g1++;
			var _g3 = bounds.left | 0;
			var _g2 = bounds.right | 0;
			while(_g3 < _g2) {
				var x = _g3++;
				var colorSample = this.activeDocument.colorSamplers.add([x,y]);
				var rgb = colorSample.color.rgb.hexValue;
				var palletColorPosition = this.palletInfo.before.indexOf(colorSample.color.rgb.hexValue);
				switch(palletColorPosition[1]) {
				case 0:
					continue;
					break;
				case 1:
					var index = palletColorPosition[2];
					var conversionData = new jsx.ConversionData(new Point(x,y),this.palletInfo.after.rgbHexValueSet[index]);
					conversionDataSet.push(conversionData);
					break;
				}
			}
		}
		return conversionDataSet;
	}
	,paint: function(layer,conversionDataSet) {
		var duplicatedLayer = layer.duplicate();
		var _g = 0;
		while(_g < conversionDataSet.length) {
			var conversionData = conversionDataSet[_g];
			++_g;
			this.application.activeDocument.activeLayer = layer;
			var pixel = conversionData.pixel;
			this.selectPixel(pixel.x | 0,pixel.y | 0);
			this.activeDocument.selection.similar(0,false);
			this.application.activeDocument.activeLayer = duplicatedLayer;
			var color = new SolidColor();
			color.rgb.hexValue = conversionData.rgbHexValue;
			this.activeDocument.selection.fill(color);
			this.activeDocument.selection.deselect();
		}
		var duplicatedArtLayer = this.activeDocument.artLayers.getByName(duplicatedLayer.name);
		duplicatedArtLayer.merge();
	}
	,__class__: jsx.Converter
};
jsx.ConversionData = function(pixel,rgbHexValue) {
	this.pixel = pixel;
	this.rgbHexValue = rgbHexValue;
};
jsx.ConversionData.__name__ = true;
jsx.ConversionData.prototype = {
	__class__: jsx.ConversionData
};
jsx.PaletteChange = function(code) {
	this.application = app;
	if(jsx.PaletteInfo.instance == null) this.palletInfo = jsx.PaletteInfo.instance = new jsx.PaletteInfo(); else this.palletInfo = jsx.PaletteInfo.instance;
	this.palletInfo.convert(code);
	if(!this.palletInfo.parsedResult) {
		js.Lib.alert("code error");
		return;
	}
	new jsx.Converter();
	js.Lib.alert("completed");
};
jsx.PaletteChange.__name__ = true;
jsx.PaletteChange.main = function() {
};
jsx.PaletteChange.prototype = {
	__class__: jsx.PaletteChange
};
jsx.PaletteInfo = function() {
};
jsx.PaletteInfo.__name__ = true;
jsx.PaletteInfo.get_instance = function() {
	if(jsx.PaletteInfo.instance == null) return jsx.PaletteInfo.instance = new jsx.PaletteInfo(); else return jsx.PaletteInfo.instance;
};
jsx.PaletteInfo.prototype = {
	convert: function(code) {
		try {
			var json = new haxe.format.JsonParser(code).parseRec();
			this.before = new jsx.Palette(json[0]);
			this.after = new jsx.Palette(json[1]);
			this.parsedResult = true;
		} catch( error ) {
			if( js.Boot.__instanceof(error,String) ) {
				this.parsedResult = false;
			} else throw(error);
		}
	}
	,__class__: jsx.PaletteInfo
};
jsx.Palette = function(rgbHexValueCsv) {
	this.rgbHexValueSet = rgbHexValueCsv.split(",");
};
jsx.Palette.__name__ = true;
jsx.Palette.prototype = {
	indexOf: function(checkedRgbHexValue) {
		var _g1 = 0;
		var _g = this.rgbHexValueSet.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.rgbHexValueSet[i] == checkedRgbHexValue) return jsx.PaletteColorPosition.EXSITS(i);
		}
		return jsx.PaletteColorPosition.NONE;
	}
	,__class__: jsx.Palette
};
jsx.PaletteColorPosition = { __ename__ : true, __constructs__ : ["NONE","EXSITS"] };
jsx.PaletteColorPosition.NONE = ["NONE",0];
jsx.PaletteColorPosition.NONE.__enum__ = jsx.PaletteColorPosition;
jsx.PaletteColorPosition.EXSITS = function(index) { var $x = ["EXSITS",1,index]; $x.__enum__ = jsx.PaletteColorPosition; return $x; };
jsx.util = {};
jsx.util.Bounds = function(left,top,right,bottom) {
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
};
jsx.util.Bounds.__name__ = true;
jsx.util.Bounds.convert = function(bounds) {
	return new jsx.util.Bounds(bounds[0].value,bounds[1].value,bounds[2].value,bounds[3].value);
};
jsx.util.Bounds.prototype = {
	toString: function() {
		return [this.left,this.top,this.right,this.bottom].join(":");
	}
	,__class__: jsx.util.Bounds
};
jsx.util.LayersDisplay = function(layers) {
	this.layers = layers;
	this.defaultLayerVisibleSet = [];
};
jsx.util.LayersDisplay.__name__ = true;
jsx.util.LayersDisplay.prototype = {
	hide: function() {
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var layer = this.layers[i];
			this.defaultLayerVisibleSet[i] = layer.visible;
			layer.visible = false;
		}
	}
	,restore: function() {
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var layer = this.layers[i];
			layer.visible = this.defaultLayerVisibleSet[i];
		}
	}
	,__class__: jsx.util.LayersDisplay
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
common.CSV.RGB_HAX_VALUE_DELIMITER = ",";
jsx.PaletteChange.ATTENTION_WIDTH = 400;
jsx.PaletteChange.ATTENTION_HEIGHT = 400;
jsx.PaletteChange.main();
})();
