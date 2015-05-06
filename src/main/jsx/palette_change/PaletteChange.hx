package jsx.palette_change;

import haxe.Unserializer;
import haxe.Serializer;
import common.PaletteChangeEvent;
import psd.Application;

@:native("PaletteChange")
class PaletteChange
{
	private var mainFunction:Void->Void;
	private var application:Application;
	private var converter:Converter;
	private var paletteMap:PaletteMap;

	private var event:PaletteChangeEvent;
	public function getSerializedEvent():String{
		return Serializer.run(event);
	}

	public static function main(){
		test();
	}
	public static function test()
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
		var code = Serializer.run(arr);
		paletteChange.execute(code);

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

	public function new()
	{
		application = untyped app;
		paletteMap = PaletteMap.instance;
		converter = new Converter();
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
	public function execute(code:String)
	{
		paletteMap.convert(code);

		event = PaletteChangeEvent.NONE;
		converter.initialize();
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
