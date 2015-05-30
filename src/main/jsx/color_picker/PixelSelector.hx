package jsx.color_picker;

import psd.LayerTypeName;
import psd.ArtLayer;
import jsx.util.LayersDisplay;
import common.PixelColor;
import common.PixelSelectorEvent;
import haxe.Serializer;
import haxe.Unserializer;
import jsx.color_picker.PixelSelector;
import common.PixelSelectorEvent;
import haxe.Serializer;
import common.PixelSelectorEvent.PixelSelectorInitialErrorEvent;
import jsx.util.ColorSamplePosition;
import psd.Application;
import psd.Document;
import psd.Lib.app;

using jsx.util.ErrorChecker;

@:keep
@:native("PixelSelector")
class PixelSelector
{
	private var application:Application;
	private var activeDocument:Document;
	private var colorSamplePosition:ColorSamplePosition;
	private var layersDisplay:LayersDisplay;

	public static function main()
	{
		PixelSelectorTest.execute();
	}
	public function new()
	{
		application = app;
		colorSamplePosition = new ColorSamplePosition();
	}
	public function getInitialErrorEvent():String
	{
		var event =
			(application.documents.length == 0) ?
				PixelSelectorInitialErrorEvent.ERROR("Open document."):
			(application.activeDocument.activeLayer.typename == LayerTypeName.LAYER_SET) ?
				PixelSelectorInitialErrorEvent.SELECTED_LAYER_SET:
			(!application.activeDocument.isSelectedSingleLayer()) ?
				PixelSelectorInitialErrorEvent.UNSELECTED_SINGLE_LAYER:
				PixelSelectorInitialErrorEvent.NONE;

		return Serializer.run(event);
	}

	public function execute(serializedPixelColor:String):String
	{
		var pixelColor:PixelColor = Unserializer.run(serializedPixelColor);

		activeDocument = application.activeDocument;
		colorSamplePosition.initialize(activeDocument);
		var activeLayer = activeDocument.activeLayer;

		layersDisplay = new LayersDisplay(activeDocument.layers);
		layersDisplay.hide();

		if(!cast(activeLayer, ArtLayer).isBackgroundLayer)
			activeLayer.visible = true;

		var event = PixelSelectorEvent.UNSELECTED;

		var adjustX = colorSamplePosition.getAdjustX(pixelColor.x);
		var adjustY = colorSamplePosition.getAdjustY(pixelColor.y);
		var colorSampler = activeDocument.colorSamplers.add([adjustX, adjustY]);

		try{
			var checkedRgbHexValue = colorSampler.color.rgb.hexValue;
			if(pixelColor.rgbHexValue == checkedRgbHexValue){

				activeDocument.selection.deselect();
				selectPixel(pixelColor.x, pixelColor.y);
				activeDocument.selection.similar(0, false);

				event = PixelSelectorEvent.SELECTED;
			}

		//colorSampler.color is transparent
		}catch(error:Dynamic){}

		colorSampler.remove();
		layersDisplay.restore();

		return Serializer.run(event);
	}
	private function selectPixel(x:Int, y:Int)
	{
		activeDocument.selection.select([[x, y], [x+1, y], [x+1, y+1], [x, y+1]]);
	}
}

private class PixelSelectorTest
{
	public static function execute()
	{
		var pixelSelecter = new PixelSelector();
		var errorEvent:PixelSelectorInitialErrorEvent = Unserializer.run(pixelSelecter.getInitialErrorEvent());
		switch(errorEvent)
		{
			case PixelSelectorInitialErrorEvent.ERROR(message):
				js.Lib.alert(message);
				return;
			case PixelSelectorInitialErrorEvent.SELECTED_LAYER_SET:
				js.Lib.alert("selected layer set");
				return;
			case PixelSelectorInitialErrorEvent.UNSELECTED_SINGLE_LAYER:
				js.Lib.alert("unselected any layer");
				return;
			case PixelSelectorInitialErrorEvent.NONE: "";
		}

		var pixelColor = PixelColor.create("FF0000", 0, 0);
		var serializedPixelColor = Serializer.run(pixelColor);
		var result = pixelSelecter.execute(serializedPixelColor);
		var event:PixelSelectorEvent = Unserializer.run(result);
		js.Lib.alert(event);
	}
}
