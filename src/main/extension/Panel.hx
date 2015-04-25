package extension;

import extension.pallet_changer.PaletteChanger;
import extension.color_sampler.CanvasColorSampler;
import csinterface.CSInterface;
import common.ClassName;
import js.Browser;

class Panel
{
	private static inline var INSTANCE_NAME = "main";
	private var csInterface:AbstractCSInterface;

	private var canvasColorSampler:CanvasColorSampler;
	private var palletChanger:PaletteChanger;

	public static function main(){
		new Panel();
	}
	public function new(){
		Browser.window.addEventListener("load", initialize);
	}
	private function initialize(event)
	{
		csInterface = AbstractCSInterface.create();

		canvasColorSampler = new CanvasColorSampler();
		palletChanger = new PaletteChanger();
	}

	private function callCanvasColorSampler()
	{
		csInterface.evalScript('new ${ClassName.CANVAS_COLOR_SAMPLER}();', function(data){

		});
	}

	private function callPalletChanger()
	{
		var rgbHexValueCSV:String = "";
		csInterface.evalScript('new ${ClassName.PALLET_CHANGER}($rgbHexValueCSV);', function(data){

		});
	}
}
