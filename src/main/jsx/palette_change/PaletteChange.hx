package jsx.palette_change;

import haxe.Unserializer;
import haxe.Serializer;
import common.PaletteChangeEvent;
import psd.Application;
import psd.Lib.app;

@:native("PaletteChange")
class PaletteChange
{
	private var mainFunction:Void->Void;
	private var application:Application;
	private var converter:Converter;
	//private var converter:ConverterType2;
	private var paletteMap:PaletteMap;

	private var event:PaletteChangeEvent;
	public function getSerializedEvent():String{
		return Serializer.run(event);
	}

	public static function main(){
		//PaletteChangeTest.execute();
	}

	public function new()
	{
		application = app;
		paletteMap = PaletteMap.instance;
		converter = new Converter();
		//converter = new ConverterType2();
	}
	public function getInitialErrorEvent():String
	{
		var event = (application.documents.length == 0) ?
			PaletteChangeInitialErrorEvent.ERROR("Open document."): PaletteChangeInitialErrorEvent.NONE;

		return Serializer.run(event);
	}
	public function run()
	{
		mainFunction();
	}

	/**
	 * @code serialized: [["000000","000000","000000", ...], ["000000","000000","000000", ...]]
	 */
	public function execute(code:String, ignoreLockedLayer:Bool)
	{
		event = PaletteChangeEvent.NONE;
		paletteMap.convert(code);
		converter.initialize(ignoreLockedLayer);
		mainFunction = convert;
	}
	private function convert()
	{
		converter.run();
		if(converter.isFinished())
			event = PaletteChangeEvent.SUCCESS;
	}

	public function interrupt()
	{
		converter.interrupt();
	}
}

private class PaletteChangeTest
{
	public static function execute()
	{
		var paletteChange = new PaletteChange();
		switch(Unserializer.run(paletteChange.getInitialErrorEvent()))
		{
			case PaletteChangeInitialErrorEvent.ERROR(message):
				js.Lib.alert(message);
				return;
			case PaletteChangeInitialErrorEvent.NONE:
				"";
		}

		var arr = [["FF0000"], ["0000FF"]];
		//var arr = [[], []];
		var code = Serializer.run(arr);
		//paletteChange.execute(code, false);
		paletteChange.execute(code, true);

		for (i in 0...100)
		{
			paletteChange.run();
			var result = paletteChange.getSerializedEvent();
			var event:PaletteChangeEvent = Unserializer.run(result);
			switch(event)
			{
				case PaletteChangeEvent.NONE: "";
				case PaletteChangeEvent.SUCCESS:
					js.Lib.alert("success!");
					break;
			}
		}
	}
}
