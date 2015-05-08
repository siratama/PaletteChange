package extension;
import common.PaletteChangeEvent.PaletteChangeInitialErrorEvent;
import haxe.Unserializer;
import common.ClassName;
import common.PaletteChangeEvent;
import haxe.Serializer;
import extension.palette_change.PaletteChangeUI;
import common.JsxEvent;
import extension.overlay.OverlayWindow;
import csinterface.CSInterface.AbstractCSInterface;
class PaletteChangeRunner
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private var overlayWindow:OverlayWindow;
	private var jsxEvent:JsxEvent;
	private var paletteChangeUI:PaletteChangeUI;
	private var rgbHexValueSets:Array<Array<String>>;
	private static inline var PALETTE_CHANGE_INSTANCE_NAME = "paletteChange";

	public function new()
	{
		csInterface = AbstractCSInterface.create();
		paletteChangeUI = PaletteChangeUI.instance;
		overlayWindow = OverlayWindow.instance;
	}
	public function run()
	{
		mainFunction();
	}

	public function call(rgbHexValueSets:Array<Array<String>>)
	{
		this.rgbHexValueSets = rgbHexValueSets;

		overlayWindow.showPaletteChangeRunning();

		jsxEvent = JsxEvent.NONE;
		csInterface.evalScript('var $PALETTE_CHANGE_INSTANCE_NAME = new ${ClassName.PALETTE_CHANGE}();');
		csInterface.evalScript('$PALETTE_CHANGE_INSTANCE_NAME.getInitialErrorEvent();', function(result){
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
				var initialErrorEvent:PaletteChangeInitialErrorEvent = Unserializer.run(serializedEvent);
				switch(initialErrorEvent)
				{
					case PaletteChangeInitialErrorEvent.ERROR(message):
						js.Lib.alert(message);
						destroy();
					case PaletteChangeInitialErrorEvent.NONE:
						initializeToChangePalette();
				}
		}
	}

	private function initializeToChangePalette()
	{
		var data = Serializer.run(rgbHexValueSets);
		csInterface.evalScript('$PALETTE_CHANGE_INSTANCE_NAME.execute("$data");');
		mainFunction = changePalette;
	}
	private function changePalette()
	{
		if(overlayWindow.cancelButton.isClicked())
		{
			csInterface.evalScript('$PALETTE_CHANGE_INSTANCE_NAME.interrupt();');
			destroy();
		}
		else{
			jsxEvent = JsxEvent.NONE;
			csInterface.evalScript('$PALETTE_CHANGE_INSTANCE_NAME.run();');
			csInterface.evalScript('$PALETTE_CHANGE_INSTANCE_NAME.getSerializedEvent();', function(result){
				jsxEvent = JsxEvent.GOTTEN(result);
			});
			mainFunction = observeToChangePalette;
		}
	}
	private function observeToChangePalette()
	{
		switch(recieveJsxEvent())
		{
			case JsxEvent.NONE: return;
			case JsxEvent.GOTTEN(serializedEvent):
				var event:PaletteChangeEvent = Unserializer.run(serializedEvent);
				switch(event){
					case PaletteChangeEvent.NONE:
						mainFunction = changePalette;
					case PaletteChangeEvent.SUCCESS:
						destroy();
				}
		}
	}
	private function recieveJsxEvent():JsxEvent
	{
		var n = jsxEvent;
		jsxEvent = JsxEvent.NONE;
		return n;
	}
	private function destroy()
	{
		overlayWindow.hide();
		mainFunction = finish;
	}
	private function finish(){}
	public function isFinished():Bool
		return Reflect.compareMethods(mainFunction, finish);
}
