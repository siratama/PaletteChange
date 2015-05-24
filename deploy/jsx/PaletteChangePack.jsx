var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
var HxOverrides = $hxClasses["HxOverrides"] = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
};
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
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,__class__: List
};
var IMap = $hxClasses["IMap"] = function() { };
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
var Reflect = $hxClasses["Reflect"] = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
Reflect.deleteField = function(o,field) {
	if(!Object.prototype.hasOwnProperty.call(o,field)) return false;
	delete(o[field]);
	return true;
};
var Std = $hxClasses["Std"] = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = $hxClasses["StringTools"] = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { };
Type.__name__ = ["Type"];
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
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
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c;
		if((v instanceof Array) && v.__enum__ == null) c = Array; else c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
Type.enumIndex = function(e) {
	return e[1];
};
var common = common || {};
common.CanvasColorSamplerEvent = $hxClasses["common.CanvasColorSamplerEvent"] = { __ename__ : ["common","CanvasColorSamplerEvent"], __constructs__ : ["NONE","RESULT"] };
common.CanvasColorSamplerEvent.NONE = ["NONE",0];
common.CanvasColorSamplerEvent.NONE.toString = $estr;
common.CanvasColorSamplerEvent.NONE.__enum__ = common.CanvasColorSamplerEvent;
common.CanvasColorSamplerEvent.RESULT = function(pixelColorSet) { var $x = ["RESULT",1,pixelColorSet]; $x.__enum__ = common.CanvasColorSamplerEvent; $x.toString = $estr; return $x; };
common.CanvasColorSamplerInitialErrorEvent = $hxClasses["common.CanvasColorSamplerInitialErrorEvent"] = { __ename__ : ["common","CanvasColorSamplerInitialErrorEvent"], __constructs__ : ["NONE","ERROR"] };
common.CanvasColorSamplerInitialErrorEvent.NONE = ["NONE",0];
common.CanvasColorSamplerInitialErrorEvent.NONE.toString = $estr;
common.CanvasColorSamplerInitialErrorEvent.NONE.__enum__ = common.CanvasColorSamplerInitialErrorEvent;
common.CanvasColorSamplerInitialErrorEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = common.CanvasColorSamplerInitialErrorEvent; $x.toString = $estr; return $x; };
common.PaletteChangeEvent = $hxClasses["common.PaletteChangeEvent"] = { __ename__ : ["common","PaletteChangeEvent"], __constructs__ : ["NONE","SUCCESS"] };
common.PaletteChangeEvent.NONE = ["NONE",0];
common.PaletteChangeEvent.NONE.toString = $estr;
common.PaletteChangeEvent.NONE.__enum__ = common.PaletteChangeEvent;
common.PaletteChangeEvent.SUCCESS = ["SUCCESS",1];
common.PaletteChangeEvent.SUCCESS.toString = $estr;
common.PaletteChangeEvent.SUCCESS.__enum__ = common.PaletteChangeEvent;
common.PaletteChangeInitialErrorEvent = $hxClasses["common.PaletteChangeInitialErrorEvent"] = { __ename__ : ["common","PaletteChangeInitialErrorEvent"], __constructs__ : ["NONE","ERROR"] };
common.PaletteChangeInitialErrorEvent.NONE = ["NONE",0];
common.PaletteChangeInitialErrorEvent.NONE.toString = $estr;
common.PaletteChangeInitialErrorEvent.NONE.__enum__ = common.PaletteChangeInitialErrorEvent;
common.PaletteChangeInitialErrorEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = common.PaletteChangeInitialErrorEvent; $x.toString = $estr; return $x; };
common.PixelColor = $hxClasses["common.PixelColor"] = function() {
};
common.PixelColor.__name__ = ["common","PixelColor"];
common.PixelColor.create = function(rgbHexValue,x,y) {
	var pixelColor = new common.PixelColor();
	pixelColor.rgbHexValue = rgbHexValue;
	pixelColor.x = x;
	pixelColor.y = y;
	return pixelColor;
};
common.PixelColor.createWithoutPosition = function(rgbHexValue) {
	var pixelColor = new common.PixelColor();
	pixelColor.rgbHexValue = rgbHexValue;
	pixelColor.x = -1;
	pixelColor.y = -1;
	return pixelColor;
};
common.PixelColor.prototype = {
	isNotSetPosition: function() {
		return this.x == -1;
	}
	,equalPosition: function(checked) {
		return this.x == checked.x && this.y == checked.y;
	}
	,updatePosition: function(x,y) {
		this.x = x;
		this.y = y;
	}
	,__class__: common.PixelColor
};
common.PixelColorSearchEvent = $hxClasses["common.PixelColorSearchEvent"] = { __ename__ : ["common","PixelColorSearchEvent"], __constructs__ : ["NONE","SELECTED","UNSELECTED"] };
common.PixelColorSearchEvent.NONE = ["NONE",0];
common.PixelColorSearchEvent.NONE.toString = $estr;
common.PixelColorSearchEvent.NONE.__enum__ = common.PixelColorSearchEvent;
common.PixelColorSearchEvent.SELECTED = function(x,y) { var $x = ["SELECTED",1,x,y]; $x.__enum__ = common.PixelColorSearchEvent; $x.toString = $estr; return $x; };
common.PixelColorSearchEvent.UNSELECTED = ["UNSELECTED",2];
common.PixelColorSearchEvent.UNSELECTED.toString = $estr;
common.PixelColorSearchEvent.UNSELECTED.__enum__ = common.PixelColorSearchEvent;
common.PixelColorSearchInitialErrorEvent = $hxClasses["common.PixelColorSearchInitialErrorEvent"] = { __ename__ : ["common","PixelColorSearchInitialErrorEvent"], __constructs__ : ["NONE","ERROR"] };
common.PixelColorSearchInitialErrorEvent.NONE = ["NONE",0];
common.PixelColorSearchInitialErrorEvent.NONE.toString = $estr;
common.PixelColorSearchInitialErrorEvent.NONE.__enum__ = common.PixelColorSearchInitialErrorEvent;
common.PixelColorSearchInitialErrorEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = common.PixelColorSearchInitialErrorEvent; $x.toString = $estr; return $x; };
common.PixelSelectorEvent = $hxClasses["common.PixelSelectorEvent"] = { __ename__ : ["common","PixelSelectorEvent"], __constructs__ : ["SELECTED","UNSELECTED"] };
common.PixelSelectorEvent.SELECTED = ["SELECTED",0];
common.PixelSelectorEvent.SELECTED.toString = $estr;
common.PixelSelectorEvent.SELECTED.__enum__ = common.PixelSelectorEvent;
common.PixelSelectorEvent.UNSELECTED = ["UNSELECTED",1];
common.PixelSelectorEvent.UNSELECTED.toString = $estr;
common.PixelSelectorEvent.UNSELECTED.__enum__ = common.PixelSelectorEvent;
common.PixelSelectorInitialErrorEvent = $hxClasses["common.PixelSelectorInitialErrorEvent"] = { __ename__ : ["common","PixelSelectorInitialErrorEvent"], __constructs__ : ["NONE","ERROR"] };
common.PixelSelectorInitialErrorEvent.NONE = ["NONE",0];
common.PixelSelectorInitialErrorEvent.NONE.toString = $estr;
common.PixelSelectorInitialErrorEvent.NONE.__enum__ = common.PixelSelectorInitialErrorEvent;
common.PixelSelectorInitialErrorEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = common.PixelSelectorInitialErrorEvent; $x.toString = $estr; return $x; };
var haxe = haxe || {};
haxe.Serializer = $hxClasses["haxe.Serializer"] = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
	this.scount = 0;
};
haxe.Serializer.__name__ = ["haxe","Serializer"];
haxe.Serializer.run = function(v) {
	var s = new haxe.Serializer();
	s.serialize(v);
	return s.toString();
};
haxe.Serializer.prototype = {
	toString: function() {
		return this.buf.b;
	}
	,serializeString: function(s) {
		var x = this.shash.get(s);
		if(x != null) {
			this.buf.b += "R";
			if(x == null) this.buf.b += "null"; else this.buf.b += "" + x;
			return;
		}
		this.shash.set(s,this.scount++);
		this.buf.b += "y";
		s = encodeURIComponent(s);
		if(s.length == null) this.buf.b += "null"; else this.buf.b += "" + s.length;
		this.buf.b += ":";
		if(s == null) this.buf.b += "null"; else this.buf.b += "" + s;
	}
	,serializeRef: function(v) {
		var vt = typeof(v);
		var _g1 = 0;
		var _g = this.cache.length;
		while(_g1 < _g) {
			var i = _g1++;
			var ci = this.cache[i];
			if(typeof(ci) == vt && ci == v) {
				this.buf.b += "r";
				if(i == null) this.buf.b += "null"; else this.buf.b += "" + i;
				return true;
			}
		}
		this.cache.push(v);
		return false;
	}
	,serializeFields: function(v) {
		var _g = 0;
		var _g1 = Reflect.fields(v);
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			this.serializeString(f);
			this.serialize(Reflect.field(v,f));
		}
		this.buf.b += "g";
	}
	,serialize: function(v) {
		{
			var _g = Type["typeof"](v);
			switch(_g[1]) {
			case 0:
				this.buf.b += "n";
				break;
			case 1:
				var v1 = v;
				if(v1 == 0) {
					this.buf.b += "z";
					return;
				}
				this.buf.b += "i";
				if(v1 == null) this.buf.b += "null"; else this.buf.b += "" + v1;
				break;
			case 2:
				var v2 = v;
				if(Math.isNaN(v2)) this.buf.b += "k"; else if(!Math.isFinite(v2)) if(v2 < 0) this.buf.b += "m"; else this.buf.b += "p"; else {
					this.buf.b += "d";
					if(v2 == null) this.buf.b += "null"; else this.buf.b += "" + v2;
				}
				break;
			case 3:
				if(v) this.buf.b += "t"; else this.buf.b += "f";
				break;
			case 6:
				var c = _g[2];
				if(c == String) {
					this.serializeString(v);
					return;
				}
				if(this.useCache && this.serializeRef(v)) return;
				switch(c) {
				case Array:
					var ucount = 0;
					this.buf.b += "a";
					var l = v.length;
					var _g1 = 0;
					while(_g1 < l) {
						var i = _g1++;
						if(v[i] == null) ucount++; else {
							if(ucount > 0) {
								if(ucount == 1) this.buf.b += "n"; else {
									this.buf.b += "u";
									if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
								}
								ucount = 0;
							}
							this.serialize(v[i]);
						}
					}
					if(ucount > 0) {
						if(ucount == 1) this.buf.b += "n"; else {
							this.buf.b += "u";
							if(ucount == null) this.buf.b += "null"; else this.buf.b += "" + ucount;
						}
					}
					this.buf.b += "h";
					break;
				case List:
					this.buf.b += "l";
					var v3 = v;
					var $it0 = v3.iterator();
					while( $it0.hasNext() ) {
						var i1 = $it0.next();
						this.serialize(i1);
					}
					this.buf.b += "h";
					break;
				case Date:
					var d = v;
					this.buf.b += "v";
					this.buf.add(HxOverrides.dateStr(d));
					break;
				case haxe.ds.StringMap:
					this.buf.b += "b";
					var v4 = v;
					var $it1 = v4.keys();
					while( $it1.hasNext() ) {
						var k = $it1.next();
						this.serializeString(k);
						this.serialize(v4.get(k));
					}
					this.buf.b += "h";
					break;
				case haxe.ds.IntMap:
					this.buf.b += "q";
					var v5 = v;
					var $it2 = v5.keys();
					while( $it2.hasNext() ) {
						var k1 = $it2.next();
						this.buf.b += ":";
						if(k1 == null) this.buf.b += "null"; else this.buf.b += "" + k1;
						this.serialize(v5.get(k1));
					}
					this.buf.b += "h";
					break;
				case haxe.ds.ObjectMap:
					this.buf.b += "M";
					var v6 = v;
					var $it3 = v6.keys();
					while( $it3.hasNext() ) {
						var k2 = $it3.next();
						var id = Reflect.field(k2,"__id__");
						Reflect.deleteField(k2,"__id__");
						this.serialize(k2);
						k2.__id__ = id;
						this.serialize(v6.h[k2.__id__]);
					}
					this.buf.b += "h";
					break;
				case haxe.io.Bytes:
					var v7 = v;
					var i2 = 0;
					var max = v7.length - 2;
					var charsBuf = new StringBuf();
					var b64 = haxe.Serializer.BASE64;
					while(i2 < max) {
						var b1 = v7.get(i2++);
						var b2 = v7.get(i2++);
						var b3 = v7.get(i2++);
						charsBuf.add(b64.charAt(b1 >> 2));
						charsBuf.add(b64.charAt((b1 << 4 | b2 >> 4) & 63));
						charsBuf.add(b64.charAt((b2 << 2 | b3 >> 6) & 63));
						charsBuf.add(b64.charAt(b3 & 63));
					}
					if(i2 == max) {
						var b11 = v7.get(i2++);
						var b21 = v7.get(i2++);
						charsBuf.add(b64.charAt(b11 >> 2));
						charsBuf.add(b64.charAt((b11 << 4 | b21 >> 4) & 63));
						charsBuf.add(b64.charAt(b21 << 2 & 63));
					} else if(i2 == max + 1) {
						var b12 = v7.get(i2++);
						charsBuf.add(b64.charAt(b12 >> 2));
						charsBuf.add(b64.charAt(b12 << 4 & 63));
					}
					var chars = charsBuf.b;
					this.buf.b += "s";
					if(chars.length == null) this.buf.b += "null"; else this.buf.b += "" + chars.length;
					this.buf.b += ":";
					if(chars == null) this.buf.b += "null"; else this.buf.b += "" + chars;
					break;
				default:
					if(this.useCache) this.cache.pop();
					if(v.hxSerialize != null) {
						this.buf.b += "C";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						v.hxSerialize(this);
						this.buf.b += "g";
					} else {
						this.buf.b += "c";
						this.serializeString(Type.getClassName(c));
						if(this.useCache) this.cache.push(v);
						this.serializeFields(v);
					}
				}
				break;
			case 4:
				if(this.useCache && this.serializeRef(v)) return;
				this.buf.b += "o";
				this.serializeFields(v);
				break;
			case 7:
				var e = _g[2];
				if(this.useCache) {
					if(this.serializeRef(v)) return;
					this.cache.pop();
				}
				if(this.useEnumIndex) this.buf.b += "j"; else this.buf.b += "w";
				this.serializeString(Type.getEnumName(e));
				if(this.useEnumIndex) {
					this.buf.b += ":";
					this.buf.b += Std.string(v[1]);
				} else this.serializeString(v[0]);
				this.buf.b += ":";
				var l1 = v.length;
				this.buf.b += Std.string(l1 - 2);
				var _g11 = 2;
				while(_g11 < l1) {
					var i3 = _g11++;
					this.serialize(v[i3]);
				}
				if(this.useCache) this.cache.push(v);
				break;
			case 5:
				throw "Cannot serialize function";
				break;
			default:
				throw "Cannot serialize " + Std.string(v);
			}
		}
	}
	,__class__: haxe.Serializer
};
haxe.Unserializer = $hxClasses["haxe.Unserializer"] = function(buf) {
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
haxe.Unserializer.__name__ = ["haxe","Unserializer"];
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
if(!haxe.ds) haxe.ds = {};
haxe.ds.IntMap = $hxClasses["haxe.ds.IntMap"] = function() {
	this.h = { };
};
haxe.ds.IntMap.__name__ = ["haxe","ds","IntMap"];
haxe.ds.IntMap.__interfaces__ = [IMap];
haxe.ds.IntMap.prototype = {
	set: function(key,value) {
		this.h[key] = value;
	}
	,get: function(key) {
		return this.h[key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key | 0);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.IntMap
};
haxe.ds.ObjectMap = $hxClasses["haxe.ds.ObjectMap"] = function() {
	this.h = { };
	this.h.__keys__ = { };
};
haxe.ds.ObjectMap.__name__ = ["haxe","ds","ObjectMap"];
haxe.ds.ObjectMap.__interfaces__ = [IMap];
haxe.ds.ObjectMap.prototype = {
	set: function(key,value) {
		var id = key.__id__ || (key.__id__ = ++haxe.ds.ObjectMap.count);
		this.h[id] = value;
		this.h.__keys__[id] = key;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h.__keys__ ) {
		if(this.h.hasOwnProperty(key)) a.push(this.h.__keys__[key]);
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.ObjectMap
};
haxe.ds.StringMap = $hxClasses["haxe.ds.StringMap"] = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,__class__: haxe.ds.StringMap
};
if(!haxe.io) haxe.io = {};
haxe.io.Bytes = $hxClasses["haxe.io.Bytes"] = function(length,b) {
	this.length = length;
	this.b = b;
};
haxe.io.Bytes.__name__ = ["haxe","io","Bytes"];
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
	get: function(pos) {
		return this.b[pos];
	}
	,set: function(pos,v) {
		this.b[pos] = v & 255;
	}
	,__class__: haxe.io.Bytes
};
haxe.io.Eof = $hxClasses["haxe.io.Eof"] = function() { };
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
var js = js || {};
js.Boot = $hxClasses["js.Boot"] = function() { };
js.Boot.__name__ = ["js","Boot"];
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
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
};
js.Lib = $hxClasses["js.Lib"] = function() { };
js.Lib.__name__ = ["js","Lib"];
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
var jsx = jsx || {};
jsx.PaletteChangePack = $hxClasses["jsx.PaletteChangePack"] = function() {
};
jsx.PaletteChangePack.__name__ = ["jsx","PaletteChangePack"];
jsx.PaletteChangePack.main = function() {
};
jsx.PaletteChangePack.prototype = {
	__class__: jsx.PaletteChangePack
};
var PixelColorSearch = $hxClasses["PixelColorSearch"] = function() {
	this.application = psd.Lib.app;
	this.colorSamplePosition = new jsx.util.ColorSamplePosition();
};
PixelColorSearch.__name__ = ["PixelColorSearch"];
PixelColorSearch.main = function() {
};
PixelColorSearch.prototype = {
	getSerializedEvent: function() {
		return haxe.Serializer.run(this.event);
	}
	,run: function() {
		this.mainFunction();
	}
	,getInitialErrorEvent: function() {
		var event;
		if(this.application.documents.length == 0) event = common.PixelColorSearchInitialErrorEvent.ERROR("Open document."); else event = common.PixelColorSearchInitialErrorEvent.NONE;
		return haxe.Serializer.run(event);
	}
	,initialize: function(checkedRgbHexValue) {
		this.checkedRgbHexValue = checkedRgbHexValue;
		this.activeDocument = this.application.activeDocument;
		this.colorSamplePosition.initialize(this.activeDocument);
		var activeLayer = this.activeDocument.activeLayer;
		this.layersDisplay = new jsx.util.LayersDisplay(this.activeDocument.layers);
		this.layersDisplay.hide();
		if(!(js.Boot.__cast(activeLayer , ArtLayer)).isBackgroundLayer) activeLayer.visible = true;
		this.bounds = jsx.util.Bounds.convert(activeLayer.bounds);
		this.positionX = this.bounds.left | 0;
		this.positionY = this.bounds.top | 0;
		this.event = common.PixelColorSearchEvent.NONE;
		this.mainFunction = $bind(this,this.scan);
	}
	,scan: function() {
		this.scanPixelCount = 0;
		var _g1 = this.positionY;
		var _g = this.bounds.bottom | 0;
		while(_g1 < _g) {
			var y = _g1++;
			var adjustY;
			if(y == this.colorSamplePosition.activeDocumentHeight) adjustY = y; else adjustY = y + 0.1;
			var _g3 = this.positionX;
			var _g2 = this.bounds.right | 0;
			while(_g3 < _g2) {
				var x = _g3++;
				var adjustX;
				if(x == this.colorSamplePosition.activeDocumentWidth) adjustX = x; else adjustX = x + 0.1;
				var colorSampler = this.activeDocument.colorSamplers.add([adjustX,adjustY]);
				try {
					var rgbHexValue = colorSampler.color.rgb.hexValue;
					if(rgbHexValue == this.checkedRgbHexValue) {
						colorSampler.remove();
						this.selectSimilar(x,y);
						this.destroy(common.PixelColorSearchEvent.SELECTED(x,y));
						return;
					}
				} catch( error ) {
				}
				colorSampler.remove();
				if(++this.scanPixelCount < 10) continue;
				this.adjustPosition(x,y);
				return;
			}
			this.positionX = this.bounds.left | 0;
		}
		this.destroy(common.PixelColorSearchEvent.UNSELECTED);
	}
	,adjustPosition: function(x,y) {
		this.positionX = x + 1;
		this.positionY = y;
		if(this.positionX >= (this.bounds.right | 0)) {
			this.positionX = this.bounds.left | 0;
			this.positionY++;
		}
	}
	,selectSimilar: function(x,y) {
		this.activeDocument.selection.deselect();
		this.selectPixel(x,y);
		this.activeDocument.selection.similar(0,false);
	}
	,selectPixel: function(x,y) {
		this.activeDocument.selection.select([[x,y],[x + 1,y],[x + 1,y + 1],[x,y + 1]]);
	}
	,destroy: function(event) {
		this.event = event;
		this.layersDisplay.restore();
		this.mainFunction = $bind(this,this.finish);
	}
	,finish: function() {
	}
	,interrupt: function() {
		this.layersDisplay.restore();
	}
	,__class__: PixelColorSearch
};
if(!jsx.color_picker) jsx.color_picker = {};
if(!jsx.color_picker._PixelColorSearch) jsx.color_picker._PixelColorSearch = {};
jsx.color_picker._PixelColorSearch.PixelColorSearchTest = $hxClasses["jsx.color_picker._PixelColorSearch.PixelColorSearchTest"] = function() { };
jsx.color_picker._PixelColorSearch.PixelColorSearchTest.__name__ = ["jsx","color_picker","_PixelColorSearch","PixelColorSearchTest"];
jsx.color_picker._PixelColorSearch.PixelColorSearchTest.execute = function() {
	var pixelColorSearch = new PixelColorSearch();
	var errorEvent = haxe.Unserializer.run(pixelColorSearch.getInitialErrorEvent());
	switch(errorEvent[1]) {
	case 1:
		var message = errorEvent[2];
		js.Lib.alert(message);
		return;
	case 0:
		"";
		break;
	}
	var checkedRgbHexColor = "FF0000";
	pixelColorSearch.initialize(checkedRgbHexColor);
	var i = 0;
	try {
		while(i < 100) {
			pixelColorSearch.run();
			var result = pixelColorSearch.getSerializedEvent();
			var event = haxe.Unserializer.run(result);
			switch(event[1]) {
			case 0:
				"";
				break;
			case 2:
				js.Lib.alert("unselected");
				throw "__break__";
				break;
			case 1:
				js.Lib.alert("selected!");
				throw "__break__";
				break;
			}
		}
	} catch( e ) { if( e != "__break__" ) throw e; }
};
var PixelSelector = $hxClasses["PixelSelector"] = function() {
	this.application = psd.Lib.app;
	this.colorSamplePosition = new jsx.util.ColorSamplePosition();
};
PixelSelector.__name__ = ["PixelSelector"];
PixelSelector.main = function() {
};
PixelSelector.prototype = {
	getInitialErrorEvent: function() {
		var event;
		if(this.application.documents.length == 0) event = common.PixelSelectorInitialErrorEvent.ERROR("Open document."); else event = common.PixelSelectorInitialErrorEvent.NONE;
		return haxe.Serializer.run(event);
	}
	,execute: function(serializedPixelColor) {
		var pixelColor = haxe.Unserializer.run(serializedPixelColor);
		this.activeDocument = this.application.activeDocument;
		this.colorSamplePosition.initialize(this.activeDocument);
		var activeLayer = this.activeDocument.activeLayer;
		this.layersDisplay = new jsx.util.LayersDisplay(this.activeDocument.layers);
		this.layersDisplay.hide();
		if(!(js.Boot.__cast(activeLayer , ArtLayer)).isBackgroundLayer) activeLayer.visible = true;
		var event = common.PixelSelectorEvent.UNSELECTED;
		var adjustX = this.colorSamplePosition.getAdjustX(pixelColor.x);
		var adjustY = this.colorSamplePosition.getAdjustY(pixelColor.y);
		var colorSampler = this.activeDocument.colorSamplers.add([adjustX,adjustY]);
		try {
			var checkedRgbHexValue = colorSampler.color.rgb.hexValue;
			if(pixelColor.rgbHexValue == checkedRgbHexValue) {
				this.activeDocument.selection.deselect();
				this.selectPixel(pixelColor.x,pixelColor.y);
				this.activeDocument.selection.similar(0,false);
				event = common.PixelSelectorEvent.SELECTED;
			}
		} catch( error ) {
		}
		colorSampler.remove();
		this.layersDisplay.restore();
		return haxe.Serializer.run(event);
	}
	,selectPixel: function(x,y) {
		this.activeDocument.selection.select([[x,y],[x + 1,y],[x + 1,y + 1],[x,y + 1]]);
	}
	,__class__: PixelSelector
};
if(!jsx.color_picker._PixelSelector) jsx.color_picker._PixelSelector = {};
jsx.color_picker._PixelSelector.PixelSelectorTest = $hxClasses["jsx.color_picker._PixelSelector.PixelSelectorTest"] = function() { };
jsx.color_picker._PixelSelector.PixelSelectorTest.__name__ = ["jsx","color_picker","_PixelSelector","PixelSelectorTest"];
jsx.color_picker._PixelSelector.PixelSelectorTest.execute = function() {
	var pixelSelecter = new PixelSelector();
	var errorEvent = haxe.Unserializer.run(pixelSelecter.getInitialErrorEvent());
	switch(errorEvent[1]) {
	case 1:
		var message = errorEvent[2];
		js.Lib.alert(message);
		return;
	case 0:
		"";
		break;
	}
	var pixelColor = common.PixelColor.create("FF0000",0,0);
	var serializedPixelColor = haxe.Serializer.run(pixelColor);
	var result = pixelSelecter.execute(serializedPixelColor);
	var event = haxe.Unserializer.run(result);
	js.Lib.alert(event);
};
var CanvasColorSampler = $hxClasses["CanvasColorSampler"] = function() {
	this.application = psd.Lib.app;
	this.colorSamplePosition = new jsx.util.ColorSamplePosition();
};
CanvasColorSampler.__name__ = ["CanvasColorSampler"];
CanvasColorSampler.main = function() {
};
CanvasColorSampler.prototype = {
	getSerializedEvent: function() {
		return haxe.Serializer.run(this.event);
	}
	,run: function() {
		this.mainFunction();
	}
	,getInitialErrorEvent: function() {
		var event;
		if(this.application.documents.length == 0) event = common.CanvasColorSamplerInitialErrorEvent.ERROR("Open document."); else if(this.application.activeDocument.activeLayer.typename == LayerTypeName.LAYER_SET) event = common.CanvasColorSamplerInitialErrorEvent.ERROR("Select layer."); else event = common.CanvasColorSamplerInitialErrorEvent.NONE;
		return haxe.Serializer.run(event);
	}
	,initialize: function() {
		this.activeDocument = this.application.activeDocument;
		this.colorSamplePosition.initialize(this.activeDocument);
		var activeLayer = this.activeDocument.activeLayer;
		this.layersDisplay = new jsx.util.LayersDisplay(this.activeDocument.layers);
		this.layersDisplay.hide();
		if(!(js.Boot.__cast(activeLayer , ArtLayer)).isBackgroundLayer) activeLayer.visible = true;
		this.bounds = jsx.util.Bounds.convert(activeLayer.bounds);
		this.pixelColorSet = [];
		this.rgbHexValueMap = new haxe.ds.StringMap();
		this.positionX = this.bounds.left | 0;
		this.positionY = this.bounds.top | 0;
		this.event = common.CanvasColorSamplerEvent.NONE;
		this.mainFunction = $bind(this,this.scan);
	}
	,scan: function() {
		this.scanPixelCount = 0;
		var _g1 = this.positionY;
		var _g = this.bounds.bottom | 0;
		while(_g1 < _g) {
			var y = _g1++;
			var adjustY;
			if(y == this.colorSamplePosition.activeDocumentHeight) adjustY = y; else adjustY = y + 0.1;
			var _g3 = this.positionX;
			var _g2 = this.bounds.right | 0;
			while(_g3 < _g2) {
				var x = _g3++;
				var adjustX;
				if(x == this.colorSamplePosition.activeDocumentWidth) adjustX = x; else adjustX = x + 0.1;
				var colorSampler = this.activeDocument.colorSamplers.add([adjustX,adjustY]);
				try {
					var rgbHexValue = colorSampler.color.rgb.hexValue;
					if(!this.rgbHexValueMap.get(rgbHexValue)) {
						var pixelColor = common.PixelColor.create(rgbHexValue,x,y);
						this.pixelColorSet.push(pixelColor);
						this.rgbHexValueMap.set(rgbHexValue,true);
					}
				} catch( error ) {
				}
				colorSampler.remove();
				if(++this.scanPixelCount < 10) continue;
				this.adjustPosition(x,y);
				return;
			}
			this.positionX = this.bounds.left | 0;
		}
		this.mainFunction = $bind(this,this.finish);
	}
	,adjustPosition: function(x,y) {
		this.positionX = x + 1;
		this.positionY = y;
		if(this.positionX >= (this.bounds.right | 0)) {
			this.positionX = this.bounds.left | 0;
			this.positionY++;
		}
	}
	,finish: function() {
		this.layersDisplay.restore();
		this.event = common.CanvasColorSamplerEvent.RESULT(this.pixelColorSet);
	}
	,interrupt: function() {
		this.layersDisplay.restore();
	}
	,__class__: CanvasColorSampler
};
if(!jsx.color_sampler) jsx.color_sampler = {};
if(!jsx.color_sampler._CanvasColorSampler) jsx.color_sampler._CanvasColorSampler = {};
jsx.color_sampler._CanvasColorSampler.CanvasColorSamplerTest = $hxClasses["jsx.color_sampler._CanvasColorSampler.CanvasColorSamplerTest"] = function() { };
jsx.color_sampler._CanvasColorSampler.CanvasColorSamplerTest.__name__ = ["jsx","color_sampler","_CanvasColorSampler","CanvasColorSamplerTest"];
jsx.color_sampler._CanvasColorSampler.CanvasColorSamplerTest.execute = function() {
	var canvasColorSampler = new CanvasColorSampler();
	var initialErrorEvent = haxe.Unserializer.run(canvasColorSampler.getInitialErrorEvent());
	switch(initialErrorEvent[1]) {
	case 1:
		var message = initialErrorEvent[2];
		js.Lib.alert(message);
		return;
	case 0:
		"";
		break;
	}
	canvasColorSampler.initialize();
	canvasColorSampler.run();
	canvasColorSampler.run();
	var result = canvasColorSampler.getSerializedEvent();
	var event = haxe.Unserializer.run(result);
	switch(event[1]) {
	case 0:
		return;
	case 1:
		var pixelColorSet = event[2];
		js.Lib.alert(pixelColorSet);
		break;
	}
};
if(!jsx.palette_change) jsx.palette_change = {};
jsx.palette_change.Converter = $hxClasses["jsx.palette_change.Converter"] = function() {
	this.application = psd.Lib.app;
	this.painter = new jsx.palette_change._Converter.Painter();
	this.scanner = new jsx.palette_change._Converter.Scanner();
};
jsx.palette_change.Converter.__name__ = ["jsx","palette_change","Converter"];
jsx.palette_change.Converter.prototype = {
	run: function() {
		this.mainFunction();
	}
	,initialize: function(ignoreLockedLayer,activeDocument,layers) {
		this.ignoreLockedLayer = ignoreLockedLayer;
		this.activeDocument = activeDocument;
		this.layers = layers;
		this.layersDisplay = new jsx.util.LayersDisplay(layers);
		this.layersDisplay.hide();
		this.sampleLayerIndex = 0;
		this.mainFunction = $bind(this,this.setSampleLayer);
	}
	,setSampleLayer: function() {
		if(this.sampleLayerIndex < this.layers.length) {
			this.sampleLayer = this.layers[this.sampleLayerIndex];
			this.sampleLayerIndex++;
			if(this.sampleLayer.typename == LayerTypeName.LAYER_SET) {
				this.innerConverter = new jsx.palette_change.Converter();
				this.innerConverter.initialize(this.ignoreLockedLayer,this.activeDocument,(js.Boot.__cast(this.sampleLayer , LayerSet)).layers);
				this.mainFunction = $bind(this,this.runInnerConverter);
			} else if((js.Boot.__cast(this.sampleLayer , ArtLayer)).isBackgroundLayer) {
			} else if(this.ignoreLockedLayer && this.sampleLayer.allLocked) {
			} else this.initializeToScan();
		} else {
			this.layersDisplay.restore();
			this.mainFunction = $bind(this,this.finish);
		}
	}
	,runInnerConverter: function() {
		this.innerConverter.run();
		if(this.innerConverter.isFinished()) this.mainFunction = $bind(this,this.setSampleLayer);
	}
	,initializeToScan: function() {
		this.scanner.initialize(this.activeDocument,this.sampleLayer);
		this.mainFunction = $bind(this,this.scan);
	}
	,scan: function() {
		this.scanner.run();
		if(this.scanner.isFinished()) this.initializeToPaint();
	}
	,initializeToPaint: function() {
		if(this.scanner.conversionDataSet.length > 0) {
			this.painter.initialize(this.activeDocument,this.sampleLayer,this.scanner.conversionDataSet);
			this.mainFunction = $bind(this,this.paint);
		} else this.destroyToPaint();
	}
	,paint: function() {
		this.painter.run();
		if(this.painter.isFinished()) this.destroyToPaint();
	}
	,destroyToPaint: function() {
		this.mainFunction = $bind(this,this.setSampleLayer);
	}
	,finish: function() {
	}
	,isFinished: function() {
		return Reflect.compareMethods(this.mainFunction,$bind(this,this.finish));
	}
	,interrupt: function() {
		this.layersDisplay.restore();
	}
	,__class__: jsx.palette_change.Converter
};
if(!jsx.palette_change._Converter) jsx.palette_change._Converter = {};
jsx.palette_change._Converter.ConversionData = $hxClasses["jsx.palette_change._Converter.ConversionData"] = function(pixelX,pixelY,rgbHexValue) {
	this.pixelX = pixelX;
	this.pixelY = pixelY;
	this.rgbHexValue = rgbHexValue;
};
jsx.palette_change._Converter.ConversionData.__name__ = ["jsx","palette_change","_Converter","ConversionData"];
jsx.palette_change._Converter.ConversionData.prototype = {
	__class__: jsx.palette_change._Converter.ConversionData
};
jsx.palette_change._Converter.Scanner = $hxClasses["jsx.palette_change._Converter.Scanner"] = function() {
	if(jsx.palette_change.PaletteMap.instance == null) this.paletteMap = jsx.palette_change.PaletteMap.instance = new jsx.palette_change.PaletteMap(); else this.paletteMap = jsx.palette_change.PaletteMap.instance;
	this.colorSamplePosition = new jsx.util.ColorSamplePosition();
};
jsx.palette_change._Converter.Scanner.__name__ = ["jsx","palette_change","_Converter","Scanner"];
jsx.palette_change._Converter.Scanner.prototype = {
	run: function() {
		this.mainFunction();
	}
	,initialize: function(activeDocument,sampleLayer) {
		this.activeDocument = activeDocument;
		this.colorSamplePosition.initialize(activeDocument);
		activeDocument.activeLayer = sampleLayer;
		if(!(js.Boot.__cast(sampleLayer , ArtLayer)).isBackgroundLayer) sampleLayer.visible = true;
		this.sampleBounds = jsx.util.Bounds.convert(sampleLayer.bounds);
		this.samplePositionX = this.sampleBounds.left | 0;
		this.samplePositionY = this.sampleBounds.top | 0;
		this.conversionDataSet = [];
		this.conversionRgbHexValueMap = new haxe.ds.StringMap();
		this.mainFunction = $bind(this,this.execute);
	}
	,execute: function() {
		this.scanPixelCount = 0;
		var _g1 = this.samplePositionY;
		var _g = this.sampleBounds.bottom | 0;
		while(_g1 < _g) {
			var y = _g1++;
			var adjustY;
			if(y == this.colorSamplePosition.activeDocumentHeight) adjustY = y; else adjustY = y + 0.1;
			var _g3 = this.samplePositionX;
			var _g2 = this.sampleBounds.right | 0;
			while(_g3 < _g2) {
				var x = _g3++;
				var adjustX;
				if(x == this.colorSamplePosition.activeDocumentWidth) adjustX = x; else adjustX = x + 0.1;
				var colorSampler = this.activeDocument.colorSamplers.add([adjustX,adjustY]);
				try {
					var hexValue = colorSampler.color.rgb.hexValue;
					if(!this.conversionRgbHexValueMap.get(hexValue) && this.paletteMap.map.get(hexValue) != null) {
						var conversionData = new jsx.palette_change._Converter.ConversionData(x,y,this.paletteMap.map.get(hexValue));
						this.conversionDataSet.push(conversionData);
						this.conversionRgbHexValueMap.set(hexValue,true);
						true;
					}
				} catch( error ) {
				}
				colorSampler.remove();
				if(++this.scanPixelCount < 10) continue;
				this.adjustPosition(x,y);
				return;
			}
			this.samplePositionX = this.sampleBounds.left | 0;
		}
		this.mainFunction = $bind(this,this.finish);
	}
	,adjustPosition: function(x,y) {
		this.samplePositionX = x + 1;
		this.samplePositionY = y;
		if(this.samplePositionX >= (this.sampleBounds.right | 0)) {
			this.samplePositionX = this.sampleBounds.left | 0;
			this.samplePositionY++;
		}
	}
	,finish: function() {
	}
	,isFinished: function() {
		return Reflect.compareMethods(this.mainFunction,$bind(this,this.finish));
	}
	,__class__: jsx.palette_change._Converter.Scanner
};
jsx.palette_change._Converter.Painter = $hxClasses["jsx.palette_change._Converter.Painter"] = function() {
	this.colorSamplePosition = new jsx.util.ColorSamplePosition();
};
jsx.palette_change._Converter.Painter.__name__ = ["jsx","palette_change","_Converter","Painter"];
jsx.palette_change._Converter.Painter.prototype = {
	run: function() {
		this.mainFunction();
	}
	,initialize: function(activeDocument,sampleLayer,conversionDataSet) {
		this.activeDocument = activeDocument;
		this.conversionDataSet = conversionDataSet;
		this.sampleLayer = sampleLayer;
		if(sampleLayer.allLocked) {
			sampleLayer.allLocked = false;
			this.wasLocked = true;
		}
		this.colorSamplePosition.initialize(activeDocument);
		this.duplicatedPaintLayer = sampleLayer.duplicate();
		this.mainFunction = $bind(this,this.setPaintedConversionData);
	}
	,setPaintedConversionData: function() {
		if(this.conversionDataSet.length > 0) {
			this.paintedConversionData = this.conversionDataSet.shift();
			this.mainFunction = $bind(this,this.execute);
		} else this.mergeLayer();
	}
	,execute: function() {
		this.activeDocument.activeLayer = this.sampleLayer;
		this.selectPixel(this.paintedConversionData.pixelX,this.paintedConversionData.pixelY);
		this.activeDocument.selection.similar(0,false);
		this.activeDocument.activeLayer = this.duplicatedPaintLayer;
		var color = new SolidColor();
		color.rgb.hexValue = this.paintedConversionData.rgbHexValue;
		this.activeDocument.selection.fill(color);
		this.activeDocument.selection.deselect();
		this.mainFunction = $bind(this,this.setPaintedConversionData);
	}
	,selectPixel: function(x,y) {
		this.activeDocument.selection.select([[x,y],[x + 1,y],[x + 1,y + 1],[x,y + 1]]);
	}
	,mergeLayer: function() {
		this.leftTopPixelWasTransparent = this.fillPixel(0,0);
		this.rightBottomPixelWasTransparent = this.fillPixel((this.activeDocument.width | 0) - 1,(this.activeDocument.height | 0) - 1);
		this.activeDocument.selection.selectAll();
		this.activeDocument.selection.copy(false);
		this.activeDocument.activeLayer.remove();
		this.activeDocument.activeLayer = this.sampleLayer;
		this.activeDocument.selection.clear();
		this.activeDocument.paste(false);
		if(this.leftTopPixelWasTransparent) this.clearPixel(0,0);
		if(this.rightBottomPixelWasTransparent) this.clearPixel((this.activeDocument.width | 0) - 1,(this.activeDocument.height | 0) - 1);
		if(!(js.Boot.__cast(this.sampleLayer , ArtLayer)).isBackgroundLayer) this.sampleLayer.visible = false;
		if(this.wasLocked) this.sampleLayer.allLocked = true;
		this.mainFunction = $bind(this,this.finish);
	}
	,fillPixel: function(x,y) {
		var sampleX;
		if(x == this.colorSamplePosition.activeDocumentWidth) sampleX = x; else sampleX = x + 0.1;
		var sampleY;
		if(y == this.colorSamplePosition.activeDocumentWidth) sampleY = y; else sampleY = y + 0.1;
		var isTransparent = true;
		var colorSampler = this.activeDocument.colorSamplers.add([sampleX,sampleY]);
		try {
			var hexValue = colorSampler.color.rgb.hexValue;
			isTransparent = false;
		} catch( error ) {
		}
		colorSampler.remove();
		if(!isTransparent) return false;
		this.selectPixel(x,y);
		var color = new SolidColor();
		color.rgb.hexValue = "ff0000";
		this.activeDocument.selection.fill(color);
		this.activeDocument.selection.deselect();
		return true;
	}
	,clearPixel: function(x,y) {
		this.selectPixel(x,y);
		this.activeDocument.selection.clear();
		this.activeDocument.selection.deselect();
	}
	,finish: function() {
	}
	,isFinished: function() {
		return Reflect.compareMethods(this.mainFunction,$bind(this,this.finish));
	}
	,__class__: jsx.palette_change._Converter.Painter
};
var PaletteChange = $hxClasses["PaletteChange"] = function() {
	this.application = psd.Lib.app;
	if(jsx.palette_change.PaletteMap.instance == null) this.paletteMap = jsx.palette_change.PaletteMap.instance = new jsx.palette_change.PaletteMap(); else this.paletteMap = jsx.palette_change.PaletteMap.instance;
	this.converter = new jsx.palette_change.Converter();
};
PaletteChange.__name__ = ["PaletteChange"];
PaletteChange.main = function() {
};
PaletteChange.prototype = {
	getSerializedEvent: function() {
		return haxe.Serializer.run(this.event);
	}
	,getInitialErrorEvent: function() {
		var event;
		if(this.application.documents.length == 0) event = common.PaletteChangeInitialErrorEvent.ERROR("Open document."); else event = common.PaletteChangeInitialErrorEvent.NONE;
		return haxe.Serializer.run(event);
	}
	,run: function() {
		this.mainFunction();
	}
	,execute: function(code,ignoreLockedLayer) {
		this.event = common.PaletteChangeEvent.NONE;
		this.paletteMap.convert(code);
		this.converter.initialize(ignoreLockedLayer,this.application.activeDocument,this.application.activeDocument.layers);
		this.mainFunction = $bind(this,this.convert);
	}
	,convert: function() {
		this.converter.run();
		if(this.converter.isFinished()) this.event = common.PaletteChangeEvent.SUCCESS;
	}
	,interrupt: function() {
		this.converter.interrupt();
	}
	,__class__: PaletteChange
};
if(!jsx.palette_change._PaletteChange) jsx.palette_change._PaletteChange = {};
jsx.palette_change._PaletteChange.PaletteChangeTest = $hxClasses["jsx.palette_change._PaletteChange.PaletteChangeTest"] = function() { };
jsx.palette_change._PaletteChange.PaletteChangeTest.__name__ = ["jsx","palette_change","_PaletteChange","PaletteChangeTest"];
jsx.palette_change._PaletteChange.PaletteChangeTest.execute = function() {
	var paletteChange = new PaletteChange();
	{
		var _g = haxe.Unserializer.run(paletteChange.getInitialErrorEvent());
		switch(Type.enumIndex(_g)) {
		case 1:
			var message = _g[2];
			js.Lib.alert(message);
			return;
		case 0:
			"";
			break;
		}
	}
	var arr = [["FF0000"],["0000FF"]];
	var code = haxe.Serializer.run(arr);
	paletteChange.execute(code,true);
	var _g1 = 0;
	try {
		while(_g1 < 100) {
			var i = _g1++;
			paletteChange.run();
			var result = paletteChange.getSerializedEvent();
			var event = haxe.Unserializer.run(result);
			switch(event[1]) {
			case 0:
				"";
				break;
			case 1:
				js.Lib.alert("success!");
				throw "__break__";
				break;
			}
		}
	} catch( e ) { if( e != "__break__" ) throw e; }
};
jsx.palette_change.PaletteMap = $hxClasses["jsx.palette_change.PaletteMap"] = function() {
};
jsx.palette_change.PaletteMap.__name__ = ["jsx","palette_change","PaletteMap"];
jsx.palette_change.PaletteMap.get_instance = function() {
	if(jsx.palette_change.PaletteMap.instance == null) return jsx.palette_change.PaletteMap.instance = new jsx.palette_change.PaletteMap(); else return jsx.palette_change.PaletteMap.instance;
};
jsx.palette_change.PaletteMap.prototype = {
	convert: function(code) {
		var rgbHexValueSets = haxe.Unserializer.run(code);
		var beforeRgbHexValueSet = rgbHexValueSets[0];
		var afterRgbHexValueSet = rgbHexValueSets[1];
		this.map = new haxe.ds.StringMap();
		var _g1 = 0;
		var _g = beforeRgbHexValueSet.length;
		while(_g1 < _g) {
			var i = _g1++;
			var beforeRgbHexValue = beforeRgbHexValueSet[i];
			var afterRgbHexValue = afterRgbHexValueSet[i];
			if(beforeRgbHexValue == afterRgbHexValue) continue;
			this.map.set(beforeRgbHexValue,afterRgbHexValue);
			afterRgbHexValue;
		}
	}
	,__class__: jsx.palette_change.PaletteMap
};
if(!jsx.util) jsx.util = {};
jsx.util.Bounds = $hxClasses["jsx.util.Bounds"] = function(left,top,right,bottom) {
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
};
jsx.util.Bounds.__name__ = ["jsx","util","Bounds"];
jsx.util.Bounds.convert = function(bounds) {
	return new jsx.util.Bounds(bounds[0].value,bounds[1].value,bounds[2].value,bounds[3].value);
};
jsx.util.Bounds.prototype = {
	toString: function() {
		return [this.left,this.top,this.right,this.bottom].join(":");
	}
	,__class__: jsx.util.Bounds
};
jsx.util.ColorSamplePosition = $hxClasses["jsx.util.ColorSamplePosition"] = function() {
};
jsx.util.ColorSamplePosition.__name__ = ["jsx","util","ColorSamplePosition"];
jsx.util.ColorSamplePosition.prototype = {
	initialize: function(activeDocument) {
		this.activeDocumentWidth = activeDocument.width;
		this.activeDocumentHeight = activeDocument.height;
	}
	,getAdjustX: function(x) {
		if(x == this.activeDocumentWidth) return x; else return x + 0.1;
	}
	,getAdjustY: function(y) {
		if(y == this.activeDocumentHeight) return y; else return y + 0.1;
	}
	,__class__: jsx.util.ColorSamplePosition
};
jsx.util.LayersDisplay = $hxClasses["jsx.util.LayersDisplay"] = function(layers) {
	this.layers = layers;
	this.defaultLayerVisibleSet = [];
	this.layersDisplayMap = new haxe.ds.ObjectMap();
};
jsx.util.LayersDisplay.__name__ = ["jsx","util","LayersDisplay"];
jsx.util.LayersDisplay.prototype = {
	hide: function() {
		var _g1 = 0;
		var _g = this.layers.length;
		while(_g1 < _g) {
			var i = _g1++;
			var layer = this.layers[i];
			if(layer.typename == LayerTypeName.LAYER_SET) {
				var layerSet;
				layerSet = js.Boot.__cast(layer , LayerSet);
				var layersDisplay = new jsx.util.LayersDisplay(layerSet.layers);
				layersDisplay.hide();
				this.layersDisplayMap.set(layerSet,layersDisplay);
				continue;
			}
			if((js.Boot.__cast(layer , ArtLayer)).isBackgroundLayer) continue;
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
			if(layer.typename == LayerTypeName.LAYER_SET) {
				var layerSet;
				layerSet = js.Boot.__cast(layer , LayerSet);
				var layersDisplay = this.layersDisplayMap.h[layerSet.__id__];
				layersDisplay.restore();
				continue;
			}
			if((js.Boot.__cast(layer , ArtLayer)).isBackgroundLayer) continue;
			layer.visible = this.defaultLayerVisibleSet[i];
		}
	}
	,__class__: jsx.util.LayersDisplay
};
var LayerTypeName = $hxClasses["LayerTypeName"] = function() { };
LayerTypeName.__name__ = ["LayerTypeName"];
var psd = psd || {};
psd.Lib = $hxClasses["psd.Lib"] = function() { };
psd.Lib.__name__ = ["psd","Lib"];
psd.Lib.writeln = function(message) {
	$.writeln(message);
};
psd.UnitType = $hxClasses["psd.UnitType"] = function() { };
psd.UnitType.__name__ = ["psd","UnitType"];
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
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
String.__name__ = ["String"];
$hxClasses.Array = Array;
Array.__name__ = ["Array"];
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
common.PixelColor.NOT_SET_POSITION = -1;
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
PixelColorSearch.ONCE_SCAN_PIXEL = 10;
CanvasColorSampler.ONCE_SCAN_PIXEL = 10;
jsx.palette_change._Converter.Scanner.ONCE_SCAN_PIXEL = 10;
LayerTypeName.LAYER_SET = "LayerSet";
psd.Lib.app = app;
psd.UnitType.PIXEL = "px";
jsx.PaletteChangePack.main();
