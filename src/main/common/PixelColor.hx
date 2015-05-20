package common;
class PixelColor
{
	public var rgbHexValue(default, null):String;
	public var x(default, null):Int;
	public var y(default, null):Int;
	private static inline var NOT_SET_POSITION = -1;

	public static function create(rgbHexValue:String, x:Int, y:Int):PixelColor
	{
		var pixelColor = new PixelColor();
		pixelColor.rgbHexValue = rgbHexValue;
		pixelColor.x = x;
		pixelColor.y = y;
		return pixelColor;
	}
	public static function createWithoutPosition(rgbHexValue:String):PixelColor
	{
		var pixelColor = new PixelColor();
		pixelColor.rgbHexValue = rgbHexValue;
		pixelColor.x = NOT_SET_POSITION;
		pixelColor.y = NOT_SET_POSITION;
		return pixelColor;
	}
	private function new(){}

	public function isNotSetPosition():Bool
	{
		return x == NOT_SET_POSITION;
	}
	public function equalPosition(checked:PixelColor):Bool
	{
		return x == checked.x && y == checked.y;
	}

	public function updatePosition(x:Int, y:Int)
	{
		this.x = x;
		this.y = y;
	}
}
