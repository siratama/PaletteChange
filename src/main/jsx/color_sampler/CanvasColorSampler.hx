package jsx.color_sampler;

import psd.UnitValue;
import jsx.util.Bounds;
import psd.LayerTypeName;
import common.CanvasColorSamplerEvent;
import psd.ArtLayer;
import haxe.Unserializer;
import haxe.Serializer;
import psd.Layer;
import jsx.util.LayersDisplay;
import psd.Document;
import psd.Layers;
import psd.Application;
import psd.Lib;
import psd.Lib.app;

using jsx.util.Bounds;

@:native("CanvasColorSampler")
class CanvasColorSampler
{
	private var mainFunction:Void->Void;
	private var application:Application;
	private var activeDocument:Document;
	private var activeDocumentHeight:Float;
	private var layersDisplay:LayersDisplay;
	private var interruptCommand:Bool;

	private var rgbHexValueSet:Array<String>;
	private var rgbHexValueMap:Map<String, Bool>;
	private var bounds:Bounds;
	private var positionX:Int;
	private var positionY:Int;
	private var scanPixelCount:Int;
	private static inline var ONCE_SCAN_PIXEL = 10;

	private var event:CanvasColorSamplerEvent;
	public function getSerializedEvent():String{
		return Serializer.run(event);
	}

	public static function main(){
		//test();
	}
	private static function test()
	{
		var canvasColorSampler = new CanvasColorSampler();
		var initialErrorEvent = Unserializer.run(canvasColorSampler.getInitialErrorEvent());
		switch(initialErrorEvent){
			case CanvasColorSamplerInitialErrorEvent.ERROR(message):
				Lib.alert(message);
				return;
			case CanvasColorSamplerInitialErrorEvent.NONE:
				"";
		}

		canvasColorSampler.initialize();
		canvasColorSampler.run();
		canvasColorSampler.run();
		var result = canvasColorSampler.getSerializedEvent();
		var event:CanvasColorSamplerEvent = Unserializer.run(result);
		switch(event)
		{
			case CanvasColorSamplerEvent.NONE: return;
			case CanvasColorSamplerEvent.RESULT(rgbHexColorSet):
				Lib.alert(rgbHexColorSet);
		}
	}

	public function new()
	{
		application = app;
	}
	public function run()
	{
		mainFunction();
	}
	public function getInitialErrorEvent():String
	{
		var event =
			(application.documents.length == 0) ?
				CanvasColorSamplerInitialErrorEvent.ERROR("Open document."):
			(application.activeDocument.activeLayer.typename == LayerTypeName.LAYER_SET) ?
				CanvasColorSamplerInitialErrorEvent.ERROR("Select layer."):
				CanvasColorSamplerInitialErrorEvent.NONE;

		return Serializer.run(event);
	}
	public function initialize()
	{
		activeDocument = application.activeDocument;
		activeDocumentHeight = activeDocument.height;
		var activeLayer = activeDocument.activeLayer;

		layersDisplay = new LayersDisplay(activeDocument.layers);
		layersDisplay.hide();

		if(!cast(activeLayer, ArtLayer).isBackgroundLayer)
			activeLayer.visible = true;

		bounds = activeLayer.bounds.convert();

		rgbHexValueSet = [];
		rgbHexValueMap = new Map();
		positionX = Std.int(bounds.left);
		positionY = Std.int(bounds.top);
		event = CanvasColorSamplerEvent.NONE;
		mainFunction = scan;
	}
	private function scan()
	{
		scanPixelCount = 0;
		for (y in positionY...Std.int(bounds.bottom))
		{
			var adjustY = (y == activeDocumentHeight) ? y : y + 0.1;

			for (x in positionX...Std.int(bounds.right))
			{
				//var colorSampler = activeDocument.colorSamplers.add([x, adjustY]);
				var colorSampler = activeDocument.colorSamplers.add([new UnitValue(x, UnitType.PIXEL), new UnitValue(y, UnitType.PIXEL)]);
				//var colorSampler = activeDocument.colorSamplers.add([new UnitValue(x, UnitType.PIXEL), new UnitValue(adjustY, UnitType.PIXEL)]);

				try{
					var rgbHexValue = colorSampler.color.rgb.hexValue;
					Lib.alert(x + ":" + y + ":" + rgbHexValue);

					//call Map.exists method is error from extension panel
					if(!rgbHexValueMap[rgbHexValue])
					{
						rgbHexValueSet.push(rgbHexValue);
						rgbHexValueMap.set(rgbHexValue, true);
						Lib.alert(rgbHexValue);
					}
				//colorSampler.color is transparent
				}catch(error:Dynamic){}

				colorSampler.remove();

				if(++scanPixelCount < ONCE_SCAN_PIXEL) continue;
				adjustPosition(x, y);
				return;
			}
		}
		mainFunction = finish;
	}
	private function adjustPosition(x:Int, y:Int)
	{
		positionX = x + 1;
		positionY = y;
		if(positionX >= Std.int(bounds.right)){
			positionX = 0;
			positionY++;
		}
	}
	private function finish()
	{
		layersDisplay.restore();
		event = CanvasColorSamplerEvent.RESULT(rgbHexValueSet);
	}
	public function interrupt()
	{
		layersDisplay.restore();
	}
}
