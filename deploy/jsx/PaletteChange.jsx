(function () { "use strict";
var $hxClasses = {};
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
HxOverrides.__name__ = true;
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
};
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
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
List.__name__ = true;
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,__class__: List
};
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = true;
Math.__name__ = true;
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = true;
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = true;
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var Type = function() { };
$hxClasses["Type"] = Type;
Type.__name__ = true;
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
};
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
};
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
};
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
};
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
};
var haxe = {};
haxe.Unserializer = function(buf) {
	this.buf = buf;
	this.length = buf.length;
	this.pos = 0;
	this.scache = new Array();
	this.cache = new Array();
	var r = haxe.Unserializer.DEFAULT_RESOLVER;
	if(r == null) {
		r = Type;
		haxe.Unserializer.DEFAULT_RESOLVER = r;
	}
	this.setResolver(r);
};
$hxClasses["haxe.Unserializer"] = haxe.Unserializer;
haxe.Unserializer.__name__ = true;
haxe.Unserializer.initCodes = function() {
	var codes = new Array();
	var _g1 = 0;
	var _g = haxe.Unserializer.BASE64.length;
	while(_g1 < _g) {
		var i = _g1++;
		codes[haxe.Unserializer.BASE64.charCodeAt(i)] = i;
	}
	return codes;
};
haxe.Unserializer.run = function(v) {
	return new haxe.Unserializer(v).unserialize();
};
haxe.Unserializer.prototype = {
	setResolver: function(r) {
		if(r == null) this.resolver = { resolveClass : function(_) {
			return null;
		}, resolveEnum : function(_1) {
			return null;
		}}; else this.resolver = r;
	}
	,get: function(p) {
		return this.buf.charCodeAt(p);
	}
	,readDigits: function() {
		var k = 0;
		var s = false;
		var fpos = this.pos;
		while(true) {
			var c = this.buf.charCodeAt(this.pos);
			if(c != c) break;
			if(c == 45) {
				if(this.pos != fpos) break;
				s = true;
				this.pos++;
				continue;
			}
			if(c < 48 || c > 57) break;
			k = k * 10 + (c - 48);
			this.pos++;
		}
		if(s) k *= -1;
		return k;
	}
	,unserializeObject: function(o) {
		while(true) {
			if(this.pos >= this.length) throw "Invalid object";
			if(this.buf.charCodeAt(this.pos) == 103) break;
			var k = this.unserialize();
			if(!(typeof(k) == "string")) throw "Invalid object key";
			var v = this.unserialize();
			o[k] = v;
		}
		this.pos++;
	}
	,unserializeEnum: function(edecl,tag) {
		if(this.get(this.pos++) != 58) throw "Invalid enum format";
		var nargs = this.readDigits();
		if(nargs == 0) return Type.createEnum(edecl,tag);
		var args = new Array();
		while(nargs-- > 0) args.push(this.unserialize());
		return Type.createEnum(edecl,tag,args);
	}
	,unserialize: function() {
		var _g = this.get(this.pos++);
		switch(_g) {
		case 110:
			return null;
		case 116:
			return true;
		case 102:
			return false;
		case 122:
			return 0;
		case 105:
			return this.readDigits();
		case 100:
			var p1 = this.pos;
			while(true) {
				var c = this.buf.charCodeAt(this.pos);
				if(c >= 43 && c < 58 || c == 101 || c == 69) this.pos++; else break;
			}
			return Std.parseFloat(HxOverrides.substr(this.buf,p1,this.pos - p1));
		case 121:
			var len = this.readDigits();
			if(this.get(this.pos++) != 58 || this.length - this.pos < len) throw "Invalid string length";
			var s = HxOverrides.substr(this.buf,this.pos,len);
			this.pos += len;
			s = decodeURIComponent(s.split("+").join(" "));
			this.scache.push(s);
			return s;
		case 107:
			return Math.NaN;
		case 109:
			return Math.NEGATIVE_INFINITY;
		case 112:
			return Math.POSITIVE_INFINITY;
		case 97:
			var buf = this.buf;
			var a = new Array();
			this.cache.push(a);
			while(true) {
				var c1 = this.buf.charCodeAt(this.pos);
				if(c1 == 104) {
					this.pos++;
					break;
				}
				if(c1 == 117) {
					this.pos++;
					var n = this.readDigits();
					a[a.length + n - 1] = null;
				} else a.push(this.unserialize());
			}
			return a;
		case 111:
			var o = { };
			this.cache.push(o);
			this.unserializeObject(o);
			return o;
		case 114:
			var n1 = this.readDigits();
			if(n1 < 0 || n1 >= this.cache.length) throw "Invalid reference";
			return this.cache[n1];
		case 82:
			var n2 = this.readDigits();
			if(n2 < 0 || n2 >= this.scache.length) throw "Invalid string reference";
			return this.scache[n2];
		case 120:
			throw this.unserialize();
			break;
		case 99:
			var name = this.unserialize();
			var cl = this.resolver.resolveClass(name);
			if(cl == null) throw "Class not found " + name;
			var o1 = Type.createEmptyInstance(cl);
			this.cache.push(o1);
			this.unserializeObject(o1);
			return o1;
		case 119:
			var name1 = this.unserialize();
			var edecl = this.resolver.resolveEnum(name1);
			if(edecl == null) throw "Enum not found " + name1;
			var e = this.unserializeEnum(edecl,this.unserialize());
			this.cache.push(e);
			return e;
		case 106:
			var name2 = this.unserialize();
			var edecl1 = this.resolver.resolveEnum(name2);
			if(edecl1 == null) throw "Enum not found " + name2;
			this.pos++;
			var index = this.readDigits();
			var tag = Type.getEnumConstructs(edecl1)[index];
			if(tag == null) throw "Unknown enum index " + name2 + "@" + index;
			var e1 = this.unserializeEnum(edecl1,tag);
			this.cache.push(e1);
			return e1;
		case 108:
			var l = new List();
			this.cache.push(l);
			var buf1 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) l.add(this.unserialize());
			this.pos++;
			return l;
		case 98:
			var h = new haxe.ds.StringMap();
			this.cache.push(h);
			var buf2 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s1 = this.unserialize();
				h.set(s1,this.unserialize());
			}
			this.pos++;
			return h;
		case 113:
			var h1 = new haxe.ds.IntMap();
			this.cache.push(h1);
			var buf3 = this.buf;
			var c2 = this.get(this.pos++);
			while(c2 == 58) {
				var i = this.readDigits();
				h1.set(i,this.unserialize());
				c2 = this.get(this.pos++);
			}
			if(c2 != 104) throw "Invalid IntMap format";
			return h1;
		case 77:
			var h2 = new haxe.ds.ObjectMap();
			this.cache.push(h2);
			var buf4 = this.buf;
			while(this.buf.charCodeAt(this.pos) != 104) {
				var s2 = this.unserialize();
				h2.set(s2,this.unserialize());
			}
			this.pos++;
			return h2;
		case 118:
			var d;
			var s3 = HxOverrides.substr(this.buf,this.pos,19);
			d = HxOverrides.strDate(s3);
			this.cache.push(d);
			this.pos += 19;
			return d;
		case 115:
			var len1 = this.readDigits();
			var buf5 = this.buf;
			if(this.get(this.pos++) != 58 || this.length - this.pos < len1) throw "Invalid bytes length";
			var codes = haxe.Unserializer.CODES;
			if(codes == null) {
				codes = haxe.Unserializer.initCodes();
				haxe.Unserializer.CODES = codes;
			}
			var i1 = this.pos;
			var rest = len1 & 3;
			var size;
			size = (len1 >> 2) * 3 + (rest >= 2?rest - 1:0);
			var max = i1 + (len1 - rest);
			var bytes = haxe.io.Bytes.alloc(size);
			var bpos = 0;
			while(i1 < max) {
				var c11 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c21 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c11 << 2 | c21 >> 4);
				var c3 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c21 << 4 | c3 >> 2);
				var c4 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c3 << 6 | c4);
			}
			if(rest >= 2) {
				var c12 = codes[StringTools.fastCodeAt(buf5,i1++)];
				var c22 = codes[StringTools.fastCodeAt(buf5,i1++)];
				bytes.set(bpos++,c12 << 2 | c22 >> 4);
				if(rest == 3) {
					var c31 = codes[StringTools.fastCodeAt(buf5,i1++)];
					bytes.set(bpos++,c22 << 4 | c31 >> 2);
				}
			}
			this.pos += len1;
			this.cache.push(bytes);
			return bytes;
		case 67:
			var name3 = this.unserialize();
			var cl1 = this.resolver.resolveClass(name3);
			if(cl1 == null) throw "Class not found " + name3;
			var o2 = Type.createEmptyInstance(cl1);
			this.cache.push(o2);
			o2.hxUnserialize(this);
			if(this.get(this.pos++) != 103) throw "Invalid custom data";
			return o2;
		default:
		}
		this.pos--;
		throw "Invalid char " + this.buf.charAt(this.pos) + " at position " + this.pos;
	}
	,__class__: haxe.Unserializer
};
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
haxe.ds.IntMap.__name__ = true;
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
haxe.ds.ObjectMap.__name__ = true;
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,__class__: haxe.ds.StringMap
};
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
haxe.io.Bytes.__name__ = true;
haxe.io.Bytes.alloc = function(length) {
	var a = new Array();
	var _g = 0;
	while(_g < length) {
		var i = _g++;
		a.push(0);
	}
	return new haxe.io.Bytes(length,a);
};
haxe.io.Bytes.prototype = {
	set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,__class__: haxe.io.Bytes
};
haxe.io.Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = true;
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
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
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = true;
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var jsx = {};
jsx.palette_change = {};
jsx.palette_change.Converter = function() {
	if(jsx.palette_change.PaletteInfo.instance == null) this.palletInfo = jsx.palette_change.PaletteInfo.instance = new jsx.palette_change.PaletteInfo(); else this.palletInfo = jsx.palette_change.PaletteInfo.instance;
	this.application = app;
	this.activeDocument = this.application.activeDocument;
	this.layers = this.activeDocument.layers;
	this.layersDisplay = new jsx.util.LayersDisplay(this.layers);
	this.layersDisplay.hide();
	this.execute();
	this.layersDisplay.restore();
};
$hxClasses["jsx.palette_change.Converter"] = jsx.palette_change.Converter;
jsx.palette_change.Converter.__name__ = true;
jsx.palette_change.Converter.prototype = {
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
					var conversionData = new jsx.palette_change.ConversionData(new Point(x,y),this.palletInfo.after.rgbHexValueSet[index]);
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
	,__class__: jsx.palette_change.Converter
};
jsx.palette_change.ConversionData = function(pixel,rgbHexValue) {
	this.pixel = pixel;
	this.rgbHexValue = rgbHexValue;
};
$hxClasses["jsx.palette_change.ConversionData"] = jsx.palette_change.ConversionData;
jsx.palette_change.ConversionData.__name__ = true;
jsx.palette_change.ConversionData.prototype = {
	__class__: jsx.palette_change.ConversionData
};
jsx.palette_change.PaletteChange = function(code) {
	this.application = app;
	if(jsx.palette_change.PaletteInfo.instance == null) this.palletInfo = jsx.palette_change.PaletteInfo.instance = new jsx.palette_change.PaletteInfo(); else this.palletInfo = jsx.palette_change.PaletteInfo.instance;
	this.palletInfo.convert(code);
	if(!this.palletInfo.parsedResult) {
		js.Lib.alert("code error");
		return;
	}
	new jsx.palette_change.Converter();
	js.Lib.alert("completed");
};
$hxClasses["jsx.palette_change.PaletteChange"] = jsx.palette_change.PaletteChange;
jsx.palette_change.PaletteChange.__name__ = true;
jsx.palette_change.PaletteChange.main = function() {
};
jsx.palette_change.PaletteChange.prototype = {
	__class__: jsx.palette_change.PaletteChange
};
jsx.palette_change.PaletteInfo = function() {
};
$hxClasses["jsx.palette_change.PaletteInfo"] = jsx.palette_change.PaletteInfo;
jsx.palette_change.PaletteInfo.__name__ = true;
jsx.palette_change.PaletteInfo.get_instance = function() {
	if(jsx.palette_change.PaletteInfo.instance == null) return jsx.palette_change.PaletteInfo.instance = new jsx.palette_change.PaletteInfo(); else return jsx.palette_change.PaletteInfo.instance;
};
jsx.palette_change.PaletteInfo.prototype = {
	convert: function(code) {
		try {
			var rgbHexValueSets = haxe.Unserializer.run(code);
			this.before = new jsx.palette_change.Palette(rgbHexValueSets[0]);
			this.after = new jsx.palette_change.Palette(rgbHexValueSets[1]);
			this.parsedResult = true;
		} catch( error ) {
			if( js.Boot.__instanceof(error,String) ) {
				this.parsedResult = false;
			} else throw(error);
		}
	}
	,__class__: jsx.palette_change.PaletteInfo
};
jsx.palette_change.Palette = function(rgbHexValueSet) {
	this.rgbHexValueSet = rgbHexValueSet;
};
$hxClasses["jsx.palette_change.Palette"] = jsx.palette_change.Palette;
jsx.palette_change.Palette.__name__ = true;
jsx.palette_change.Palette.prototype = {
	indexOf: function(checkedRgbHexValue) {
		var _g1 = 0;
		var _g = this.rgbHexValueSet.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.rgbHexValueSet[i] == checkedRgbHexValue) return jsx.palette_change.PaletteColorPosition.EXSITS(i);
		}
		return jsx.palette_change.PaletteColorPosition.NONE;
	}
	,__class__: jsx.palette_change.Palette
};
jsx.palette_change.PaletteColorPosition = $hxClasses["jsx.palette_change.PaletteColorPosition"] = { __ename__ : true, __constructs__ : ["NONE","EXSITS"] };
jsx.palette_change.PaletteColorPosition.NONE = ["NONE",0];
jsx.palette_change.PaletteColorPosition.NONE.__enum__ = jsx.palette_change.PaletteColorPosition;
jsx.palette_change.PaletteColorPosition.EXSITS = function(index) { var $x = ["EXSITS",1,index]; $x.__enum__ = jsx.palette_change.PaletteColorPosition; return $x; };
jsx.util = {};
jsx.util.Bounds = function(left,top,right,bottom) {
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
};
$hxClasses["jsx.util.Bounds"] = jsx.util.Bounds;
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
$hxClasses["jsx.util.LayersDisplay"] = jsx.util.LayersDisplay;
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
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = true;
$hxClasses.Array = Array;
Array.__name__ = true;
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
jsx.palette_change.PaletteChange.ATTENTION_WIDTH = 400;
jsx.palette_change.PaletteChange.ATTENTION_HEIGHT = 400;
jsx.palette_change.PaletteChange.main();
})();
