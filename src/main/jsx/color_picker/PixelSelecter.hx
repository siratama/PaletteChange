package jsx.color_picker;

import common.PixelSelecterEvent;
import haxe.Serializer;
import haxe.Unserializer;
import jsx.color_picker.PixelSelecter;
import common.PixelSelecterEvent;
import haxe.Serializer;
import common.PixelSelecterEvent.PixelSelecterInitialErrorEvent;
import jsx.util.ColorSamplePosition;
import psd.Application;
import psd.Document;
import psd.Lib.app;

@:native("PixelSelecter")
class PixelSelecter
{
	private var application:Application;
	private var activeDocument:Document;
	private var colorSamplePosition:ColorSamplePosition;

	public static function main()
	{
		PixelSelecterTest.execute();
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
				PixelSelecterInitialErrorEvent.ERROR("Open document."):
				PixelSelecterInitialErrorEvent.NONE;

		return Serializer.run(event);
	}
	public function execute(rgbHexValue:String, positionX:Int, positionY:Int):String
	{
		activeDocument = application.activeDocument;
		colorSamplePosition.initialize(activeDocument);

		var event = PixelSelecterEvent.UNSELECTED;

		var adjustX = colorSamplePosition.getAdjustX(positionX);
		var adjustY = colorSamplePosition.getAdjustY(positionY);
		var colorSampler = activeDocument.colorSamplers.add([adjustX, adjustY]);

		try{
			var checkedRgbHexValue = colorSampler.color.rgb.hexValue;
			if(rgbHexValue == checkedRgbHexValue){

				activeDocument.selection.deselect();
				selectPixel(positionX, positionX);
				activeDocument.selection.similar(0, false);

				event = PixelSelecterEvent.SELECTED;
			}

		//colorSampler.color is transparent
		}catch(error:Dynamic){}

		colorSampler.remove();

		return Serializer.run(event);
	}
	private function selectPixel(x:Int, y:Int)
	{
		activeDocument.selection.select([[x, y], [x+1, y], [x+1, y+1], [x, y+1]]);
	}
}

private class PixelSelecterTest
{
	public static function execute()
	{
		var pixelSelecter = new PixelSelecter();
		var errorEvent:PixelSelecterInitialErrorEvent = Unserializer.run(pixelSelecter.getInitialErrorEvent());
		switch(errorEvent)
		{
			case PixelSelecterInitialErrorEvent.ERROR(message):
				js.Lib.alert(message);
				return;
			case PixelSelecterInitialErrorEvent.NONE: "";
		}

		var result = pixelSelecter.execute("FF0000", 0, 0);
		var event:PixelSelecterEvent = Unserializer.run(result);
		js.Lib.alert(event);
	}
}
