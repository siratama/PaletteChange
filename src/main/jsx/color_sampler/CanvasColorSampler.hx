package jsx.color_sampler;

import common.PixelColor;
import jsx.util.ColorSamplePosition;
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
import psd.Lib.app;

using jsx.util.Bounds;

@:keep
@:native("CanvasColorSampler")
class CanvasColorSampler
{
	private var mainFunction:Void->Void;
	private var application:Application;
	private var activeDocument:Document;
	private var colorSamplePosition:ColorSamplePosition;
	private var layersDisplay:LayersDisplay;
	private var interruptCommand:Bool;

	private var pixelColorSet:Array<PixelColor>;
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
		//CanvasColorSamplerTest.execute();
	}

	public function new()
	{
		application = app;
		colorSamplePosition = new ColorSamplePosition();
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
		colorSamplePosition.initialize(activeDocument);
		var activeLayer = activeDocument.activeLayer;

		layersDisplay = new LayersDisplay(activeDocument.layers);
		layersDisplay.hide();

		if(!cast(activeLayer, ArtLayer).isBackgroundLayer)
			activeLayer.visible = true;

		bounds = activeLayer.bounds.convert();

		pixelColorSet = [];
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
			var adjustY = colorSamplePosition.getAdjustY(y);

			for (x in positionX...Std.int(bounds.right))
			{
				var adjustX = colorSamplePosition.getAdjustX(x);
				var colorSampler = activeDocument.colorSamplers.add([adjustX, adjustY]);

				try{
					var rgbHexValue = colorSampler.color.rgb.hexValue;

					//call Map.exists method is error from extension panel
					if(!rgbHexValueMap[rgbHexValue])
					{
						var pixelColor = PixelColor.create(rgbHexValue, x, y);
						pixelColorSet.push(pixelColor);
						rgbHexValueMap.set(rgbHexValue, true);
					}
				//colorSampler.color is transparent
				}catch(error:Dynamic){}

				colorSampler.remove();

				if(++scanPixelCount < ONCE_SCAN_PIXEL) continue;
				adjustPosition(x, y);
				return;
			}
			positionX = Std.int(bounds.left);
		}
		mainFunction = finish;
	}
	private function adjustPosition(x:Int, y:Int)
	{
		positionX = x + 1;
		positionY = y;
		if(positionX >= Std.int(bounds.right)){
			positionX = Std.int(bounds.left);
			positionY++;
		}
	}
	private function finish()
	{
		layersDisplay.restore();
		event = CanvasColorSamplerEvent.RESULT(pixelColorSet);
	}
	public function interrupt()
	{
		layersDisplay.restore();
	}
}

private class CanvasColorSamplerTest
{
	public static function execute()
	{
		var canvasColorSampler = new CanvasColorSampler();
		var initialErrorEvent = Unserializer.run(canvasColorSampler.getInitialErrorEvent());
		switch(initialErrorEvent){
			case CanvasColorSamplerInitialErrorEvent.ERROR(message):
				js.Lib.alert(message);
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
			case CanvasColorSamplerEvent.RESULT(pixelColorSet):
				js.Lib.alert(pixelColorSet);
		}
	}
}
