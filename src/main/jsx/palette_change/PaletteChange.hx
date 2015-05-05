package jsx.palette_change;

import haxe.Serializer;
import haxe.Serializer;
import common.PalletChangeEvent;
import psd.Application;

class PaletteChange
{
	private static inline var ATTENTION_WIDTH = 400;
	private static inline var ATTENTION_HEIGHT = 400;

	private var application:Application;
	private var palletInfo:PaletteInfo;

	public static function main()
	{
		//new PalletChanger();
	}

	public function new()
	{
		application = untyped app;
		palletInfo = PaletteInfo.instance;
		js.Lib.alert(application);
	}

	/**
	 * @code serialized: [[000000,000000,000000, ...], [000000,000000,000000, ...]]
	 */
	public function execute(code:String):String
	{
		palletInfo.convert(code);
		if(!palletInfo.parsedResult){
			return Serializer.run(PalletChangeEvent.ERROR("code error"));
		}
		new Converter();
		return Serializer.run(PalletChangeEvent.SUCCESS);
	}
}
