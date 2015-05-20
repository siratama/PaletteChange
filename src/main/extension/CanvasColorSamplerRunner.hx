package extension;
import common.JsxEvent;
import haxe.Unserializer;
import common.CanvasColorSamplerEvent;
import extension.color_sampler.CanvasColorSamplerUI;
import extension.overlay.OverlayWindow;
import common.ClassName;
import extension.color_sampler.palette.PaletteKind;

class CanvasColorSamplerRunner
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private var overlayWindow:OverlayWindow;

	private var canvasColorSamplerUI:CanvasColorSamplerUI;
	private var jsxEvent:JsxEvent;
	private var clickedPaletteKind:PaletteKind;

	private static inline var INSTANCE_NAME = "canvasColorSampler";

	public function new()
	{
		csInterface = AbstractCSInterface.create();
		canvasColorSamplerUI = CanvasColorSamplerUI.instance;
		overlayWindow = OverlayWindow.instance;
	}
	public function run()
	{
		mainFunction();
	}

	public function call(clickedPaletteKind:PaletteKind)
	{
		this.clickedPaletteKind = clickedPaletteKind;
		overlayWindow.showCanvasColorSamplerRunning();

		jsxEvent = JsxEvent.NONE;
		csInterface.evalScript('var $INSTANCE_NAME = new ${ClassName.CANVAS_COLOR_SAMPLER}();');
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
				var initialErrorEvent:CanvasColorSamplerInitialErrorEvent = Unserializer.run(serializedEvent);
				switch(initialErrorEvent)
				{
					case CanvasColorSamplerInitialErrorEvent.ERROR(message):
						js.Lib.alert(message);
						destroy();
					case CanvasColorSamplerInitialErrorEvent.NONE:
						initializeToSample();
				}
		}
	}
	private function initializeToSample()
	{
		csInterface.evalScript('$INSTANCE_NAME.initialize();');
		mainFunction = sample;
	}
	private function sample()
	{
		if(overlayWindow.cancelButton.isClicked())
		{
			csInterface.evalScript('$INSTANCE_NAME.interrupt();');
			destroy();
		}
		else{
			jsxEvent = JsxEvent.NONE;
			csInterface.evalScript('$INSTANCE_NAME.run();');
			csInterface.evalScript('$INSTANCE_NAME.getSerializedEvent();', function(result){
				jsxEvent = JsxEvent.GOTTEN(result);
			});
			mainFunction = observeToSample;
		}
	}
	private function observeToSample()
	{
		switch(recieveJsxEvent())
		{
			case JsxEvent.NONE: return;
			case JsxEvent.GOTTEN(serializedEvent):
				var canvasColorSamplerEvent:CanvasColorSamplerEvent = Unserializer.run(serializedEvent);

				switch(canvasColorSamplerEvent){
					case CanvasColorSamplerEvent.NONE:
						mainFunction = sample;

					case CanvasColorSamplerEvent.RESULT(pixelColorSet):
						switch(clickedPaletteKind){
							case PaletteKind.BEFORE:
								canvasColorSamplerUI.paletteContainer.before.palette.addColorSet(pixelColorSet);
							case PaletteKind.AFTER:
								canvasColorSamplerUI.paletteContainer.after.palette.addColorSet(pixelColorSet);
						}
						canvasColorSamplerUI.updatePageIndex();
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
