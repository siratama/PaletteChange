package jsx.palette_change;
import haxe.Unserializer;

class PaletteMap
{
	public var map(default, null):Map<String, String>;

	@:allow(jsx) private static var instance(get, null):PaletteMap;
	private static inline function get_instance():PaletteMap
		return instance == null ? instance = new PaletteMap(): instance;

	private function new() {}
	public function convert(code:String)
	{
		var rgbHexValueSets:Array<Array<String>> = Unserializer.run(code);
		var beforeRgbHexValueSet = rgbHexValueSets[0];
		var afterRgbHexValueSet = rgbHexValueSets[1];

		map = new Map();
		for (i in 0...beforeRgbHexValueSet.length)
		{
			var beforeRgbHexValue = beforeRgbHexValueSet[i];
			var afterRgbHexValue = afterRgbHexValueSet[i];
			if(beforeRgbHexValue == afterRgbHexValue) continue;
			map[beforeRgbHexValue] = afterRgbHexValue;
		}
	}
}

