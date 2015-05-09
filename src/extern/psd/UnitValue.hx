package psd;

@:native("UnitValue")
extern class UnitValue
{
	public var type(default, null):String;
	public var value(default, null):Float;
	public function new(number:Float, unit:String);
}

class UnitType
{
	public static inline var PIXEL = "px";
}

