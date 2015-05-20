package extension.color_picker;

import common.PixelColor;
import common.ClassName;
import extension.overlay.OverlayWindow;
import common.JsxEvent;
import common.PixelColorSearchEvent;
import haxe.Unserializer;

enum PixelColorSearchRunnerEvent
{
	NONE;
	ERROR(message:String);
	CANCEL;
	UNSELECTED;
	SELECTED(pixelColor:PixelColor);
}
class PixelColorSearchRunner
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private var jsxEvent:JsxEvent;
	private var overlayWindow:OverlayWindow;
	private var searchedRgbHexValue:String;

	private static inline var INSTANCE_NAME = "pixelColorSearch";

	private var event:PixelColorSearchRunnerEvent;
	public function getEvent():PixelColorSearchRunnerEvent
	{
		var n = event;
		event = PixelColorSearchRunnerEvent.NONE;
		return n;
	}

	public function new()
	{
		csInterface = AbstractCSInterface.create();
		overlayWindow = OverlayWindow.instance;
	}
	public function run()
	{
		mainFunction();
	}
	public function call(searchedRgbHexValue:String)
	{
		this.searchedRgbHexValue = searchedRgbHexValue;
		overlayWindow.showCanvasColorSamplerRunning();

		jsxEvent = JsxEvent.NONE;
		csInterface.evalScript('var $INSTANCE_NAME = new ${ClassName.PIXEL_COLOR_SEARCH}();');
		csInterface.evalScript('$INSTANCE_NAME.getInitialErrorEvent();', function(result){
			jsxEvent = JsxEvent.GOTTEN(result);
		});

		mainFunction = observeToRecieveInitialErrorEvent;
	}
	private function observeToRecieveInitialErrorEvent()
	{
		switch(recieveJsxEvent())
		{
			case JsxEvent.NONE: return;
			case JsxEvent.GOTTEN(serializedEvent):
				var initialErrorEvent:PixelColorSearchInitialErrorEvent = Unserializer.run(serializedEvent);
				switch(initialErrorEvent)
				{
					case PixelColorSearchInitialErrorEvent.ERROR(message):
						destroy(PixelColorSearchRunnerEvent.ERROR(message));
					case PixelColorSearchInitialErrorEvent.NONE:
						initializeToSearch();
				}
		}
	}
	private function initializeToSearch()
	{
		event = PixelColorSearchRunnerEvent.NONE;
		csInterface.evalScript('$INSTANCE_NAME.initialize("$searchedRgbHexValue");');
		mainFunction = search;
	}
	private function search()
	{
		if(overlayWindow.cancelButton.isClicked())
		{
			csInterface.evalScript('$INSTANCE_NAME.interrupt();');
			destroy(PixelColorSearchRunnerEvent.CANCEL);
		}
		else{
			jsxEvent = JsxEvent.NONE;
			csInterface.evalScript('$INSTANCE_NAME.run();');
			csInterface.evalScript('$INSTANCE_NAME.getSerializedEvent();', function(result){
				jsxEvent = JsxEvent.GOTTEN(result);
			});
			mainFunction = observeToSearch;
		}
	}
	private function observeToSearch()
	{
		switch(recieveJsxEvent())
		{
			case JsxEvent.NONE: return;
			case JsxEvent.GOTTEN(serializedEvent):
				var pixelColorSearchEvent:PixelColorSearchEvent = Unserializer.run(serializedEvent);
				switch(pixelColorSearchEvent){
					case PixelColorSearchEvent.NONE:
						mainFunction = search;

					case PixelColorSearchEvent.UNSELECTED:
						destroy(PixelColorSearchRunnerEvent.UNSELECTED);

					case PixelColorSearchEvent.SELECTED(x, y):
						var pixelColor = PixelColor.create(searchedRgbHexValue, x, y);
						destroy(PixelColorSearchRunnerEvent.SELECTED(pixelColor));
				}
		}
	}
	private function recieveJsxEvent():JsxEvent
	{
		var n = jsxEvent;
		jsxEvent = JsxEvent.NONE;
		return n;
	}
	private function destroy(event:PixelColorSearchRunnerEvent)
	{
		this.event = event;
		overlayWindow.hide();
		mainFunction = finish;
	}
	private function finish(){}
}
