(function ($hx_exports) { "use strict";
var HxOverrides = function() { };
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
var common = {};
common.CSV = function() { };
var jsx = {};
jsx.CanvasColorSampler = $hx_exports.CanvasColorSampler = function() {
};
jsx.CanvasColorSampler.main = function() {
};
jsx.CanvasColorSampler.prototype = {
	execute: function() {
		this.application = app;
		this.activeDocument = this.application.activeDocument;
		this.layers = this.activeDocument.layers;
		this.layersDisplay = new jsx.util.LayersDisplay(this.layers);
		this.layersDisplay.hide();
		var layer = this.activeDocument.activeLayer;
		layer.visible = true;
		var rgbHexValueSet = [];
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
				var rgbHexValue = colorSample.color.rgb.hexValue;
				if(HxOverrides.indexOf(rgbHexValueSet,rgbHexValue,0) != -1) rgbHexValueSet.push(rgbHexValue);
			}
		}
		this.layersDisplay.restore();
		return rgbHexValueSet.join(",");
	}
};
jsx.util = {};
jsx.util.Bounds = function(left,top,right,bottom) {
	this.left = left;
	this.top = top;
	this.right = right;
	this.bottom = bottom;
};
jsx.util.Bounds.convert = function(bounds) {
	return new jsx.util.Bounds(bounds[0].value,bounds[1].value,bounds[2].value,bounds[3].value);
};
jsx.util.Bounds.prototype = {
	toString: function() {
		return [this.left,this.top,this.right,this.bottom].join(":");
	}
};
jsx.util.LayersDisplay = function(layers) {
	this.layers = layers;
	this.defaultLayerVisibleSet = [];
};
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
};
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
common.CSV.RGB_HAX_VALUE_DELIMITER = ",";
jsx.CanvasColorSampler.main();
})(typeof window != "undefined" ? window : exports);
