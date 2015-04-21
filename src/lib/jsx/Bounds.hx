package jsx;

import psd.UnitValue;
using Std;
using jsx.Bounds;

class Bounds
{
	public var x(default, null):Float;
	public var y(default, null):Float;
	public var width(default, null):Float;
	public var height(default, null):Float;

	public function new(x:Float, y:Float, width:Float, height:Float)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
	public function toString():String
	{
		return [x, y, width, height].join(":");
	}
	public static function convert(bounds:Array<UnitValue>):Bounds
	{
		return new Bounds(bounds[0].value, bounds[1].value, bounds[2].value, bounds[3].value);
	}
}
