package extension.color_picker;

import common.PixelColor;
import common.PixelSelectorEvent;
import common.PixelSelectorEvent.PixelSelectorInitialErrorEvent;
import common.ClassName;
import common.JsxEvent;
import haxe.Serializer;
import haxe.Unserializer;

enum PixelSelectorRunnerEvent
{
	NONE;
	ERROR(message:String);
	FINISH(pixelSelectorEvent:PixelSelectorEvent);
}

class PixelSelectorRunner
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private var jsxEvent:JsxEvent;
	private var selectedPixelColor:PixelColor;

	private var event:PixelSelectorRunnerEvent;
	public function getEvent():PixelSelectorRunnerEvent
	{
		var n = event;
		event = PixelSelectorRunnerEvent.NONE;
		return n;
	}

	private static inline var INSTANCE_NAME = "pixelSelector";

	public function new()
	{
		csInterface = AbstractCSInterface.create();
	}
	public function run()
	{
		mainFunction();
	}
	public function call(selectedPixelColor:PixelColor)
	{
		this.selectedPixelColor = selectedPixelColor;

		jsxEvent = JsxEvent.NONE;
		csInterface.evalScript('var $INSTANCE_NAME = new ${ClassName.PIXEL_SELECTOR}();');
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
				var initialErrorEvent:PixelSelectorInitialErrorEvent = Unserializer.run(serializedEvent);
				switch(initialErrorEvent)
				{
					case PixelSelectorInitialErrorEvent.ERROR(message):
						destroy(PixelSelectorRunnerEvent.ERROR(message));
					case PixelSelectorInitialErrorEvent.NONE:
						select();
				}
		}
	}
	private function select()
	{
		var serializedPixelColor = Serializer.run(selectedPixelColor);

		jsxEvent = JsxEvent.NONE;
		event = PixelSelectorRunnerEvent.NONE;
		csInterface.evalScript('$INSTANCE_NAME.execute("$serializedPixelColor");', function(result){
			jsxEvent = JsxEvent.GOTTEN(result);
		});
		mainFunction = observeToSelect;
	}
	private function observeToSelect()
	{
		switch(recieveJsxEvent())
		{
			case JsxEvent.NONE: return;
			case JsxEvent.GOTTEN(serializedEvent):
				var pixelSelectorEvent:PixelSelectorEvent = Unserializer.run(serializedEvent);
				destroy(PixelSelectorRunnerEvent.FINISH(pixelSelectorEvent));
		}
	}
	private function recieveJsxEvent():JsxEvent
	{
		var n = jsxEvent;
		jsxEvent = JsxEvent.NONE;
		return n;
	}
	private function destroy(event:PixelSelectorRunnerEvent)
	{
		this.event = event;
		mainFunction = finish;
	}
	private function finish(){}
}
