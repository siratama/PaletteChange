package color;

typedef RGBA = {
	var a:UInt;
	var r:UInt;
	var g:UInt;
	var b:UInt;
}

class Converter
{
	public static inline function create(a:UInt, r:UInt, g:UInt, b:UInt):RGBA
	{
		return {a:a, r:r, g:g, b:b};
	}
	public static inline function toInstance(rgbaValue:UInt):RGBA
	{
		var a = rgbaValue >> 24 & 0xff;
		var r = rgbaValue >> 16 & 0xff;
		var g = rgbaValue >> 8 & 0xff;
		var b = rgbaValue & 0xff;
		return create(a, r, g, b);
	}
	public static inline function toString(rgba:RGBA)
	{
		trace(rgba.a, rgba.r, rgba.g, rgba.b);
	}
}