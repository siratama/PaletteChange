package jsx;
import common.CSV;
import haxe.format.JsonParser;

class PalletInfo
{
	public var before(default, null):Pallet;
	public var after(default, null):Pallet;
	public var parsedResult(default, null):Bool;

	@:allow(jsx) private static var instance(get, null):PalletInfo;
	private static inline function get_instance():PalletInfo
		return instance == null ? instance = new PalletInfo(): instance;

	private function new() {}
	public function convert(code:String)
	{
		try{
			var json:Array<String> = JsonParser.parse(code);
			before = new Pallet(json[0]);
			after = new Pallet(json[1]);
			parsedResult = true;
		}
		catch(error:String)
		{
			parsedResult = false;
		}
	}
}

class Pallet
{
	public var rgbHexValueSet(default, null):Array<String>;
	public function new(rgbHexValueCsv:String)
	{
		this.rgbHexValueSet = rgbHexValueCsv.split(CSV.RGB_HAX_VALUE_DELIMITER);
	}

	public function indexOf(checkedRgbHexValue:String):PalletColorPosition
	{
		for (i in 0...rgbHexValueSet.length)
		{
			if(rgbHexValueSet[i] == checkedRgbHexValue)
			{
				return PalletColorPosition.EXSITS(i);
			}
		}
		return PalletColorPosition.NONE;
	}
}

enum PalletColorPosition
{
	NONE;
	EXSITS(index:Int);
}
