(function () { "use strict";
var EReg = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
};
var app = {};
app.Attention = function() {
	this.element = new $("#attention");
};
app.Attention.__name__ = true;
app.Attention.get_instance = function() {
	if(app.Attention.instance == null) return app.Attention.instance = new app.Attention(); else return app.Attention.instance;
};
app.Attention.prototype = {
	show: function(message) {
		this.element.text(message);
	}
	,clear: function() {
		this.element.text("");
	}
};
app.DropZoneEvent = { __ename__ : true, __constructs__ : ["NONE","DROP_FILE_ERROR","DROPPED"] };
app.DropZoneEvent.NONE = ["NONE",0];
app.DropZoneEvent.NONE.__enum__ = app.DropZoneEvent;
app.DropZoneEvent.DROP_FILE_ERROR = function(message) { var $x = ["DROP_FILE_ERROR",1,message]; $x.__enum__ = app.DropZoneEvent; return $x; };
app.DropZoneEvent.DROPPED = function(file) { var $x = ["DROPPED",2,file]; $x.__enum__ = app.DropZoneEvent; return $x; };
app.DropZone = function() {
	var dropZoneElement = new $(".drop_zone");
	dropZoneElement.on("drop",null,$bind(this,this.drop));
	dropZoneElement.on("dragover",null,$bind(this,this.dragover));
	this.event = app.DropZoneEvent.NONE;
};
app.DropZone.__name__ = true;
app.DropZone.get_instance = function() {
	if(app.DropZone.instance == null) return app.DropZone.instance = new app.DropZone(); else return app.DropZone.instance;
};
app.DropZone.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = app.DropZoneEvent.NONE;
		return n;
	}
	,dragover: function(event) {
		this.preventEvent(event);
		event.originalEvent.dataTransfer.dropEffect = "copy";
	}
	,drop: function(event) {
		this.preventEvent(event);
		var files = event.originalEvent.dataTransfer.files;
		var file = files[0];
		if(!new EReg("image.*","").match(file.type)) this.event = app.DropZoneEvent.DROP_FILE_ERROR("Set image file"); else this.event = app.DropZoneEvent.DROPPED(file);
	}
	,preventEvent: function(event) {
		event.preventDefault();
		event.stopPropagation();
	}
};
app.ImageFileReaderEvent = { __ename__ : true, __constructs__ : ["NONE","READ"] };
app.ImageFileReaderEvent.NONE = ["NONE",0];
app.ImageFileReaderEvent.NONE.__enum__ = app.ImageFileReaderEvent;
app.ImageFileReaderEvent.READ = function(data) { var $x = ["READ",1,data]; $x.__enum__ = app.ImageFileReaderEvent; return $x; };
app.ImageFileReader = function() {
	this.fileReader = new FileReader();
	this.fileReader.addEventListener("load",$bind(this,this.onLoadFile));
	this.event = app.ImageFileReaderEvent.NONE;
};
app.ImageFileReader.__name__ = true;
app.ImageFileReader.get_instance = function() {
	if(app.ImageFileReader.instance == null) return app.ImageFileReader.instance = new app.ImageFileReader(); else return app.ImageFileReader.instance;
};
app.ImageFileReader.prototype = {
	getEvent: function() {
		var n = this.event;
		this.event = app.ImageFileReaderEvent.NONE;
		return n;
	}
	,onLoadFile: function(event) {
		this.event = app.ImageFileReaderEvent.READ(event.target.result);
	}
	,start: function(file) {
		this.fileReader.readAsDataURL(file);
	}
};
app.ImageViewer = function() {
	this.imagePairSet = [];
	this.element = new $("#image_viewer");
};
app.ImageViewer.__name__ = true;
app.ImageViewer.get_instance = function() {
	if(app.ImageViewer.instance == null) return app.ImageViewer.instance = new app.ImageViewer(); else return app.ImageViewer.instance;
};
app.ImageViewer.prototype = {
	show: function(imageSourceUri) {
		this.imageElement = new $("<img>").appendTo(this.element);
		this.imageElement.attr("src",imageSourceUri);
	}
	,getHTMLImageElement: function() {
		return this.imageElement[0];
	}
};
app.ImagePair = function(parentElement) {
	this.element = new $("<div>").appendTo(parentElement);
	this.element.attr("class","pair");
	this.before = new app.Image(this.element);
	this.after = new app.Image(this.element);
};
app.ImagePair.__name__ = true;
app.Image = function(parentElement) {
	this.element = new $("<div>").appendTo(parentElement);
	this.element.attr("class","image");
};
app.Image.__name__ = true;
app.Image.prototype = {
	setImageTag: function(imageSourceUri) {
		this.imageElement = new $("<img>").appendTo(this.element);
		this.imageElement.attr("src",imageSourceUri);
	}
	,getHTMLImageElement: function() {
		return this.imageElement[0];
	}
};
app.Pallet = function() {
	var _g = this;
	new $(function() {
		_g.initialize();
	});
};
app.Pallet.__name__ = true;
app.Pallet.main = function() {
	new app.Pallet();
};
app.Pallet.prototype = {
	initialize: function() {
		if(app.DropZone.instance == null) this.dropZone = app.DropZone.instance = new app.DropZone(); else this.dropZone = app.DropZone.instance;
		if(app.Attention.instance == null) this.attention = app.Attention.instance = new app.Attention(); else this.attention = app.Attention.instance;
		if(app.ImageFileReader.instance == null) this.imageFileReader = app.ImageFileReader.instance = new app.ImageFileReader(); else this.imageFileReader = app.ImageFileReader.instance;
		if(app.ImageViewer.instance == null) this.imageViewer = app.ImageViewer.instance = new app.ImageViewer(); else this.imageViewer = app.ImageViewer.instance;
		this.mainFunction = $bind(this,this.waitToDropImageFile);
		this.timer = new haxe.Timer(100);
		this.timer.run = $bind(this,this.run);
	}
	,run: function() {
		this.mainFunction();
	}
	,waitToDropImageFile: function() {
		var event = this.dropZone.getEvent();
		switch(event[1]) {
		case 0:
			return;
		case 1:
			var message = event[2];
			this.attention.show(message);
			break;
		case 2:
			var file = event[2];
			this.initializeToReadImageFile(file);
			break;
		}
	}
	,initializeToReadImageFile: function(file) {
		this.imageFileReader.start(file);
		this.mainFunction = $bind(this,this.readImageFile);
	}
	,readImageFile: function() {
		var event = this.imageFileReader.getEvent();
		switch(event[1]) {
		case 0:
			return;
		case 1:
			var data = event[2];
			this.attention.clear();
			this.imageViewer.show(data);
			this.mainFunction = $bind(this,this.finish);
			break;
		}
	}
	,finish: function() {
		this.timer.stop();
	}
};
var color = {};
color.Converter = function() { };
color.Converter.__name__ = true;
color.Converter.create = function(a,r,g,b) {
	return { a : a, r : r, g : g, b : b};
};
color.Converter.toInstance = function(rgbaValue) {
	var a = rgbaValue >> 24 & 255;
	var r = rgbaValue >> 16 & 255;
	var g = rgbaValue >> 8 & 255;
	var b = rgbaValue & 255;
	return { a : a, r : r, g : g, b : b};
};
color.Converter.toString = function(rgba) {
	haxe.Log.trace(Std.string((function($this) {
		var $r;
		var $int = rgba.a;
		$r = $int < 0?4294967296.0 + $int:$int + 0.0;
		return $r;
	}(this))),{ fileName : "RGBA.hx", lineNumber : 26, className : "color.Converter", methodName : "toString", customParams : [rgba.r,rgba.g,rgba.b]});
};
var haxe = {};
haxe.Log = function() { };
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
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
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.__name__ = true;
Array.__name__ = true;
app.Pallet.main();
})();

//# sourceMappingURL=index.js.map