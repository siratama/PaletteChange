package jsx.palette_change;

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

	/**
	 * @code serialized: [[000000,000000,000000, ...], [000000,000000,000000, ...]]
	 */
	public function new(code:String)
	{
		application = untyped app;

		/*
		application.activeDocument;
		if(){
		}
		*/

		/*
		var code = untyped prompt('$PALLET_URL\nenter code', "");
		if(code == null) return;
		*/

		palletInfo = PaletteInfo.instance;
		palletInfo.convert(code);
		if(!palletInfo.parsedResult){
			js.Lib.alert("code error");
			return;
		}

		new Converter();
		js.Lib.alert("completed");
	}
}
