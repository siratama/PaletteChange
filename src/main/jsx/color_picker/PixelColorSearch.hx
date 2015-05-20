package jsx.color_picker;

import common.PixelSelectorEvent.PixelSelectorInitialErrorEvent;
import common.PixelColorSearchEvent;
import jsx.util.Bounds;
import psd.ArtLayer;
import jsx.util.LayersDisplay;
import common.PixelColorSearchEvent.PixelColorSearchInitialErrorEvent;
import haxe.Serializer;
import haxe.Unserializer;
import jsx.util.ColorSamplePosition;
import psd.Application;
import psd.Document;
import psd.Lib.app;

using jsx.util.Bounds;

@:native("PixelColorSearch")
class PixelColorSearch
{
	private var mainFunction:Void->Void;
	private var application:Application;
	private var activeDocument:Document;
	private var colorSamplePosition:ColorSamplePosition;
	private var layersDisplay:LayersDisplay;

	private var checkedRgbHexValue:String;
	private var bounds:Bounds;
	private var positionX:Int;
	private var positionY:Int;
	private var scanPixelCount:Int;
	private static inline var ONCE_SCAN_PIXEL = 10;

	private var event:PixelColorSearchEvent;
	public function getSerializedEvent():String{
		return Serializer.run(event);
	}

	public static function main()
	{
		//PixelColorSearchTest.execute();
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
				PixelColorSearchInitialErrorEvent.ERROR("Open document."):
				PixelColorSearchInitialErrorEvent.NONE;

		return Serializer.run(event);
	}
	public function initialize(checkedRgbHexValue:String)
	{
		this.checkedRgbHexValue = checkedRgbHexValue;

		activeDocument = application.activeDocument;
		colorSamplePosition.initialize(activeDocument);
		var activeLayer = activeDocument.activeLayer;

		layersDisplay = new LayersDisplay(activeDocument.layers);
		layersDisplay.hide();

		if(!cast(activeLayer, ArtLayer).isBackgroundLayer)
			activeLayer.visible = true;

		bounds = activeLayer.bounds.convert();

		positionX = Std.int(bounds.left);
		positionY = Std.int(bounds.top);
		event = PixelColorSearchEvent.NONE;
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
					if(rgbHexValue == checkedRgbHexValue)
					{
						colorSampler.remove();
						selectSimilar(x, y);
						destroy(PixelColorSearchEvent.SELECTED(x, y));
						return;
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
		destroy(PixelColorSearchEvent.UNSELECTED);
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
	private function selectSimilar(x:Int, y:Int)
	{
		activeDocument.selection.deselect();
		selectPixel(x, y);
		activeDocument.selection.similar(0, false);
	}
	private function selectPixel(x:Int, y:Int)
	{
		activeDocument.selection.select([[x, y], [x+1, y], [x+1, y+1], [x, y+1]]);
	}

	private function destroy(event:PixelColorSearchEvent)
	{
		this.event = event;
		layersDisplay.restore();
		mainFunction = finish;
	}
	private function finish(){}
	public function interrupt()
	{
		layersDisplay.restore();
	}
}

private class PixelColorSearchTest
{
	public static function execute()
	{
		var pixelColorSearch = new PixelColorSearch();
		var errorEvent:PixelSelectorInitialErrorEvent = Unserializer.run(pixelColorSearch.getInitialErrorEvent());
		switch(errorEvent)
		{
			case PixelSelectorInitialErrorEvent.ERROR(message):
				js.Lib.alert(message);
				return;
			case PixelSelectorInitialErrorEvent.NONE: "";
		}

		var checkedRgbHexColor = "FF0000";
		pixelColorSearch.initialize(checkedRgbHexColor);

		var i = 0;
		while(i < 100){
			pixelColorSearch.run();
			var result = pixelColorSearch.getSerializedEvent();
			var event:PixelColorSearchEvent = Unserializer.run(result);
			switch(event)
			{
				case PixelColorSearchEvent.NONE: "";
				case PixelColorSearchEvent.UNSELECTED:
					js.Lib.alert("unselected");
					break;
				case PixelColorSearchEvent.SELECTED:
					js.Lib.alert("selected!");
					break;
			}
		}
	}
}