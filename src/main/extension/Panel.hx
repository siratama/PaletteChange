package extension;

import common.PixelColor;
import extension.color_picker.ColorPickerUI;
import adobe.cep.CSEventType;
import adobe.cep.CSEventScope;
import adobe.cep.CSEvent;
import extension.overlay.OverlayWindow;
import extension.option.Setting;
import extension.color_sampler.palette.PaletteKind;
import extension.palette_change.PaletteChangeUI;
import extension.color_sampler.CanvasColorSamplerUI;
import js.Browser;
import haxe.Timer;

class Panel
{
	private var timer:Timer;
	private static inline var TIMER_SPEED_CALM = 250;
	private static inline var TIMER_SPEED_RUNNING = 50;

	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private var jsxLoader:JsxLoader;

	private var colorPicker:ColorPickerUI;
	private var selectedPaletteKind:PaletteKind;

	private var canvasColorSamplerRunner:CanvasColorSamplerRunner;
	private var canvasColorSamplerUI:CanvasColorSamplerUI;

	private var paletteChangeRunner:PaletteChangeRunner;
	private var paletteChangeUI:PaletteChangeUI;

	public static function main(){
		new Panel();
	}
	public function new(){
		Browser.window.addEventListener("load", initialize);
	}
	private function initialize(event)
	{
		csInterface = AbstractCSInterface.create();
		setPersistent();
		jsxLoader = new JsxLoader();

		canvasColorSamplerUI = CanvasColorSamplerUI.instance;
		paletteChangeUI = PaletteChangeUI.instance;
		Setting.instance;
		OverlayWindow.instance;
		canvasColorSamplerRunner = new CanvasColorSamplerRunner();
		paletteChangeRunner = new PaletteChangeRunner();
		colorPicker = new ColorPickerUI();

		startRunning(loadJsx, TIMER_SPEED_RUNNING);
	}
	private function setPersistent()
	{
		var csEvent = new CSEvent();
		csEvent.type = CSEventType.PERSISTENT;
		csEvent.scope = CSEventScope.APPLICATION;
		csEvent.extensionId = untyped window.__adobe_cep__.getExtensionId();
		csInterface.csInterface.dispatchEvent(csEvent);
	}

	//
	private function startRunning(func:Void -> Void, speed:Int){
		mainFunction = func;
		setTimer(speed);
	}
	private function changeRunning(func:Void -> Void, speed:Int){
		timer.stop();
		startRunning(func, speed);
	}
	private function setTimer(speed:Int){
		timer = new Timer(speed);
		timer.run = run;
	}
	private function run(){
		mainFunction();
	}

	//
	private function loadJsx()
	{
		jsxLoader.run();
		if(jsxLoader.isFinished()){
			initializeToClickUI();
		}
	}

	//
	private function initializeToClickUI()
	{
		changeRunning(observeToClickUI, TIMER_SPEED_CALM);
	}
	private function observeToClickUI()
	{
		canvasColorSamplerUI.run();
		if(canvasColorSamplerUI.paletteContainer.before.scanButton.isClicked()){
			initializeToCallCanvasColorSampler(PaletteKind.BEFORE);
		}
		else if(canvasColorSamplerUI.paletteContainer.after.scanButton.isClicked()){
			initializeToCallCanvasColorSampler(PaletteKind.AFTER);
		}
		else if(paletteChangeUI.runButton.isClicked()){
			initializeToCallPaletteChange();
		}
		else if(canvasColorSamplerUI.paletteContainer.before.palette.searchClickedCell()){
			initializeToCallColorPicker(PaletteKind.BEFORE,
				canvasColorSamplerUI.paletteContainer.before.palette.clickedCell.pixelColor);
		}
		else if(canvasColorSamplerUI.paletteContainer.after.palette.searchClickedCell()){
			initializeToCallColorPicker(PaletteKind.AFTER,
				canvasColorSamplerUI.paletteContainer.after.palette.clickedCell.pixelColor);
		}
	}
	//
	private function initializeToCallColorPicker(paletteKind:PaletteKind, pixelColor:PixelColor)
	{
		this.selectedPaletteKind = paletteKind;
		colorPicker.show(pixelColor);
		changeRunning(callColorPicker, TIMER_SPEED_RUNNING);
	}
	private function callColorPicker()
	{
		var event = colorPicker.getEvent();
		switch(event){
			case ColorPickerUIEvent.NONE: return;

			case ColorPickerUIEvent.ERROR(message):
				js.Lib.alert(message);
			case ColorPickerUIEvent.DIALOG_CANCELLED_STILL_TRANSPARENT:
				initializeToClickUI();

			case ColorPickerUIEvent.CLOSED(pixelColor):
				canvasColorSamplerUI.changeCellColor(selectedPaletteKind, pixelColor);
				initializeToClickUI();
		}
	}

	//
	private function initializeToCallCanvasColorSampler(paletteKind:PaletteKind)
	{
		canvasColorSamplerRunner.call(paletteKind);
		changeRunning(callCanvasColorSampler, TIMER_SPEED_RUNNING);
	}
	private function callCanvasColorSampler()
	{
		canvasColorSamplerRunner.run();
		if(canvasColorSamplerRunner.isFinished()){
			initializeToClickUI();
		}
	}

	//
	private function initializeToCallPaletteChange()
	{
		var rgbHexValueSets = canvasColorSamplerUI.paletteContainer.getRgbHexValueSets();
		paletteChangeRunner.call(rgbHexValueSets);
		changeRunning(callPaletteChange, TIMER_SPEED_RUNNING);
	}
	private function callPaletteChange()
	{
		paletteChangeRunner.run();
		if(paletteChangeRunner.isFinished()){
			initializeToClickUI();
		}
	}
}

