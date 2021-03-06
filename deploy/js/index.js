(function () { "use strict";
var $hxClasses = {};
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
$hxClasses["HxOverrides"] = HxOverrides;
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
var List = function() {
	this.length = 0;
};
$hxClasses["List"] = List;
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
var IMap = function() { };
$hxClasses["IMap"] = IMap;
IMap.__name__ = ["IMap"];
Math.__name__ = ["Math"];
var Reflect = function() { };
$hxClasses["Reflect"] = Reflect;
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
var Std = function() { };
$hxClasses["Std"] = Std;
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
Std.parseFloat = function(x) {
	return parseFloat(x);
};
var StringBuf = function() {
	this.b = "";
};
$hxClasses["StringBuf"] = StringBuf;
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	add: function(x) {
		this.b += Std.string(x);
	}
	,__class__: StringBuf
};
var StringTools = function() { };
$hxClasses["StringTools"] = StringTools;
StringTools.__name__ = ["StringTools"];
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
};
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
$hxClasses["Type"] = Type;
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
var adobe = {};
adobe.cep = {};
adobe.cep._CSEventScope = {};
adobe.cep._CSEventScope.CSEventScope_Impl_ = function() { };
$hxClasses["adobe.cep._CSEventScope.CSEventScope_Impl_"] = adobe.cep._CSEventScope.CSEventScope_Impl_;
adobe.cep._CSEventScope.CSEventScope_Impl_.__name__ = ["adobe","cep","_CSEventScope","CSEventScope_Impl_"];
adobe.cep._CSEventType = {};
adobe.cep._CSEventType.CSEventType_Impl_ = function() { };
$hxClasses["adobe.cep._CSEventType.CSEventType_Impl_"] = adobe.cep._CSEventType.CSEventType_Impl_;
adobe.cep._CSEventType.CSEventType_Impl_.__name__ = ["adobe","cep","_CSEventType","CSEventType_Impl_"];
adobe.cep._OpenURLInDefaultBrowserCode = {};
adobe.cep._OpenURLInDefaultBrowserCode.OpenURLInDefaultBrowserCode_Impl_ = function() { };
$hxClasses["adobe.cep._OpenURLInDefaultBrowserCode.OpenURLInDefaultBrowserCode_Impl_"] = adobe.cep._OpenURLInDefaultBrowserCode.OpenURLInDefaultBrowserCode_Impl_;
adobe.cep._OpenURLInDefaultBrowserCode.OpenURLInDefaultBrowserCode_Impl_.__name__ = ["adobe","cep","_OpenURLInDefaultBrowserCode","OpenURLInDefaultBrowserCode_Impl_"];
adobe.cep._ScaleFactor = {};
adobe.cep._ScaleFactor.ScaleFactor_Impl_ = function() { };
$hxClasses["adobe.cep._ScaleFactor.ScaleFactor_Impl_"] = adobe.cep._ScaleFactor.ScaleFactor_Impl_;
adobe.cep._ScaleFactor.ScaleFactor_Impl_.__name__ = ["adobe","cep","_ScaleFactor","ScaleFactor_Impl_"];
adobe.cep._UIColorType = {};
adobe.cep._UIColorType.UIColorType_Impl_ = function() { };
$hxClasses["adobe.cep._UIColorType.UIColorType_Impl_"] = adobe.cep._UIColorType.UIColorType_Impl_;
adobe.cep._UIColorType.UIColorType_Impl_.__name__ = ["adobe","cep","_UIColorType","UIColorType_Impl_"];
var common = {};
common.CanvasColorSamplerEvent = $hxClasses["common.CanvasColorSamplerEvent"] = { __ename__ : ["common","CanvasColorSamplerEvent"], __constructs__ : ["NONE","RESULT"] };
common.CanvasColorSamplerEvent.NONE = ["NONE",0];
common.CanvasColorSamplerEvent.NONE.__enum__ = common.CanvasColorSamplerEvent;
common.CanvasColorSamplerEvent.RESULT = function(pixelColorSet) { var $x = ["RESULT",1,pixelColorSet]; $x.__enum__ = common.CanvasColorSamplerEvent; return $x; };
common.CanvasColorSamplerInitialErrorEvent = $hxClasses["common.CanvasColorSamplerInitialErrorEvent"] = { __ename__ : ["common","CanvasColorSamplerInitialErrorEvent"], __constructs__ : ["NONE","ERROR"] };
common.CanvasColorSamplerInitialErrorEvent.NONE = ["NONE",0];
common.CanvasColorSamplerInitialErrorEvent.NONE.__enum__ = common.CanvasColorSamplerInitialErrorEvent;
common.CanvasColorSamplerInitialErrorEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = common.CanvasColorSamplerInitialErrorEvent; return $x; };
common.ClassName = function() { };
$hxClasses["common.ClassName"] = common.ClassName;
common.ClassName.__name__ = ["common","ClassName"];
common.JsxEvent = $hxClasses["common.JsxEvent"] = { __ename__ : ["common","JsxEvent"], __constructs__ : ["NONE","GOTTEN"] };
common.JsxEvent.NONE = ["NONE",0];
common.JsxEvent.NONE.__enum__ = common.JsxEvent;
common.JsxEvent.GOTTEN = function(serializedEvent) { var $x = ["GOTTEN",1,serializedEvent]; $x.__enum__ = common.JsxEvent; return $x; };
common.PaletteChangeEvent = $hxClasses["common.PaletteChangeEvent"] = { __ename__ : ["common","PaletteChangeEvent"], __constructs__ : ["NONE","SUCCESS"] };
common.PaletteChangeEvent.NONE = ["NONE",0];
common.PaletteChangeEvent.NONE.__enum__ = common.PaletteChangeEvent;
common.PaletteChangeEvent.SUCCESS = ["SUCCESS",1];
common.PaletteChangeEvent.SUCCESS.__enum__ = common.PaletteChangeEvent;
common.PaletteChangeInitialErrorEvent = $hxClasses["common.PaletteChangeInitialErrorEvent"] = { __ename__ : ["common","PaletteChangeInitialErrorEvent"], __constructs__ : ["NONE","ERROR"] };
common.PaletteChangeInitialErrorEvent.NONE = ["NONE",0];
common.PaletteChangeInitialErrorEvent.NONE.__enum__ = common.PaletteChangeInitialErrorEvent;
common.PaletteChangeInitialErrorEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = common.PaletteChangeInitialErrorEvent; return $x; };
common.PixelColor = function() {
};
$hxClasses["common.PixelColor"] = common.PixelColor;
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
common.PixelColorSearchEvent.NONE.__enum__ = common.PixelColorSearchEvent;
common.PixelColorSearchEvent.SELECTED = function(x,y) { var $x = ["SELECTED",1,x,y]; $x.__enum__ = common.PixelColorSearchEvent; return $x; };
common.PixelColorSearchEvent.UNSELECTED = ["UNSELECTED",2];
common.PixelColorSearchEvent.UNSELECTED.__enum__ = common.PixelColorSearchEvent;
common.PixelColorSearchInitialErrorEvent = $hxClasses["common.PixelColorSearchInitialErrorEvent"] = { __ename__ : ["common","PixelColorSearchInitialErrorEvent"], __constructs__ : ["NONE","ERROR"] };
common.PixelColorSearchInitialErrorEvent.NONE = ["NONE",0];
common.PixelColorSearchInitialErrorEvent.NONE.__enum__ = common.PixelColorSearchInitialErrorEvent;
common.PixelColorSearchInitialErrorEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = common.PixelColorSearchInitialErrorEvent; return $x; };
common.PixelSelectorEvent = $hxClasses["common.PixelSelectorEvent"] = { __ename__ : ["common","PixelSelectorEvent"], __constructs__ : ["SELECTED","UNSELECTED"] };
common.PixelSelectorEvent.SELECTED = ["SELECTED",0];
common.PixelSelectorEvent.SELECTED.__enum__ = common.PixelSelectorEvent;
common.PixelSelectorEvent.UNSELECTED = ["UNSELECTED",1];
common.PixelSelectorEvent.UNSELECTED.__enum__ = common.PixelSelectorEvent;
common.PixelSelectorInitialErrorEvent = $hxClasses["common.PixelSelectorInitialErrorEvent"] = { __ename__ : ["common","PixelSelectorInitialErrorEvent"], __constructs__ : ["NONE","UNSELECTED_SINGLE_LAYER","SELECTED_LAYER_SET","ERROR"] };
common.PixelSelectorInitialErrorEvent.NONE = ["NONE",0];
common.PixelSelectorInitialErrorEvent.NONE.__enum__ = common.PixelSelectorInitialErrorEvent;
common.PixelSelectorInitialErrorEvent.UNSELECTED_SINGLE_LAYER = ["UNSELECTED_SINGLE_LAYER",1];
common.PixelSelectorInitialErrorEvent.UNSELECTED_SINGLE_LAYER.__enum__ = common.PixelSelectorInitialErrorEvent;
common.PixelSelectorInitialErrorEvent.SELECTED_LAYER_SET = ["SELECTED_LAYER_SET",2];
common.PixelSelectorInitialErrorEvent.SELECTED_LAYER_SET.__enum__ = common.PixelSelectorInitialErrorEvent;
common.PixelSelectorInitialErrorEvent.ERROR = function(message) { var $x = ["ERROR",3,message]; $x.__enum__ = common.PixelSelectorInitialErrorEvent; return $x; };
var extension = {};
extension.AbstractCSInterface = function(csInterface) {
	this.csInterface = csInterface;
};
$hxClasses["extension.AbstractCSInterface"] = extension.AbstractCSInterface;
extension.AbstractCSInterface.__name__ = ["extension","AbstractCSInterface"];
extension.AbstractCSInterface.create = function() {
	return new extension.AbstractCSInterface(new CSInterface());
};
extension.AbstractCSInterface.prototype = {
	getExtensionUri: function() {
		return "file:///" + this.csInterface.getSystemPath(SystemPath.EXTENSION);
	}
	,getExtensionSystemPath: function() {
		return this.csInterface.getSystemPath(SystemPath.EXTENSION);
	}
	,evalScript: function(script,callback) {
		this.csInterface.evalScript(script,callback);
	}
	,evalFile: function(filePath,callback) {
		this.csInterface.evalScript("$.evalFile(\"" + filePath + "\");",callback);
	}
	,showColorPicker: function(pickForeground,callback) {
		if(pickForeground == null) pickForeground = true;
		return this.csInterface.evalScript("app.showColorPicker(" + (pickForeground == null?"null":"" + pickForeground) + ");",callback);
	}
	,callColorPicker: function(callback) {
		return this.csInterface.evalScript("$.colorPicker();",callback);
	}
	,__class__: extension.AbstractCSInterface
};
extension.CanvasColorSamplerRunner = function() {
	this.csInterface = extension.AbstractCSInterface.create();
	if(extension.color_sampler.CanvasColorSamplerUI.instance == null) this.canvasColorSamplerUI = extension.color_sampler.CanvasColorSamplerUI.instance = new extension.color_sampler.CanvasColorSamplerUI(); else this.canvasColorSamplerUI = extension.color_sampler.CanvasColorSamplerUI.instance;
	if(extension.overlay.OverlayWindow.instance == null) this.overlayWindow = extension.overlay.OverlayWindow.instance = new extension.overlay.OverlayWindow(); else this.overlayWindow = extension.overlay.OverlayWindow.instance;
};
$hxClasses["extension.CanvasColorSamplerRunner"] = extension.CanvasColorSamplerRunner;
extension.CanvasColorSamplerRunner.__name__ = ["extension","CanvasColorSamplerRunner"];
extension.CanvasColorSamplerRunner.prototype = {
	run: function() {
		this.mainFunction();
	}
	,call: function(clickedPaletteKind) {
		var _g = this;
		this.clickedPaletteKind = clickedPaletteKind;
		this.overlayWindow.showCanvasColorSamplerRunning();
		this.jsxEvent = common.JsxEvent.NONE;
		this.csInterface.evalScript("var " + "canvasColorSampler" + " = new " + "CanvasColorSampler" + "();");
		this.csInterface.evalScript("" + "canvasColorSampler" + ".getInitialErrorEvent();",function(result) {
			_g.jsxEvent = common.JsxEvent.GOTTEN(result);
		});
		this.mainFunction = $bind(this,this.observeToRecieveInitialErrorEvent);
	}
	,observeToRecieveInitialErrorEvent: function() {
		{
			var _g = this.recieveJsxEvent();
			switch(_g[1]) {
			case 0:
				return;
			case 1:
				var serializedEvent = _g[2];
				var initialErrorEvent = haxe.Unserializer.run(serializedEvent);
				switch(initialErrorEvent[1]) {
				case 1:
					var message = initialErrorEvent[2];
					js.Lib.alert(message);
					this.destroy();
					break;
				case 0:
					this.initializeToSample();
					break;
				}
				break;
			}
		}
	}
	,initializeToSample: function() {
		this.csInterface.evalScript("" + "canvasColorSampler" + ".initialize();");
		this.mainFunction = $bind(this,this.sample);
	}
	,sample: function() {
		var _g = this;
		if(this.overlayWindow.cancelButton.isClicked()) {
			this.csInterface.evalScript("" + "canvasColorSampler" + ".interrupt();");
			this.destroy();
		} else {
			this.jsxEvent = common.JsxEvent.NONE;
			this.csInterface.evalScript("" + "canvasColorSampler" + ".run();");
			this.csInterface.evalScript("" + "canvasColorSampler" + ".getSerializedEvent();",function(result) {
				_g.jsxEvent = common.JsxEvent.GOTTEN(result);
			});
			this.mainFunction = $bind(this,this.observeToSample);
		}
	}
	,observeToSample: function() {
		{
			var _g = this.recieveJsxEvent();
			switch(_g[1]) {
			case 0:
				return;
			case 1:
				var serializedEvent = _g[2];
				var canvasColorSamplerEvent = haxe.Unserializer.run(serializedEvent);
				switch(canvasColorSamplerEvent[1]) {
				case 0:
					this.mainFunction = $bind(this,this.sample);
					break;
				case 1:
					var pixelColorSet = canvasColorSamplerEvent[2];
					var _g1 = this.clickedPaletteKind;
					switch(_g1[1]) {
					case 0:
						this.canvasColorSamplerUI.paletteContainer.before.palette.addColorSet(pixelColorSet);
						break;
					case 1:
						this.canvasColorSamplerUI.paletteContainer.after.palette.addColorSet(pixelColorSet);
						break;
					}
					this.canvasColorSamplerUI.updatePageIndex();
					this.destroy();
					break;
				}
				break;
			}
		}
	}
	,recieveJsxEvent: function() {
		var n = this.jsxEvent;
		this.jsxEvent = common.JsxEvent.NONE;
		return n;
	}
	,destroy: function() {
		this.overlayWindow.hide();
		this.mainFunction = $bind(this,this.finish);
	}
	,finish: function() {
	}
	,isFinished: function() {
		return Reflect.compareMethods(this.mainFunction,$bind(this,this.finish));
	}
	,__class__: extension.CanvasColorSamplerRunner
};
extension.JsxLoader = function() {
	this.csInterface = extension.AbstractCSInterface.create();
	this.loadIndex = 0;
	this.load();
};
$hxClasses["extension.JsxLoader"] = extension.JsxLoader;
extension.JsxLoader.__name__ = ["extension","JsxLoader"];
extension.JsxLoader.prototype = {
	getJsxPath: function(fileName) {
		return this.csInterface.getExtensionSystemPath() + "/jsx/" + fileName + ".jsx";
	}
	,run: function() {
		this.mainFunction();
	}
	,load: function() {
		var _g = this;
		var fileName = extension.JsxLoader.LOAD_JSX_SET[this.loadIndex];
		var filePath = this.csInterface.getExtensionSystemPath() + "/jsx/" + fileName + ".jsx";
		this.loaded = false;
		this.csInterface.evalFile(filePath,function(result) {
			_g.loaded = true;
		});
		this.mainFunction = $bind(this,this.observeToLoad);
	}
	,observeToLoad: function() {
		if(!this.loaded) return;
		if(++this.loadIndex < extension.JsxLoader.LOAD_JSX_SET.length) this.load(); else this.mainFunction = $bind(this,this.finish);
	}
	,finish: function() {
	}
	,isFinished: function() {
		return Reflect.compareMethods(this.mainFunction,$bind(this,this.finish));
	}
	,__class__: extension.JsxLoader
};
extension.PaletteChangeRunner = function() {
	this.csInterface = extension.AbstractCSInterface.create();
	if(extension.palette_change.PaletteChangeUI.instance == null) this.paletteChangeUI = extension.palette_change.PaletteChangeUI.instance = new extension.palette_change.PaletteChangeUI(); else this.paletteChangeUI = extension.palette_change.PaletteChangeUI.instance;
	if(extension.overlay.OverlayWindow.instance == null) this.overlayWindow = extension.overlay.OverlayWindow.instance = new extension.overlay.OverlayWindow(); else this.overlayWindow = extension.overlay.OverlayWindow.instance;
};
$hxClasses["extension.PaletteChangeRunner"] = extension.PaletteChangeRunner;
extension.PaletteChangeRunner.__name__ = ["extension","PaletteChangeRunner"];
extension.PaletteChangeRunner.prototype = {
	run: function() {
		this.mainFunction();
	}
	,call: function(rgbHexValueSets) {
		var _g = this;
		this.rgbHexValueSets = rgbHexValueSets;
		this.overlayWindow.showPaletteChangeRunning();
		this.jsxEvent = common.JsxEvent.NONE;
		this.csInterface.evalScript("var " + "paletteChange" + " = new " + "PaletteChange" + "();");
		this.csInterface.evalScript("" + "paletteChange" + ".getInitialErrorEvent();",function(result) {
			_g.jsxEvent = common.JsxEvent.GOTTEN(result);
		});
		this.mainFunction = $bind(this,this.observeToRecieveInitialErrorEvent);
	}
	,observeToRecieveInitialErrorEvent: function() {
		{
			var _g = this.recieveJsxEvent();
			switch(_g[1]) {
			case 0:
				return;
			case 1:
				var serializedEvent = _g[2];
				var initialErrorEvent = haxe.Unserializer.run(serializedEvent);
				switch(initialErrorEvent[1]) {
				case 1:
					var message = initialErrorEvent[2];
					js.Lib.alert(message);
					this.destroy();
					break;
				case 0:
					this.initializeToChangePalette();
					break;
				}
				break;
			}
		}
	}
	,initializeToChangePalette: function() {
		var data = haxe.Serializer.run(this.rgbHexValueSets);
		this.csInterface.evalScript("" + "paletteChange" + ".execute(\"" + data + "\", " + Std.string((extension.option.Setting.instance == null?extension.option.Setting.instance = new extension.option.Setting():extension.option.Setting.instance).isIgnoredLockedLayerPaint()) + ");");
		this.mainFunction = $bind(this,this.changePalette);
	}
	,changePalette: function() {
		var _g = this;
		if(this.overlayWindow.cancelButton.isClicked()) {
			this.csInterface.evalScript("" + "paletteChange" + ".interrupt();");
			this.destroy();
		} else {
			this.jsxEvent = common.JsxEvent.NONE;
			this.csInterface.evalScript("" + "paletteChange" + ".run();");
			this.csInterface.evalScript("" + "paletteChange" + ".getSerializedEvent();",function(result) {
				_g.jsxEvent = common.JsxEvent.GOTTEN(result);
			});
			this.mainFunction = $bind(this,this.observeToChangePalette);
		}
	}
	,observeToChangePalette: function() {
		{
			var _g = this.recieveJsxEvent();
			switch(_g[1]) {
			case 0:
				return;
			case 1:
				var serializedEvent = _g[2];
				var event = haxe.Unserializer.run(serializedEvent);
				switch(event[1]) {
				case 0:
					this.mainFunction = $bind(this,this.changePalette);
					break;
				case 1:
					this.destroy();
					break;
				}
				break;
			}
		}
	}
	,recieveJsxEvent: function() {
		var n = this.jsxEvent;
		this.jsxEvent = common.JsxEvent.NONE;
		return n;
	}
	,destroy: function() {
		this.overlayWindow.hide();
		this.mainFunction = $bind(this,this.finish);
	}
	,finish: function() {
	}
	,isFinished: function() {
		return Reflect.compareMethods(this.mainFunction,$bind(this,this.finish));
	}
	,__class__: extension.PaletteChangeRunner
};
extension.Panel = function() {
	window.addEventListener("load",$bind(this,this.initialize));
};
$hxClasses["extension.Panel"] = extension.Panel;
extension.Panel.__name__ = ["extension","Panel"];
extension.Panel.main = function() {
	new extension.Panel();
};
extension.Panel.prototype = {
	initialize: function(event) {
		this.csInterface = extension.AbstractCSInterface.create();
		this.setPersistent();
		this.jsxLoader = new extension.JsxLoader();
		if(extension.color_sampler.CanvasColorSamplerUI.instance == null) this.canvasColorSamplerUI = extension.color_sampler.CanvasColorSamplerUI.instance = new extension.color_sampler.CanvasColorSamplerUI(); else this.canvasColorSamplerUI = extension.color_sampler.CanvasColorSamplerUI.instance;
		if(extension.palette_change.PaletteChangeUI.instance == null) this.paletteChangeUI = extension.palette_change.PaletteChangeUI.instance = new extension.palette_change.PaletteChangeUI(); else this.paletteChangeUI = extension.palette_change.PaletteChangeUI.instance;
		if(extension.option.Setting.instance == null) extension.option.Setting.instance = new extension.option.Setting(); else extension.option.Setting.instance;
		if(extension.overlay.OverlayWindow.instance == null) extension.overlay.OverlayWindow.instance = new extension.overlay.OverlayWindow(); else extension.overlay.OverlayWindow.instance;
		this.canvasColorSamplerRunner = new extension.CanvasColorSamplerRunner();
		this.paletteChangeRunner = new extension.PaletteChangeRunner();
		this.colorPickerUI = new extension.color_picker.ColorPickerUI();
		this.startRunning($bind(this,this.loadJsx),50);
	}
	,setPersistent: function() {
		var csEvent = new CSEvent();
		csEvent.type = "com.adobe.PhotoshopPersistent";
		csEvent.scope = "APPLICATION";
		csEvent.extensionId = window.__adobe_cep__.getExtensionId();
		this.csInterface.csInterface.dispatchEvent(csEvent);
	}
	,startRunning: function(func,speed) {
		this.mainFunction = func;
		this.setTimer(speed);
	}
	,changeRunning: function(func,speed) {
		this.timer.stop();
		this.startRunning(func,speed);
	}
	,setTimer: function(speed) {
		this.timer = new haxe.Timer(speed);
		this.timer.run = $bind(this,this.run);
	}
	,run: function() {
		this.mainFunction();
	}
	,loadJsx: function() {
		this.jsxLoader.run();
		if(this.jsxLoader.isFinished()) this.initializeToClickUI();
	}
	,initializeToClickUI: function() {
		this.changeRunning($bind(this,this.observeToClickUI),250);
	}
	,observeToClickUI: function() {
		this.canvasColorSamplerUI.run();
		if(this.canvasColorSamplerUI.paletteContainer.before.scanButton.isClicked()) this.initializeToCallCanvasColorSampler(extension.color_sampler.palette.PaletteKind.BEFORE); else if(this.canvasColorSamplerUI.paletteContainer.after.scanButton.isClicked()) this.initializeToCallCanvasColorSampler(extension.color_sampler.palette.PaletteKind.AFTER); else if(this.paletteChangeUI.runButton.isClicked()) this.initializeToCallPaletteChange(); else if(this.canvasColorSamplerUI.paletteContainer.before.palette.searchClickedCell()) this.initializeToCallColorPicker(extension.color_sampler.palette.PaletteKind.BEFORE,this.canvasColorSamplerUI.paletteContainer.before.palette.clickedCell.pixelColor); else if(this.canvasColorSamplerUI.paletteContainer.after.palette.searchClickedCell()) this.initializeToCallColorPicker(extension.color_sampler.palette.PaletteKind.AFTER,this.canvasColorSamplerUI.paletteContainer.after.palette.clickedCell.pixelColor);
	}
	,initializeToCallColorPicker: function(paletteKind,pixelColor) {
		this.colorPickerUI.show(paletteKind,pixelColor);
		this.changeRunning($bind(this,this.callColorPicker),50);
	}
	,callColorPicker: function() {
		this.colorPickerUI.run();
		var event = this.colorPickerUI.getEvent();
		switch(event[1]) {
		case 0:
			return;
		case 1:
			this.initializeToClickUI();
			break;
		case 2:
			this.initializeToClickUI();
			break;
		}
	}
	,initializeToCallCanvasColorSampler: function(paletteKind) {
		this.canvasColorSamplerRunner.call(paletteKind);
		this.changeRunning($bind(this,this.callCanvasColorSampler),50);
	}
	,callCanvasColorSampler: function() {
		this.canvasColorSamplerRunner.run();
		if(this.canvasColorSamplerRunner.isFinished()) this.initializeToClickUI();
	}
	,initializeToCallPaletteChange: function() {
		var rgbHexValueSets = this.canvasColorSamplerUI.paletteContainer.getRgbHexValueSets();
		this.paletteChangeRunner.call(rgbHexValueSets);
		this.changeRunning($bind(this,this.callPaletteChange),50);
	}
	,callPaletteChange: function() {
		this.paletteChangeRunner.run();
		if(this.paletteChangeRunner.isFinished()) this.initializeToClickUI();
	}
	,__class__: extension.Panel
};
extension.color_picker = {};
extension.color_picker.ColorPickerDialogEvent = $hxClasses["extension.color_picker.ColorPickerDialogEvent"] = { __ename__ : ["extension","color_picker","ColorPickerDialogEvent"], __constructs__ : ["NONE","CANCELLED","GOTTEN"] };
extension.color_picker.ColorPickerDialogEvent.NONE = ["NONE",0];
extension.color_picker.ColorPickerDialogEvent.NONE.__enum__ = extension.color_picker.ColorPickerDialogEvent;
extension.color_picker.ColorPickerDialogEvent.CANCELLED = ["CANCELLED",1];
extension.color_picker.ColorPickerDialogEvent.CANCELLED.__enum__ = extension.color_picker.ColorPickerDialogEvent;
extension.color_picker.ColorPickerDialogEvent.GOTTEN = function(rgbHexValue) { var $x = ["GOTTEN",2,rgbHexValue]; $x.__enum__ = extension.color_picker.ColorPickerDialogEvent; return $x; };
extension.color_picker.ColorPickerDialog = function() {
	this.csInterface = extension.AbstractCSInterface.create();
};
$hxClasses["extension.color_picker.ColorPickerDialog"] = extension.color_picker.ColorPickerDialog;
extension.color_picker.ColorPickerDialog.__name__ = ["extension","color_picker","ColorPickerDialog"];
extension.color_picker.ColorPickerDialog.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = extension.color_picker.ColorPickerDialogEvent.NONE;
		return n;
	}
	,show: function() {
		var _g = this;
		this.event = extension.color_picker.ColorPickerDialogEvent.NONE;
		this.csInterface.showColorPicker(true,function(bool) {
			if(bool == "false") _g.event = extension.color_picker.ColorPickerDialogEvent.CANCELLED; else _g.observeGettingColor();
		});
	}
	,observeGettingColor: function() {
		var _g = this;
		this.csInterface.evalScript("app.foregroundColor.rgb.hexValue;",function(data) {
			_g.event = extension.color_picker.ColorPickerDialogEvent.GOTTEN(data);
		});
	}
	,__class__: extension.color_picker.ColorPickerDialog
};
extension.color_picker.ColorPickerUIEvent = $hxClasses["extension.color_picker.ColorPickerUIEvent"] = { __ename__ : ["extension","color_picker","ColorPickerUIEvent"], __constructs__ : ["NONE","DIALOG_CANCELLED_STILL_TRANSPARENT","CLOSED"] };
extension.color_picker.ColorPickerUIEvent.NONE = ["NONE",0];
extension.color_picker.ColorPickerUIEvent.NONE.__enum__ = extension.color_picker.ColorPickerUIEvent;
extension.color_picker.ColorPickerUIEvent.DIALOG_CANCELLED_STILL_TRANSPARENT = ["DIALOG_CANCELLED_STILL_TRANSPARENT",1];
extension.color_picker.ColorPickerUIEvent.DIALOG_CANCELLED_STILL_TRANSPARENT.__enum__ = extension.color_picker.ColorPickerUIEvent;
extension.color_picker.ColorPickerUIEvent.CLOSED = ["CLOSED",2];
extension.color_picker.ColorPickerUIEvent.CLOSED.__enum__ = extension.color_picker.ColorPickerUIEvent;
extension.color_picker.ColorPickerUI = function() {
	this.csInterface = extension.AbstractCSInterface.create();
	if(extension.color_sampler.CanvasColorSamplerUI.instance == null) this.canvasColorSamplerUI = extension.color_sampler.CanvasColorSamplerUI.instance = new extension.color_sampler.CanvasColorSamplerUI(); else this.canvasColorSamplerUI = extension.color_sampler.CanvasColorSamplerUI.instance;
	this.dialog = new extension.color_picker.ColorPickerDialog();
	this.pixelSelectorRunner = new extension.color_picker.PixelSelectorRunner();
	this.pixelColorSearchRunner = new extension.color_picker.PixelColorSearchRunner();
	this.element = new $("#color_picker");
	this.displayElement = new $(".display",this.element);
	this.editColorButton = new extension.parts.Button(this.element,"edit_button");
	this.selectCanvasButton = new extension.parts.Button(this.element,"select_button");
	this.closeButton = new extension.parts.Button(this.element,"close_button");
};
$hxClasses["extension.color_picker.ColorPickerUI"] = extension.color_picker.ColorPickerUI;
extension.color_picker.ColorPickerUI.__name__ = ["extension","color_picker","ColorPickerUI"];
extension.color_picker.ColorPickerUI.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = extension.color_picker.ColorPickerUIEvent.NONE;
		return n;
	}
	,run: function() {
		this.mainFunction();
	}
	,show: function(paletteKind,pixelColor) {
		this.paletteKind = paletteKind;
		this.pixelColor = pixelColor;
		this.element.css("display","block");
		this.event = extension.color_picker.ColorPickerUIEvent.NONE;
		if(pixelColor != null) {
			this.csInterface.evalScript("app.foregroundColor.rgb.hexValue = \"" + pixelColor.rgbHexValue + "\";");
			this.displayElement.css("background-color","#" + pixelColor.rgbHexValue);
			if(!pixelColor.isNotSetPosition()) this.initializeToPixelSelector(); else this.initializeToObserveToClickUI();
		} else {
			this.displayElement.css("background-color","transparent");
			this.showDialog();
		}
	}
	,initializeToPixelSelector: function() {
		this.pixelSelectorRunner.call(this.pixelColor);
		this.mainFunction = $bind(this,this.selectPixel);
	}
	,selectPixel: function() {
		this.pixelSelectorRunner.run();
		var event = this.pixelSelectorRunner.getEvent();
		switch(event[1]) {
		case 0:
			return;
		case 2:
			this.initializeToObserveToClickUI();
			break;
		case 3:
			this.initializeToObserveToClickUI();
			break;
		case 1:
			var message = event[2];
			this.initializeToObserveToClickUI();
			break;
		case 4:
			var pixelSelectorEvent = event[2];
			this.initializeToObserveToClickUI();
			break;
		}
	}
	,initializeToObserveToClickUI: function() {
		this.mainFunction = $bind(this,this.observeToClickUI);
	}
	,observeToClickUI: function() {
		if(this.editColorButton.isClicked()) this.showDialog(); else if(this.selectCanvasButton.isClicked()) this.searchPixelColor(); else if(this.closeButton.isClicked()) this.destroy(extension.color_picker.ColorPickerUIEvent.CLOSED);
	}
	,searchPixelColor: function() {
		this.pixelColorSearchRunner.call(this.pixelColor.rgbHexValue);
		this.mainFunction = $bind(this,this.observeToSearchPixelColor);
	}
	,observeToSearchPixelColor: function() {
		this.pixelColorSearchRunner.run();
		var event = this.pixelColorSearchRunner.getEvent();
		switch(event[1]) {
		case 0:
			return;
		case 1:
			var message = event[2];
			js.Lib.alert(message);
			this.initializeToObserveToClickUI();
			break;
		case 2:case 3:
			this.initializeToObserveToClickUI();
			break;
		case 4:
			var pixelColor = event[2];
			this.pixelColor = pixelColor;
			this.canvasColorSamplerUI.updateClickedCellScanPosition(this.paletteKind,pixelColor.x,pixelColor.y);
			this.initializeToObserveToClickUI();
			break;
		}
	}
	,showDialog: function() {
		this.dialog.show();
		this.mainFunction = $bind(this,this.observeDialog);
	}
	,observeDialog: function() {
		var event = this.dialog.getEvent();
		switch(event[1]) {
		case 0:
			return;
		case 1:
			if(this.pixelColor == null) this.destroy(extension.color_picker.ColorPickerUIEvent.DIALOG_CANCELLED_STILL_TRANSPARENT); else this.initializeToObserveToClickUI();
			break;
		case 2:
			var rgbHexValue = event[2];
			if(this.canvasColorSamplerUI.isUnregisterableColor(this.paletteKind,rgbHexValue)) {
				js.Lib.alert("The color overlaps.");
				this.destroy(extension.color_picker.ColorPickerUIEvent.DIALOG_CANCELLED_STILL_TRANSPARENT);
			} else {
				this.displayElement.css("background-color","#" + rgbHexValue);
				this.pixelColor = common.PixelColor.createWithoutPosition(rgbHexValue);
				this.canvasColorSamplerUI.changeClickedCellColor(this.paletteKind,this.pixelColor);
				this.initializeToObserveToClickUI();
			}
			break;
		}
	}
	,destroy: function(event) {
		this.element.css("display","none");
		this.event = event;
		this.mainFunction = $bind(this,this.finish);
	}
	,finish: function() {
	}
	,__class__: extension.color_picker.ColorPickerUI
};
extension.color_picker.PixelColorSearchRunnerEvent = $hxClasses["extension.color_picker.PixelColorSearchRunnerEvent"] = { __ename__ : ["extension","color_picker","PixelColorSearchRunnerEvent"], __constructs__ : ["NONE","ERROR","CANCEL","UNSELECTED","SELECTED"] };
extension.color_picker.PixelColorSearchRunnerEvent.NONE = ["NONE",0];
extension.color_picker.PixelColorSearchRunnerEvent.NONE.__enum__ = extension.color_picker.PixelColorSearchRunnerEvent;
extension.color_picker.PixelColorSearchRunnerEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = extension.color_picker.PixelColorSearchRunnerEvent; return $x; };
extension.color_picker.PixelColorSearchRunnerEvent.CANCEL = ["CANCEL",2];
extension.color_picker.PixelColorSearchRunnerEvent.CANCEL.__enum__ = extension.color_picker.PixelColorSearchRunnerEvent;
extension.color_picker.PixelColorSearchRunnerEvent.UNSELECTED = ["UNSELECTED",3];
extension.color_picker.PixelColorSearchRunnerEvent.UNSELECTED.__enum__ = extension.color_picker.PixelColorSearchRunnerEvent;
extension.color_picker.PixelColorSearchRunnerEvent.SELECTED = function(pixelColor) { var $x = ["SELECTED",4,pixelColor]; $x.__enum__ = extension.color_picker.PixelColorSearchRunnerEvent; return $x; };
extension.color_picker.PixelColorSearchRunner = function() {
	this.csInterface = extension.AbstractCSInterface.create();
	if(extension.overlay.OverlayWindow.instance == null) this.overlayWindow = extension.overlay.OverlayWindow.instance = new extension.overlay.OverlayWindow(); else this.overlayWindow = extension.overlay.OverlayWindow.instance;
};
$hxClasses["extension.color_picker.PixelColorSearchRunner"] = extension.color_picker.PixelColorSearchRunner;
extension.color_picker.PixelColorSearchRunner.__name__ = ["extension","color_picker","PixelColorSearchRunner"];
extension.color_picker.PixelColorSearchRunner.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = extension.color_picker.PixelColorSearchRunnerEvent.NONE;
		return n;
	}
	,run: function() {
		this.mainFunction();
	}
	,call: function(searchedRgbHexValue) {
		var _g = this;
		this.searchedRgbHexValue = searchedRgbHexValue;
		this.overlayWindow.showCanvasColorSamplerRunning();
		this.jsxEvent = common.JsxEvent.NONE;
		this.csInterface.evalScript("var " + "pixelColorSearch" + " = new " + "PixelColorSearch" + "();");
		this.csInterface.evalScript("" + "pixelColorSearch" + ".getInitialErrorEvent();",function(result) {
			_g.jsxEvent = common.JsxEvent.GOTTEN(result);
		});
		this.mainFunction = $bind(this,this.observeToRecieveInitialErrorEvent);
	}
	,observeToRecieveInitialErrorEvent: function() {
		{
			var _g = this.recieveJsxEvent();
			switch(_g[1]) {
			case 0:
				return;
			case 1:
				var serializedEvent = _g[2];
				var initialErrorEvent = haxe.Unserializer.run(serializedEvent);
				switch(initialErrorEvent[1]) {
				case 1:
					var message = initialErrorEvent[2];
					this.destroy(extension.color_picker.PixelColorSearchRunnerEvent.ERROR(message));
					break;
				case 0:
					this.initializeToSearch();
					break;
				}
				break;
			}
		}
	}
	,initializeToSearch: function() {
		this.event = extension.color_picker.PixelColorSearchRunnerEvent.NONE;
		this.csInterface.evalScript("" + "pixelColorSearch" + ".initialize(\"" + this.searchedRgbHexValue + "\");");
		this.mainFunction = $bind(this,this.search);
	}
	,search: function() {
		var _g = this;
		if(this.overlayWindow.cancelButton.isClicked()) {
			this.csInterface.evalScript("" + "pixelColorSearch" + ".interrupt();");
			this.destroy(extension.color_picker.PixelColorSearchRunnerEvent.CANCEL);
		} else {
			this.jsxEvent = common.JsxEvent.NONE;
			this.csInterface.evalScript("" + "pixelColorSearch" + ".run();");
			this.csInterface.evalScript("" + "pixelColorSearch" + ".getSerializedEvent();",function(result) {
				_g.jsxEvent = common.JsxEvent.GOTTEN(result);
			});
			this.mainFunction = $bind(this,this.observeToSearch);
		}
	}
	,observeToSearch: function() {
		{
			var _g = this.recieveJsxEvent();
			switch(_g[1]) {
			case 0:
				return;
			case 1:
				var serializedEvent = _g[2];
				var pixelColorSearchEvent = haxe.Unserializer.run(serializedEvent);
				switch(pixelColorSearchEvent[1]) {
				case 0:
					this.mainFunction = $bind(this,this.search);
					break;
				case 2:
					this.destroy(extension.color_picker.PixelColorSearchRunnerEvent.UNSELECTED);
					break;
				case 1:
					var y = pixelColorSearchEvent[3];
					var x = pixelColorSearchEvent[2];
					var pixelColor = common.PixelColor.create(this.searchedRgbHexValue,x,y);
					this.destroy(extension.color_picker.PixelColorSearchRunnerEvent.SELECTED(pixelColor));
					break;
				}
				break;
			}
		}
	}
	,recieveJsxEvent: function() {
		var n = this.jsxEvent;
		this.jsxEvent = common.JsxEvent.NONE;
		return n;
	}
	,destroy: function(event) {
		this.event = event;
		this.overlayWindow.hide();
		this.mainFunction = $bind(this,this.finish);
	}
	,finish: function() {
	}
	,__class__: extension.color_picker.PixelColorSearchRunner
};
extension.color_picker.PixelSelectorRunnerEvent = $hxClasses["extension.color_picker.PixelSelectorRunnerEvent"] = { __ename__ : ["extension","color_picker","PixelSelectorRunnerEvent"], __constructs__ : ["NONE","ERROR","UNSELECTED_ANY_LAYER","SELECTED_LAYER_SET","FINISH"] };
extension.color_picker.PixelSelectorRunnerEvent.NONE = ["NONE",0];
extension.color_picker.PixelSelectorRunnerEvent.NONE.__enum__ = extension.color_picker.PixelSelectorRunnerEvent;
extension.color_picker.PixelSelectorRunnerEvent.ERROR = function(message) { var $x = ["ERROR",1,message]; $x.__enum__ = extension.color_picker.PixelSelectorRunnerEvent; return $x; };
extension.color_picker.PixelSelectorRunnerEvent.UNSELECTED_ANY_LAYER = ["UNSELECTED_ANY_LAYER",2];
extension.color_picker.PixelSelectorRunnerEvent.UNSELECTED_ANY_LAYER.__enum__ = extension.color_picker.PixelSelectorRunnerEvent;
extension.color_picker.PixelSelectorRunnerEvent.SELECTED_LAYER_SET = ["SELECTED_LAYER_SET",3];
extension.color_picker.PixelSelectorRunnerEvent.SELECTED_LAYER_SET.__enum__ = extension.color_picker.PixelSelectorRunnerEvent;
extension.color_picker.PixelSelectorRunnerEvent.FINISH = function(pixelSelectorEvent) { var $x = ["FINISH",4,pixelSelectorEvent]; $x.__enum__ = extension.color_picker.PixelSelectorRunnerEvent; return $x; };
extension.color_picker.PixelSelectorRunner = function() {
	this.csInterface = extension.AbstractCSInterface.create();
};
$hxClasses["extension.color_picker.PixelSelectorRunner"] = extension.color_picker.PixelSelectorRunner;
extension.color_picker.PixelSelectorRunner.__name__ = ["extension","color_picker","PixelSelectorRunner"];
extension.color_picker.PixelSelectorRunner.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = extension.color_picker.PixelSelectorRunnerEvent.NONE;
		return n;
	}
	,run: function() {
		this.mainFunction();
	}
	,call: function(selectedPixelColor) {
		var _g = this;
		this.selectedPixelColor = selectedPixelColor;
		this.jsxEvent = common.JsxEvent.NONE;
		this.csInterface.evalScript("var " + "pixelSelector" + " = new " + "PixelSelector" + "();");
		this.csInterface.evalScript("" + "pixelSelector" + ".getInitialErrorEvent();",function(result) {
			_g.jsxEvent = common.JsxEvent.GOTTEN(result);
		});
		this.mainFunction = $bind(this,this.observeToRecieveInitialErrorEvent);
	}
	,observeToRecieveInitialErrorEvent: function() {
		{
			var _g = this.recieveJsxEvent();
			switch(_g[1]) {
			case 0:
				return;
			case 1:
				var serializedEvent = _g[2];
				var initialErrorEvent = haxe.Unserializer.run(serializedEvent);
				switch(initialErrorEvent[1]) {
				case 3:
					var message = initialErrorEvent[2];
					this.destroy(extension.color_picker.PixelSelectorRunnerEvent.ERROR(message));
					break;
				case 2:
					this.destroy(extension.color_picker.PixelSelectorRunnerEvent.SELECTED_LAYER_SET);
					break;
				case 1:
					this.destroy(extension.color_picker.PixelSelectorRunnerEvent.UNSELECTED_ANY_LAYER);
					break;
				case 0:
					this.select();
					break;
				}
				break;
			}
		}
	}
	,select: function() {
		var _g = this;
		var serializedPixelColor = haxe.Serializer.run(this.selectedPixelColor);
		this.jsxEvent = common.JsxEvent.NONE;
		this.event = extension.color_picker.PixelSelectorRunnerEvent.NONE;
		this.csInterface.evalScript("" + "pixelSelector" + ".execute(\"" + serializedPixelColor + "\");",function(result) {
			_g.jsxEvent = common.JsxEvent.GOTTEN(result);
		});
		this.mainFunction = $bind(this,this.observeToSelect);
	}
	,observeToSelect: function() {
		{
			var _g = this.recieveJsxEvent();
			switch(_g[1]) {
			case 0:
				return;
			case 1:
				var serializedEvent = _g[2];
				var pixelSelectorEvent = haxe.Unserializer.run(serializedEvent);
				this.destroy(extension.color_picker.PixelSelectorRunnerEvent.FINISH(pixelSelectorEvent));
				break;
			}
		}
	}
	,recieveJsxEvent: function() {
		var n = this.jsxEvent;
		this.jsxEvent = common.JsxEvent.NONE;
		return n;
	}
	,destroy: function(event) {
		this.event = event;
		this.mainFunction = $bind(this,this.finish);
	}
	,finish: function() {
	}
	,__class__: extension.color_picker.PixelSelectorRunner
};
extension.color_sampler = {};
extension.color_sampler.CanvasColorSamplerUI = function() {
	this.element = new $("#canvas_color_sampler");
	this.paletteContainer = new extension.color_sampler.PaletteContainer(this.element);
	if(extension.color_sampler.PageUI.instance == null) this.pageUI = extension.color_sampler.PageUI.instance = new extension.color_sampler.PageUI(); else this.pageUI = extension.color_sampler.PageUI.instance;
	new extension.parts.TitleBar("title_canvas_color_sampler",this.element);
};
$hxClasses["extension.color_sampler.CanvasColorSamplerUI"] = extension.color_sampler.CanvasColorSamplerUI;
extension.color_sampler.CanvasColorSamplerUI.__name__ = ["extension","color_sampler","CanvasColorSamplerUI"];
extension.color_sampler.CanvasColorSamplerUI.get_instance = function() {
	if(extension.color_sampler.CanvasColorSamplerUI.instance == null) return extension.color_sampler.CanvasColorSamplerUI.instance = new extension.color_sampler.CanvasColorSamplerUI(); else return extension.color_sampler.CanvasColorSamplerUI.instance;
};
extension.color_sampler.CanvasColorSamplerUI.prototype = {
	run: function() {
		this.ovservePageUI();
		this.ovserveClearButton();
	}
	,ovservePageUI: function() {
		this.pageUI.run();
		var pageUIEvent = this.pageUI.getEvent();
		switch(pageUIEvent[1]) {
		case 0:
			return;
		case 2:case 1:
			this.paletteContainer.changePage();
			break;
		}
	}
	,ovserveClearButton: function() {
		if(this.paletteContainer.before.clearButton.isClicked()) {
			this.paletteContainer.before.palette.clear();
			this.updatePageIndex();
		} else if(this.paletteContainer.after.clearButton.isClicked()) {
			this.paletteContainer.after.palette.clear();
			this.updatePageIndex();
		}
	}
	,updatePageIndex: function() {
		var changedEvent = this.pageUI.changeMaximumIndex(this.paletteContainer.getPageMaximumIndex());
		switch(changedEvent[1]) {
		case 2:
			this.paletteContainer.changePage();
			break;
		case 1:case 0:
			return;
		}
	}
	,isUnregisterableColor: function(paletteKind,rgbHexValue) {
		var palette = this.getPalette(paletteKind);
		return palette.isUnregisterableColor(rgbHexValue);
	}
	,changeClickedCellColor: function(paletteKind,pixelColor) {
		var palette = this.getPalette(paletteKind);
		palette.changeClickedCellColor(pixelColor);
		this.updatePageIndex();
	}
	,updateClickedCellScanPosition: function(paletteKind,x,y) {
		var palette = this.getPalette(paletteKind);
		palette.updateClickedCellScanPosition(x,y);
	}
	,getPalette: function(paletteKind) {
		switch(paletteKind[1]) {
		case 0:
			return this.paletteContainer.before.palette;
		case 1:
			return this.paletteContainer.after.palette;
		}
	}
	,__class__: extension.color_sampler.CanvasColorSamplerUI
};
extension.color_sampler.PageUIEvent = $hxClasses["extension.color_sampler.PageUIEvent"] = { __ename__ : ["extension","color_sampler","PageUIEvent"], __constructs__ : ["NONE","SELECTED_NEXT","SELECTED_PREV"] };
extension.color_sampler.PageUIEvent.NONE = ["NONE",0];
extension.color_sampler.PageUIEvent.NONE.__enum__ = extension.color_sampler.PageUIEvent;
extension.color_sampler.PageUIEvent.SELECTED_NEXT = ["SELECTED_NEXT",1];
extension.color_sampler.PageUIEvent.SELECTED_NEXT.__enum__ = extension.color_sampler.PageUIEvent;
extension.color_sampler.PageUIEvent.SELECTED_PREV = ["SELECTED_PREV",2];
extension.color_sampler.PageUIEvent.SELECTED_PREV.__enum__ = extension.color_sampler.PageUIEvent;
extension.color_sampler.PageMaximumChangeEvent = $hxClasses["extension.color_sampler.PageMaximumChangeEvent"] = { __ename__ : ["extension","color_sampler","PageMaximumChangeEvent"], __constructs__ : ["NONE","UP","DOWN"] };
extension.color_sampler.PageMaximumChangeEvent.NONE = ["NONE",0];
extension.color_sampler.PageMaximumChangeEvent.NONE.__enum__ = extension.color_sampler.PageMaximumChangeEvent;
extension.color_sampler.PageMaximumChangeEvent.UP = ["UP",1];
extension.color_sampler.PageMaximumChangeEvent.UP.__enum__ = extension.color_sampler.PageMaximumChangeEvent;
extension.color_sampler.PageMaximumChangeEvent.DOWN = ["DOWN",2];
extension.color_sampler.PageMaximumChangeEvent.DOWN.__enum__ = extension.color_sampler.PageMaximumChangeEvent;
extension.color_sampler.PageUI = function() {
	this.element = new $("#page_ui");
	this.prevButton = this.setButton("prev");
	this.nextButton = this.setButton("next");
	this.pageNumber = new extension.color_sampler.PageNumber(this.element);
	this.event = extension.color_sampler.PageUIEvent.NONE;
};
$hxClasses["extension.color_sampler.PageUI"] = extension.color_sampler.PageUI;
extension.color_sampler.PageUI.__name__ = ["extension","color_sampler","PageUI"];
extension.color_sampler.PageUI.get_instance = function() {
	if(extension.color_sampler.PageUI.instance == null) return extension.color_sampler.PageUI.instance = new extension.color_sampler.PageUI(); else return extension.color_sampler.PageUI.instance;
};
extension.color_sampler.PageUI.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = extension.color_sampler.PageUIEvent.NONE;
		return n;
	}
	,setButton: function(className) {
		var button = new extension.color_sampler.PageButton(this.element,className);
		button.initialize();
		return button;
	}
	,changeMaximumIndex: function(maximumIndex) {
		var beforeMaximumIndex = this.pageNumber.maximumIndex;
		var wasMaximum = this.pageNumber.isMaximum();
		var wasMinimum = this.pageNumber.isMinimum();
		this.pageNumber.setMaximumIndex(maximumIndex);
		if(beforeMaximumIndex < maximumIndex && this.nextButton.isDisabled()) this.nextButton.removeDisabled(); else if(beforeMaximumIndex > maximumIndex) this.pageNumber.setIndex(maximumIndex);
		if(this.pageNumber.isMaximum()) this.nextButton.disable();
		if(this.pageNumber.isMinimum()) this.prevButton.disable();
		this.pageNumber.draw();
		if(beforeMaximumIndex == maximumIndex) return extension.color_sampler.PageMaximumChangeEvent.NONE; else if(beforeMaximumIndex > maximumIndex) return extension.color_sampler.PageMaximumChangeEvent.DOWN; else return extension.color_sampler.PageMaximumChangeEvent.UP;
	}
	,run: function() {
		if(this.prevButton.isClicked()) {
			var wasMaximum = this.pageNumber.isMaximum();
			this.pageNumber.decrement();
			if(wasMaximum) this.nextButton.removeDisabled();
			if(this.pageNumber.isMinimum()) this.prevButton.disable();
			this.pageNumber.draw();
			this.event = extension.color_sampler.PageUIEvent.SELECTED_PREV;
		} else if(this.nextButton.isClicked()) {
			var wasMinimum = this.pageNumber.isMinimum();
			this.pageNumber.increment();
			if(wasMinimum) this.prevButton.removeDisabled();
			if(this.pageNumber.isMaximum()) this.nextButton.disable();
			this.pageNumber.draw();
			this.event = extension.color_sampler.PageUIEvent.SELECTED_NEXT;
		}
	}
	,__class__: extension.color_sampler.PageUI
};
extension.color_sampler.PageNumber = function(parentElement) {
	this.element = new $(".page",parentElement);
	this.index = 0;
	this.maximumIndex = this.index;
	this.draw();
};
$hxClasses["extension.color_sampler.PageNumber"] = extension.color_sampler.PageNumber;
extension.color_sampler.PageNumber.__name__ = ["extension","color_sampler","PageNumber"];
extension.color_sampler.PageNumber.prototype = {
	increment: function() {
		this.index++;
	}
	,decrement: function() {
		this.index--;
	}
	,isMinimum: function() {
		return this.index == 0;
	}
	,isMaximum: function() {
		return this.index == this.maximumIndex;
	}
	,setMaximumIndex: function(maximumIndex) {
		this.maximumIndex = maximumIndex;
	}
	,setIndex: function(index) {
		this.index = index;
	}
	,draw: function() {
		this.element.text(this.index + 1);
	}
	,__class__: extension.color_sampler.PageNumber
};
extension.parts = {};
extension.parts.Button = function(parentElement,className) {
	var _g = this;
	this.element = new $("." + className,parentElement);
	this.element.click(function(event) {
		_g.clicked = true;
	});
};
$hxClasses["extension.parts.Button"] = extension.parts.Button;
extension.parts.Button.__name__ = ["extension","parts","Button"];
extension.parts.Button.prototype = {
	isClicked: function() {
		var n = this.clicked;
		this.clicked = false;
		return n;
	}
	,disable: function() {
		this.element.attr("disabled","disabled");
	}
	,removeDisabled: function() {
		this.element.removeAttr("disabled");
	}
	,isDisabled: function() {
		return this.element.attr("disabled") != null;
	}
	,__class__: extension.parts.Button
};
extension.color_sampler.PageButton = function(parentElement,className) {
	extension.parts.Button.call(this,parentElement,className);
};
$hxClasses["extension.color_sampler.PageButton"] = extension.color_sampler.PageButton;
extension.color_sampler.PageButton.__name__ = ["extension","color_sampler","PageButton"];
extension.color_sampler.PageButton.__super__ = extension.parts.Button;
extension.color_sampler.PageButton.prototype = $extend(extension.parts.Button.prototype,{
	initialize: function() {
		this.disable();
	}
	,__class__: extension.color_sampler.PageButton
});
extension.color_sampler.PaletteContainer = function(parentElement) {
	this.element = new $(".container",parentElement);
	this.before = new extension.color_sampler.palette.PaletteArea(this.element,extension.color_sampler.palette.PaletteKind.BEFORE);
	this.after = new extension.color_sampler.palette.PaletteArea(this.element,extension.color_sampler.palette.PaletteKind.AFTER);
};
$hxClasses["extension.color_sampler.PaletteContainer"] = extension.color_sampler.PaletteContainer;
extension.color_sampler.PaletteContainer.__name__ = ["extension","color_sampler","PaletteContainer"];
extension.color_sampler.PaletteContainer.prototype = {
	changePage: function() {
		this.before.palette.update();
		this.after.palette.update();
	}
	,getPageMaximumIndex: function() {
		var beforeMaximumIndex = this.before.palette.getMaximumIndex();
		var afterMaximumIndex = this.after.palette.getMaximumIndex();
		if(beforeMaximumIndex >= afterMaximumIndex) return beforeMaximumIndex; else return afterMaximumIndex;
	}
	,getRgbHexValueSets: function() {
		var beforePalette = this.before.palette.getRgbHexValueSet();
		var afterPalette = this.after.palette.getRgbHexValueSet();
		var beforeLength = beforePalette.length;
		var afterLength = afterPalette.length;
		if(beforeLength > afterLength) beforePalette.splice(afterLength,beforeLength); else if(afterLength > beforeLength) afterPalette.splice(beforeLength,afterLength);
		return [beforePalette,afterPalette];
	}
	,__class__: extension.color_sampler.PaletteContainer
};
extension.color_sampler.palette = {};
extension.color_sampler.palette.Palette = function(parentElement,kind) {
	this.kind = kind;
	this.PAGE_CELL_TOTAL = 50;
	this.element = new $(".palette",parentElement);
	this.rgbHexValueMap = new haxe.ds.StringMap();
	this.pixelColorSet = [];
	this.lines = [];
	var _g = 0;
	while(_g < 5) {
		var i = _g++;
		this.lines.push(new extension.color_sampler.palette._Palette.Line(this.element,i));
	}
	this.setEditableLastCell();
};
$hxClasses["extension.color_sampler.palette.Palette"] = extension.color_sampler.palette.Palette;
extension.color_sampler.palette.Palette.__name__ = ["extension","color_sampler","palette","Palette"];
extension.color_sampler.palette.Palette.prototype = {
	getRgbHexValueSet: function() {
		var rgbHexValueSet = new Array();
		var _g = 0;
		var _g1 = this.pixelColorSet;
		while(_g < _g1.length) {
			var pixelColor = _g1[_g];
			++_g;
			rgbHexValueSet.push(pixelColor.rgbHexValue);
		}
		return rgbHexValueSet;
	}
	,isUnregisterableColor: function(rgbHexValue) {
		return this.rgbHexValueMap.exists(rgbHexValue) && !this.isAllowedDuplicateColor();
	}
	,clear: function() {
		this.pixelColorSet = [];
		this.rgbHexValueMap = new haxe.ds.StringMap();
		this.update();
	}
	,getMaximumIndex: function() {
		if(this.pixelColorSet.length < this.PAGE_CELL_TOTAL) return 0; else return Math.floor(this.pixelColorSet.length / this.PAGE_CELL_TOTAL);
	}
	,addColorSet: function(addedPixelColorSet) {
		var isAllowedDuplicateColor = this.isAllowedDuplicateColor();
		var _g = 0;
		while(_g < addedPixelColorSet.length) {
			var pixelColor = addedPixelColorSet[_g];
			++_g;
			if(this.rgbHexValueMap.exists(pixelColor.rgbHexValue) && !isAllowedDuplicateColor) continue;
			this.rgbHexValueMap.set(pixelColor.rgbHexValue,true);
			this.pixelColorSet.push(pixelColor);
		}
		this.updateAllPixelColorPosition(addedPixelColorSet);
		this.update();
	}
	,updateAllPixelColorPosition: function(scannedPixelColorSet) {
		var _g = 0;
		while(_g < scannedPixelColorSet.length) {
			var scannedPixelColor = scannedPixelColorSet[_g];
			++_g;
			var _g1 = 0;
			var _g2 = this.pixelColorSet;
			while(_g1 < _g2.length) {
				var pixelColor = _g2[_g1];
				++_g1;
				if(scannedPixelColor.rgbHexValue == pixelColor.rgbHexValue) pixelColor.updatePosition(scannedPixelColor.x,scannedPixelColor.y);
			}
		}
	}
	,isAllowedDuplicateColor: function() {
		var _g = this.kind;
		switch(_g[1]) {
		case 0:
			return false;
		case 1:
			return (extension.option.Setting.instance == null?extension.option.Setting.instance = new extension.option.Setting():extension.option.Setting.instance).isAllowedDuplucatePalletColorInPalletAfter();
		}
	}
	,update: function() {
		this.updateLine();
		this.setEditableLastCell();
	}
	,updateLine: function() {
		var displayedFirstCellIndex = (extension.color_sampler.PageUI.instance == null?extension.color_sampler.PageUI.instance = new extension.color_sampler.PageUI():extension.color_sampler.PageUI.instance).pageNumber.index * this.PAGE_CELL_TOTAL;
		var _g = 0;
		while(_g < 5) {
			var i = _g++;
			var splicedStartPosition = displayedFirstCellIndex + i * 10;
			var linePixelColorSet;
			if(splicedStartPosition > this.pixelColorSet.length) linePixelColorSet = []; else if(splicedStartPosition + 10 < this.pixelColorSet.length) linePixelColorSet = this.pixelColorSet.slice(splicedStartPosition,splicedStartPosition + 10); else linePixelColorSet = this.pixelColorSet.slice(splicedStartPosition);
			var line = this.lines[i];
			line.update(linePixelColorSet);
		}
	}
	,setEditableLastCell: function() {
		var lastFilledLine = this.getLastFilledLineIndex();
		switch(lastFilledLine[1]) {
		case 0:
			return;
		case 1:
			var index = lastFilledLine[2];
			var line = this.lines[index];
			line.setEditableLastCell();
			break;
		}
	}
	,getLastFilledLineIndex: function() {
		var startPosition = (extension.color_sampler.PageUI.instance == null?extension.color_sampler.PageUI.instance = new extension.color_sampler.PageUI():extension.color_sampler.PageUI.instance).pageNumber.index * this.PAGE_CELL_TOTAL;
		var coloringCellTotal = this.pixelColorSet.length - startPosition;
		if(coloringCellTotal >= this.PAGE_CELL_TOTAL || coloringCellTotal < 0) return extension.color_sampler.palette.LastFilledLine.ANOTHER_PAGE; else return extension.color_sampler.palette.LastFilledLine.INDEX(Math.floor(coloringCellTotal / 10));
	}
	,searchClickedCell: function() {
		var _g = 0;
		var _g1 = this.lines;
		while(_g < _g1.length) {
			var line = _g1[_g];
			++_g;
			var cell = line.searchClickedCell();
			if(cell != null) {
				this.clickedCell = cell;
				return true;
			}
		}
		return false;
	}
	,changeClickedCellColor: function(pixelColor) {
		if(!this.clickedCell.painted) {
			this.rgbHexValueMap.set(pixelColor.rgbHexValue,true);
			this.pixelColorSet.push(pixelColor);
		} else {
			var baseRgbHexValue = this.clickedCell.pixelColor.rgbHexValue;
			this.rgbHexValueMap.remove(baseRgbHexValue);
			this.rgbHexValueMap.set(pixelColor.rgbHexValue,true);
			var displayedFirstCellIndex = (extension.color_sampler.PageUI.instance == null?extension.color_sampler.PageUI.instance = new extension.color_sampler.PageUI():extension.color_sampler.PageUI.instance).pageNumber.index * this.PAGE_CELL_TOTAL;
			var registeredIndex = this.clickedCell.index + displayedFirstCellIndex;
			this.pixelColorSet.splice(registeredIndex,1);
			this.pixelColorSet.splice(registeredIndex,0,pixelColor);
		}
		this.update();
	}
	,updateClickedCellScanPosition: function(x,y) {
		this.clickedCell.pixelColor.updatePosition(x,y);
	}
	,__class__: extension.color_sampler.palette.Palette
};
extension.color_sampler.palette.LastFilledLine = $hxClasses["extension.color_sampler.palette.LastFilledLine"] = { __ename__ : ["extension","color_sampler","palette","LastFilledLine"], __constructs__ : ["ANOTHER_PAGE","INDEX"] };
extension.color_sampler.palette.LastFilledLine.ANOTHER_PAGE = ["ANOTHER_PAGE",0];
extension.color_sampler.palette.LastFilledLine.ANOTHER_PAGE.__enum__ = extension.color_sampler.palette.LastFilledLine;
extension.color_sampler.palette.LastFilledLine.INDEX = function(index) { var $x = ["INDEX",1,index]; $x.__enum__ = extension.color_sampler.palette.LastFilledLine; return $x; };
extension.color_sampler.palette._Palette = {};
extension.color_sampler.palette._Palette.Line = function(parentElement,lineIndex) {
	this.element = new $("<tr>").attr("class","line").appendTo(parentElement);
	this.cells = [];
	var _g = 0;
	while(_g < 10) {
		var i = _g++;
		var cellIndex = lineIndex * 10 + i;
		var cell = new extension.color_sampler.palette._Palette.Cell(this.element,cellIndex);
		this.cells.push(cell);
	}
};
$hxClasses["extension.color_sampler.palette._Palette.Line"] = extension.color_sampler.palette._Palette.Line;
extension.color_sampler.palette._Palette.Line.__name__ = ["extension","color_sampler","palette","_Palette","Line"];
extension.color_sampler.palette._Palette.Line.prototype = {
	update: function(pixelColorSet) {
		var _g = 0;
		while(_g < 10) {
			var i = _g++;
			var cell = this.cells[i];
			if(i < pixelColorSet.length) cell.fill(pixelColorSet[i]); else cell.clear();
		}
	}
	,setEditableLastCell: function() {
		var _g = 0;
		while(_g < 10) {
			var i = _g++;
			var cell = this.cells[i];
			if(cell.painted) continue;
			cell.setEditabled();
			break;
		}
	}
	,searchClickedCell: function() {
		var _g = 0;
		var _g1 = this.cells;
		while(_g < _g1.length) {
			var cell = _g1[_g];
			++_g;
			if(cell.isClicked()) return cell;
		}
		return null;
	}
	,__class__: extension.color_sampler.palette._Palette.Line
};
extension.color_sampler.palette._Palette.Cell = function(parentElement,index) {
	var _g = this;
	this.index = index;
	this.element = new $("<td>").attr("class","cell").appendTo(parentElement);
	this.element.mousedown(function(event) {
		if(_g.element.attr("class") == "cell editable" || _g.element.attr("class") == "cell active") _g.clicked = true;
	});
};
$hxClasses["extension.color_sampler.palette._Palette.Cell"] = extension.color_sampler.palette._Palette.Cell;
extension.color_sampler.palette._Palette.Cell.__name__ = ["extension","color_sampler","palette","_Palette","Cell"];
extension.color_sampler.palette._Palette.Cell.prototype = {
	isClicked: function() {
		var n = this.clicked;
		this.clicked = false;
		return n;
	}
	,fill: function(pixelColor) {
		this.pixelColor = pixelColor;
		this.element.css("background-color","#" + pixelColor.rgbHexValue);
		this.painted = true;
		this.element.attr("class","cell active");
	}
	,clear: function() {
		this.pixelColor = null;
		this.element.css("background-color","transparent");
		this.painted = false;
		this.element.attr("class","cell");
	}
	,setEditabled: function() {
		this.element.attr("class","cell editable");
	}
	,__class__: extension.color_sampler.palette._Palette.Cell
};
extension.color_sampler.palette.PaletteArea = function(parentElement,kind) {
	var idName;
	switch(kind[1]) {
	case 0:
		idName = "before";
		break;
	case 1:
		idName = "after";
		break;
	}
	this.element = new $("." + idName,parentElement);
	this.palette = new extension.color_sampler.palette.Palette(this.element,kind);
	this.scanButton = new extension.parts.Button(this.element,"scan_button");
	this.clearButton = new extension.parts.Button(this.element,"clear_button");
};
$hxClasses["extension.color_sampler.palette.PaletteArea"] = extension.color_sampler.palette.PaletteArea;
extension.color_sampler.palette.PaletteArea.__name__ = ["extension","color_sampler","palette","PaletteArea"];
extension.color_sampler.palette.PaletteArea.prototype = {
	__class__: extension.color_sampler.palette.PaletteArea
};
extension.color_sampler.palette.PaletteKind = $hxClasses["extension.color_sampler.palette.PaletteKind"] = { __ename__ : ["extension","color_sampler","palette","PaletteKind"], __constructs__ : ["BEFORE","AFTER"] };
extension.color_sampler.palette.PaletteKind.BEFORE = ["BEFORE",0];
extension.color_sampler.palette.PaletteKind.BEFORE.__enum__ = extension.color_sampler.palette.PaletteKind;
extension.color_sampler.palette.PaletteKind.AFTER = ["AFTER",1];
extension.color_sampler.palette.PaletteKind.AFTER.__enum__ = extension.color_sampler.palette.PaletteKind;
extension.option = {};
extension.option.Setting = function() {
	this.element = new $("#setting");
	new extension.parts.TitleBar("title_option",this.element);
};
$hxClasses["extension.option.Setting"] = extension.option.Setting;
extension.option.Setting.__name__ = ["extension","option","Setting"];
extension.option.Setting.get_instance = function() {
	if(extension.option.Setting.instance == null) return extension.option.Setting.instance = new extension.option.Setting(); else return extension.option.Setting.instance;
};
extension.option.Setting.prototype = {
	isAllowedDuplucatePalletColorInPalletAfter: function() {
		return this.isChecked("duplicate_color");
	}
	,isIgnoredLockedLayerPaint: function() {
		return this.isChecked("ignore_locked");
	}
	,isChecked: function(className) {
		return new $("." + className,this.element)["is"](":checked");
	}
	,__class__: extension.option.Setting
};
extension.overlay = {};
extension.overlay.OverlayWindow = function() {
	this.element = new $("#overlay");
	this.windowElement = new $(".window",this.element);
	this.cancelButton = new extension.parts.Button(this.element,"cancel_button");
	this.messageElement = new $(".message",this.element);
};
$hxClasses["extension.overlay.OverlayWindow"] = extension.overlay.OverlayWindow;
extension.overlay.OverlayWindow.__name__ = ["extension","overlay","OverlayWindow"];
extension.overlay.OverlayWindow.get_instance = function() {
	if(extension.overlay.OverlayWindow.instance == null) return extension.overlay.OverlayWindow.instance = new extension.overlay.OverlayWindow(); else return extension.overlay.OverlayWindow.instance;
};
extension.overlay.OverlayWindow.prototype = {
	showCanvasColorSamplerRunning: function() {
		this.show("Color sampling...");
	}
	,showPaletteChangeRunning: function() {
		this.show("Palette changing...");
	}
	,show: function(message) {
		this.windowElement.css("display","block");
		this.messageElement.text(message);
		this.element.fadeIn("fast");
	}
	,hide: function() {
		this.element.fadeOut("fast");
	}
	,showExceptWindow: function() {
		this.windowElement.css("display","none");
		this.element.fadeIn("fast");
	}
	,__class__: extension.overlay.OverlayWindow
};
extension.palette_change = {};
extension.palette_change.PaletteChangeUI = function() {
	this.element = new $("#palette_changer");
	this.runButton = new extension.parts.Button(this.element,"run_button");
};
$hxClasses["extension.palette_change.PaletteChangeUI"] = extension.palette_change.PaletteChangeUI;
extension.palette_change.PaletteChangeUI.__name__ = ["extension","palette_change","PaletteChangeUI"];
extension.palette_change.PaletteChangeUI.get_instance = function() {
	if(extension.palette_change.PaletteChangeUI.instance == null) return extension.palette_change.PaletteChangeUI.instance = new extension.palette_change.PaletteChangeUI(); else return extension.palette_change.PaletteChangeUI.instance;
};
extension.palette_change.PaletteChangeUI.prototype = {
	__class__: extension.palette_change.PaletteChangeUI
};
extension.parts.TitleBar = function(titleBarId,slideElement) {
	var titleElement = new $("#" + titleBarId);
	titleElement.mousedown(function(event) {
		if(slideElement["is"](":hidden")) slideElement.slideDown("fast"); else slideElement.slideUp("fast");
	});
};
$hxClasses["extension.parts.TitleBar"] = extension.parts.TitleBar;
extension.parts.TitleBar.__name__ = ["extension","parts","TitleBar"];
extension.parts.TitleBar.prototype = {
	__class__: extension.parts.TitleBar
};
var haxe = {};
haxe.Serializer = function() {
	this.buf = new StringBuf();
	this.cache = new Array();
	this.useCache = haxe.Serializer.USE_CACHE;
	this.useEnumIndex = haxe.Serializer.USE_ENUM_INDEX;
	this.shash = new haxe.ds.StringMap();
	this.scount = 0;
};
$hxClasses["haxe.Serializer"] = haxe.Serializer;
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
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
$hxClasses["haxe.Timer"] = haxe.Timer;
haxe.Timer.__name__ = ["haxe","Timer"];
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
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
haxe.ds = {};
haxe.ds.IntMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.IntMap"] = haxe.ds.IntMap;
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
haxe.ds.ObjectMap = function() {
	this.h = { };
	this.h.__keys__ = { };
};
$hxClasses["haxe.ds.ObjectMap"] = haxe.ds.ObjectMap;
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
haxe.ds.StringMap = function() {
	this.h = { };
};
$hxClasses["haxe.ds.StringMap"] = haxe.ds.StringMap;
haxe.ds.StringMap.__name__ = ["haxe","ds","StringMap"];
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,exists: function(key) {
		return this.h.hasOwnProperty("$" + key);
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
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
haxe.io = {};
haxe.io.Bytes = function(length,b) {
	this.length = length;
	this.b = b;
};
$hxClasses["haxe.io.Bytes"] = haxe.io.Bytes;
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
haxe.io.Eof = function() { };
$hxClasses["haxe.io.Eof"] = haxe.io.Eof;
haxe.io.Eof.__name__ = ["haxe","io","Eof"];
haxe.io.Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe.io.Eof
};
var js = {};
js.Boot = function() { };
$hxClasses["js.Boot"] = js.Boot;
js.Boot.__name__ = ["js","Boot"];
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
$hxClasses["js.Lib"] = js.Lib;
js.Lib.__name__ = ["js","Lib"];
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
};
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
adobe.cep._CSEventScope.CSEventScope_Impl_.GLOBAL = "GLOBAL";
adobe.cep._CSEventScope.CSEventScope_Impl_.APPLICATION = "APPLICATION";
adobe.cep._CSEventType.CSEventType_Impl_.PERSISTENT = "com.adobe.PhotoshopPersistent";
adobe.cep._OpenURLInDefaultBrowserCode.OpenURLInDefaultBrowserCode_Impl_.NO_ERROR = 0;
adobe.cep._OpenURLInDefaultBrowserCode.OpenURLInDefaultBrowserCode_Impl_.ERR_UNKNOWN = 1;
adobe.cep._OpenURLInDefaultBrowserCode.OpenURLInDefaultBrowserCode_Impl_.ERR_INVALID_PARAMS = 2;
adobe.cep._OpenURLInDefaultBrowserCode.OpenURLInDefaultBrowserCode_Impl_.ERR_INVALID_URL = 201;
adobe.cep._ScaleFactor.ScaleFactor_Impl_.FAIL = -1;
adobe.cep._ScaleFactor.ScaleFactor_Impl_.NORMAL = 1;
adobe.cep._ScaleFactor.ScaleFactor_Impl_.HiDPI = 2;
adobe.cep._UIColorType.UIColorType_Impl_.RGB = 1;
adobe.cep._UIColorType.UIColorType_Impl_.GRADATION = 2;
common.ClassName.PALETTE_CHANGE_PACK = "PaletteChangePack";
common.ClassName.CANVAS_COLOR_SAMPLER = "CanvasColorSampler";
common.ClassName.PALETTE_CHANGE = "PaletteChange";
common.ClassName.PIXEL_COLOR_SEARCH = "PixelColorSearch";
common.ClassName.PIXEL_SELECTOR = "PixelSelector";
common.PixelColor.NOT_SET_POSITION = -1;
extension.CanvasColorSamplerRunner.INSTANCE_NAME = "canvasColorSampler";
extension.JsxLoader.JSX_DIRECTORY = "/jsx/";
extension.JsxLoader.JSX_EXTENSION = ".jsx";
extension.JsxLoader.LOAD_JSX_SET = ["PaletteChangePack"];
extension.PaletteChangeRunner.INSTANCE_NAME = "paletteChange";
extension.Panel.TIMER_SPEED_CALM = 250;
extension.Panel.TIMER_SPEED_RUNNING = 50;
extension.color_picker.PixelColorSearchRunner.INSTANCE_NAME = "pixelColorSearch";
extension.color_picker.PixelSelectorRunner.INSTANCE_NAME = "pixelSelector";
extension.color_sampler.PageNumber.DEFAULT_INDEX = 0;
extension.color_sampler.palette.Palette.LINE_TOTAL = 5;
extension.color_sampler.palette._Palette.Line.CELL_TOTAL = 10;
extension.color_sampler.palette._Palette.Cell.EDITABLE = "cell editable";
extension.color_sampler.palette._Palette.Cell.ACTIVE = "cell active";
extension.overlay.OverlayWindow.FACE_SPEED = "fast";
extension.parts.TitleBar.SLIDE_SPEED = "fast";
haxe.Serializer.USE_CACHE = false;
haxe.Serializer.USE_ENUM_INDEX = false;
haxe.Serializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.Unserializer.DEFAULT_RESOLVER = Type;
haxe.Unserializer.BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%:";
haxe.ds.ObjectMap.count = 0;
extension.Panel.main();
})();

//# sourceMappingURL=index.js.map