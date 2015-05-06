package extension;
import extension.CanvasColorSamplerRunner.JsxEvent;
import haxe.Unserializer;
import common.CanvasColorSamplerEvent;
import csinterface.CSInterface.AbstractCSInterface;
import extension.color_sampler.CanvasColorSampler;
import extension.overlay.OverlayWindow;
import common.ClassName;
import extension.color_sampler.palette.PaletteKind;

enum JsxEvent{
	NONE;
	GOTTEN(serializedEvent:String);
}
class CanvasColorSamplerRunner
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private var overlayWindow:OverlayWindow;

	private var canvasColorSampler:CanvasColorSampler;
	private var jsxEvent:JsxEvent;
	private var clickedPaletteKind:PaletteKind;

	private static inline var CANVAS_COLOR_SAMPLER_INSTANCE_NAME = "canvasColorSampler";

	public function new()
	{
		csInterface = AbstractCSInterface.create();
		canvasColorSampler = CanvasColorSampler.instance;
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
		csInterface.evalScript('var $CANVAS_COLOR_SAMPLER_INSTANCE_NAME = new ${ClassName.CANVAS_COLOR_SAMPLER}();');
		csInterface.evalScript('$CANVAS_COLOR_SAMPLER_INSTANCE_NAME.getInitialErrorEvent();', function(result){
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
		csInterface.evalScript('$CANVAS_COLOR_SAMPLER_INSTANCE_NAME.initialize();');
		mainFunction = sample;
	}
	private function sample()
	{
		if(overlayWindow.cancelButton.isClicked())
		{
			csInterface.evalScript('$CANVAS_COLOR_SAMPLER_INSTANCE_NAME.interrupt();');
			destroy();
		}
		else{
			jsxEvent = JsxEvent.NONE;
			csInterface.evalScript('$CANVAS_COLOR_SAMPLER_INSTANCE_NAME.run();');
			csInterface.evalScript('$CANVAS_COLOR_SAMPLER_INSTANCE_NAME.getSerializedEvent();', function(result){
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

					case CanvasColorSamplerEvent.RESULT(rgbHexColorSet):
						switch(clickedPaletteKind){
							case PaletteKind.BEFORE:
								canvasColorSampler.palletContainer.before.palette.updateRgbHexColorSet(rgbHexColorSet);
							case PaletteKind.AFTER:
								canvasColorSampler.palletContainer.after.palette.updateRgbHexColorSet(rgbHexColorSet);
						}
						canvasColorSampler.updatePageIndex();
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
