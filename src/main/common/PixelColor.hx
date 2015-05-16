package common;
class PixelColor
{
	public var rgbHexValue(default, never):String;
	public var x(default, never):Int;
	public var y(default, never):Int;
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
	public function new(){}

	public function isNotSetPosition():Bool
	{
		return x == NOT_SET_POSITION;
	}
}
