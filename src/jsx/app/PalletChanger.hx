package app;

import psd.Application;
class PalletChanger
{
	private static inline var PALLET_URL = "http://www.github.aaa/";
	private var application:Application;

	public static function main()
	{
		new PalletChanger();
	}

	public function new()
	{
		application = untyped app;

		var code = untyped prompt('$PALLET_URL\nenter code', "");
		if(code == null) return;

		new LayersParser();
	}
}
