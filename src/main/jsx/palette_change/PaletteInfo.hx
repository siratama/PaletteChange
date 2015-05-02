package jsx.palette_change;
import haxe.Unserializer;

class PaletteInfo
{
	public var before(default, null):Palette;
	public var after(default, null):Palette;
	public var parsedResult(default, null):Bool;

	@:allow(jsx) private static var instance(get, null):PaletteInfo;
	private static inline function get_instance():PaletteInfo
		return instance == null ? instance = new PaletteInfo(): instance;

	private function new() {}
	public function convert(code:String)
	{
		try{
			var rgbHexValueSets:Array<Array<String>> = Unserializer.run(code);
			before = new Palette(rgbHexValueSets[0]);
			after = new Palette(rgbHexValueSets[1]);
			parsedResult = true;
		}
		catch(error:String)
		{
			parsedResult = false;
		}
	}
}

class Palette
{
	public var rgbHexValueSet(default, null):Array<String>;
	public function new(rgbHexValueSet:Array<String>)
	{
		this.rgbHexValueSet = rgbHexValueSet;
	}

	public function indexOf(checkedRgbHexValue:String):PaletteColorPosition
	{
		for (i in 0...rgbHexValueSet.length)
		{
			if(rgbHexValueSet[i] == checkedRgbHexValue)
			{
				return PaletteColorPosition.EXSITS(i);
			}
		}
		return PaletteColorPosition.NONE;
	}
}

enum PaletteColorPosition
{
	NONE;
	EXSITS(index:Int);
}
