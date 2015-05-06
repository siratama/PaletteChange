package extension;

import extension.overlay.OverlayWindow;
import extension.option.Setting;
import common.PaletteChangeEvent;
import common.ClassName;
import extension.color_sampler.palette.PaletteKind;
import extension.palette_change.PaletteChange;
import extension.color_sampler.CanvasColorSampler;
import csinterface.CSInterface;
import js.Browser;
import haxe.Unserializer;
import haxe.Serializer;
import haxe.Timer;

class Panel
{
	private var csInterface:AbstractCSInterface;
	private var timer:Timer;
	private var mainFunction:Void->Void;
	private var jsxLoader:JsxLoader;
	private var overlayWindow:OverlayWindow;
	private var canvasColorSamplerRunner:CanvasColorSamplerRunner;

	private var canvasColorSampler:CanvasColorSampler;

	private var paletteChange:PaletteChange;
	private var paletteChangeEvent:PaletteChangeEvent;

	private static inline var PALETTE_CHANGE_INSTANCE_NAME = "paletteChange";


	public static function main(){
		new Panel();
	}
	public function new(){
		Browser.window.addEventListener("load", initialize);
	}
	private function initialize(event)
	{
		csInterface = AbstractCSInterface.create();

		jsxLoader = new JsxLoader();

		canvasColorSampler = CanvasColorSampler.instance;
		paletteChange = new PaletteChange();
		Setting.instance;
		overlayWindow = OverlayWindow.instance;
		canvasColorSamplerRunner = new CanvasColorSamplerRunner();

		mainFunction = loadJsx;
		timer = new Timer(100);
		timer.run = run;
	}
	private function run()
	{
		mainFunction();
	}
	private function loadJsx()
	{
		jsxLoader.run();
		if(jsxLoader.isFinished()){
			mainFunction = observeToClickUI;
		}
	}

	//
	private function observeToClickUI()
	{
		canvasColorSampler.run();
		if(canvasColorSampler.palletContainer.before.scanButton.isClicked()){
			initializeToCallCanvasColorSampler(PaletteKind.BEFORE);
		}
		else if(canvasColorSampler.palletContainer.after.scanButton.isClicked()){
			initializeToCallCanvasColorSampler(PaletteKind.AFTER);
		}
		else if(paletteChange.runButton.isClicked())
		{
			callPaletteChange();
		}
	}

	//
	private function initializeToCallCanvasColorSampler(paletteKind:PaletteKind)
	{
		canvasColorSamplerRunner.call(paletteKind);
		mainFunction = callCanvasColorSampler;
	}
	private function callCanvasColorSampler()
	{
		canvasColorSamplerRunner.run();
		if(canvasColorSamplerRunner.isFinished()){
			mainFunction = observeToClickUI;
		}
	}


	//
	private function callPaletteChange()
	{
		var rgbHexValueSets:Array<Array<String>> = canvasColorSampler.palletContainer.getRgbHexValueSets();
		var data = Serializer.run(rgbHexValueSets);

		paletteChangeEvent = PaletteChangeEvent.NONE;
		csInterface.evalScript('var $PALETTE_CHANGE_INSTANCE_NAME = new ${ClassName.PALETTE_CHANGE}($data);');
		csInterface.evalScript('$PALETTE_CHANGE_INSTANCE_NAME.execute($data);', function(result){
			paletteChangeEvent = Unserializer.run(result);
		});

		mainFunction = changePalette;
	}
	private function getPaletteChangeEvent():PaletteChangeEvent
	{
		var n = paletteChangeEvent;
		paletteChangeEvent = PaletteChangeEvent.NONE;
		return n;
	}
	private function changePalette()
	{
		var event = getPaletteChangeEvent();
		switch(event)
		{
			case PaletteChangeEvent.NONE: return;
			case PaletteChangeEvent.SUCCESS:
				mainFunction = observeToClickUI;
		}
	}
}

