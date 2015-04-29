(function () { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var common = {};
common.ClassName = function() { };
var csinterface = {};
csinterface.AbstractCSInterface = function(csInterface) {
	this.csInterface = csInterface;
};
csinterface.AbstractCSInterface.create = function() {
	return new csinterface.AbstractCSInterface(new CSInterface());
};
csinterface.AbstractCSInterface.prototype = {
	getExtensionUri: function() {
		return "file:///" + this.csInterface.getSystemPath(SystemPath.EXTENSION);
	}
	,evalScript: function(script,callback) {
		this.csInterface.evalScript(script,callback);
	}
};
var extension = {};
extension.Panel = function() {
	window.addEventListener("load",$bind(this,this.initialize));
};
extension.Panel.main = function() {
	new extension.Panel();
};
extension.Panel.prototype = {
	initialize: function(event) {
		this.canvasColorSampler = new extension.color_sampler.CanvasColorSampler();
		this.palletChange = new extension.palette_change.PaletteChange();
	}
	,callCanvasColorSampler: function() {
		this.csInterface.evalScript("new " + "CanvasColorSampler" + "();",function(data) {
		});
	}
	,callPalletChanger: function() {
		var rgbHexValueCSV = "";
		this.csInterface.evalScript("new " + "PalletChanger" + "(" + rgbHexValueCSV + ");",function(data) {
		});
	}
};
extension.color_sampler = {};
extension.color_sampler.CanvasColorSampler = function() {
	this.element = new $("#canvas_color_sampler");
	this.palletContainer = new extension.color_sampler.PaletteContainer(this.element);
	new extension.color_sampler.PageUI();
};
extension.color_sampler.PageUI = function() {
	this.element = new $("#page_ui");
	this.leftButton = this.setButton("prev");
	this.rightButton = this.setButton("next");
	this.pageNumber = new extension.color_sampler.PageNumber(this.element);
};
extension.color_sampler.PageUI.prototype = {
	setButton: function(className) {
		var button = new extension.color_sampler.ScrollButton(this.element,className);
		button.initialize();
		return button;
	}
};
extension.color_sampler.PageNumber = function(parentElement) {
	this.element = new $(".page",parentElement);
	this.element.text(1);
};
extension.parts = {};
extension.parts.Button = function(parentElement,className) {
	var _g = this;
	this.element = new $("." + className,parentElement);
	this.element.click(function(event) {
		_g.clicked = true;
	});
};
extension.parts.Button.prototype = {
	isClicked: function() {
		var n = this.clicked;
		this.clicked = false;
		return n;
	}
};
extension.color_sampler.ScrollButton = function(parentElement,className) {
	extension.parts.Button.call(this,parentElement,className);
};
extension.color_sampler.ScrollButton.__super__ = extension.parts.Button;
extension.color_sampler.ScrollButton.prototype = $extend(extension.parts.Button.prototype,{
	initialize: function() {
		this.element.attr("disabled","disabled");
	}
});
extension.color_sampler.PaletteClearButton = function(parentElement,className) {
	extension.parts.Button.call(this,parentElement,className);
};
extension.color_sampler.PaletteClearButton.__super__ = extension.parts.Button;
extension.color_sampler.PaletteClearButton.prototype = $extend(extension.parts.Button.prototype,{
});
extension.color_sampler.PaletteContainer = function(parentElement) {
	this.element = new $(".container",parentElement);
	this.before = new extension.color_sampler.palette.PaletteArea(this.element,extension.color_sampler.palette.PaletteKind.BEFORE);
	this.after = new extension.color_sampler.palette.PaletteArea(this.element,extension.color_sampler.palette.PaletteKind.AFTER);
};
extension.color_sampler.palette = {};
extension.color_sampler.palette.Palette = function(parentElement) {
	this.element = new $(".palette",parentElement);
	this.lines = [];
	var _g = 0;
	while(_g < 5) {
		var i = _g++;
		this.lines.push(new extension.color_sampler.palette.Line(this.element));
	}
};
extension.color_sampler.palette.Line = function(parentElement) {
	this.element = new $("<tr>").attr("class","line").appendTo(parentElement);
	this.cells = [];
	var _g = 0;
	while(_g < 10) {
		var i = _g++;
		this.cells.push(new extension.color_sampler.palette.Cell(this.element));
	}
};
extension.color_sampler.palette.Cell = function(parentElement) {
	this.element = new $("<td>").attr("class","cell editable").appendTo(parentElement);
	this.element.click(function(event) {
	});
};
extension.color_sampler.palette.Cell.prototype = {
	fill: function(rgbHexColor) {
		this.element.css("background-color","#" + rgbHexColor);
		this.painted = true;
	}
	,clear: function() {
		this.element.css("background-color","transparent");
		this.painted = false;
	}
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
	this.palette = new extension.color_sampler.palette.Palette(this.element);
	this.scanButton = new extension.color_sampler.palette.ScanButton(this.element,"scan_button");
	this.clearButton = new extension.color_sampler.PaletteClearButton(this.element,"clear_button");
};
extension.color_sampler.palette.PaletteKind = { __constructs__ : ["BEFORE","AFTER"] };
extension.color_sampler.palette.PaletteKind.BEFORE = ["BEFORE",0];
extension.color_sampler.palette.PaletteKind.BEFORE.__enum__ = extension.color_sampler.palette.PaletteKind;
extension.color_sampler.palette.PaletteKind.AFTER = ["AFTER",1];
extension.color_sampler.palette.PaletteKind.AFTER.__enum__ = extension.color_sampler.palette.PaletteKind;
extension.color_sampler.palette.ScanButton = function(parentElement,className) {
	extension.parts.Button.call(this,parentElement,className);
};
extension.color_sampler.palette.ScanButton.__super__ = extension.parts.Button;
extension.color_sampler.palette.ScanButton.prototype = $extend(extension.parts.Button.prototype,{
});
extension.palette_change = {};
extension.palette_change.PaletteChange = function() {
	this.element = new $("#palette_changer");
	this.runButton = new extension.palette_change.RunButton(this.element,"run_button");
};
extension.palette_change.RunButton = function(parentElement,className) {
	extension.parts.Button.call(this,parentElement,className);
};
extension.palette_change.RunButton.__super__ = extension.parts.Button;
extension.palette_change.RunButton.prototype = $extend(extension.parts.Button.prototype,{
});
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
common.ClassName.CANVAS_COLOR_SAMPLER = "CanvasColorSampler";
common.ClassName.PALLET_CHANGER = "PalletChanger";
extension.Panel.INSTANCE_NAME = "main";
extension.color_sampler.PageNumber.DEFAULT_INDEX = 1;
extension.color_sampler.palette.Palette.LINE_TOTAL = 5;
extension.color_sampler.palette.Line.CELL_TOTAL = 10;
extension.Panel.main();
})();

//# sourceMappingURL=index.js.map