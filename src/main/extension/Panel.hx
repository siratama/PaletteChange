package extension;

import common.PalletChangeEvent;
import common.CanvasColorSamplerEvent;
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

	private var canvasColorSampler:CanvasColorSampler;
	private var canvasColorSamplerEvent:CanvasColorSamplerEvent;
	private var clickedPaletteKind:PaletteKind;

	private var paletteChange:PaletteChange;
	private var paletteChangeEvent:PalletChangeEvent;

	public static function main(){
		new Panel();
	}
	public function new(){
		Browser.window.addEventListener("load", initialize);
	}
	private function initialize(event)
	{
		//csInterface = AbstractCSInterface.create();

		canvasColorSampler = new CanvasColorSampler();
		paletteChange = new PaletteChange();

		mainFunction = observeToClickUI;
		timer = new Timer(100);
		timer.run = run;
	}
	private function run()
	{
		mainFunction();
	}

	//
	private function observeToClickUI()
	{
		canvasColorSampler.run();
		if(canvasColorSampler.palletContainer.before.scanButton.isClicked()){
			callCanvasColorSampler(PaletteKind.BEFORE);
		}
		else if(canvasColorSampler.palletContainer.after.scanButton.isClicked()){
			callCanvasColorSampler(PaletteKind.AFTER);
		}

		else if(paletteChange.runButton.isClicked())
		{
			callPaletteChange(canvasColorSampler.palletContainer.getRgbHexValueSets());
		}
	}

	//
	private function callCanvasColorSampler(clickedPaletteKind:PaletteKind)
	{
		this.clickedPaletteKind = clickedPaletteKind;

		/*
		csInterface.evalScript('new ${ClassName.CANVAS_COLOR_SAMPLER}();', function(data){
			canvasColorSamplerEvent = Unserializer.run(data);
		});
		*/

		//test
		var test = ["ff0000", "00ff00", "0000ff"];
		var data = Serializer.run(test);
		canvasColorSamplerEvent = Unserializer.run(data);

		mainFunction = sampleCanvasColor;
	}
	private function getCanvasColorSamplerEvent():CanvasColorSamplerEvent
	{
		var n = canvasColorSamplerEvent;
		canvasColorSamplerEvent = CanvasColorSamplerEvent.NONE;
		return n;
	}
	private function sampleCanvasColor()
	{
		var event = getCanvasColorSamplerEvent();
		switch(event)
		{
			case CanvasColorSamplerEvent.NONE: return;
			case CanvasColorSamplerEvent.RESULT(rgbHexColorSet):
				switch(clickedPaletteKind){
					case PaletteKind.BEFORE:
						canvasColorSampler.palletContainer.before.palette.addRgbHexColorSet(rgbHexColorSet);
					case PaletteKind.AFTER:
						canvasColorSampler.palletContainer.after.palette.addRgbHexColorSet(rgbHexColorSet);
				}
		}
		canvasColorSampler.updatePageIndex();
		mainFunction = observeToClickUI;
	}

	//
	private function callPaletteChange(rgbHexValueSets:Array<Array<String>>)
	{
		var data = Serializer.run(rgbHexValueSets);

		csInterface.evalScript('new ${ClassName.PALETTE_CHANGE}($data);', function(data){
			paletteChangeEvent = Unserializer.run(data);
		});

		mainFunction = changePalette;
	}
	private function getPaletteChangeEvent():PalletChangeEvent
	{
		var n = paletteChangeEvent;
		paletteChangeEvent = PalletChangeEvent.NONE;
		return n;
	}
	private function changePalette()
	{
		var event = getPaletteChangeEvent();
		switch(event)
		{
			case PalletChangeEvent.NONE: return;
			case PalletChangeEvent.RESULT:
				mainFunction = observeToClickUI;
		}
	}
}
