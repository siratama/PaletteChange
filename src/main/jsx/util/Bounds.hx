package jsx.util;

import psd.UnitValue;
using Std;
using jsx.util.Bounds;

class Bounds
{
	public var left(default, null):Float;
	public var top(default, null):Float;
	public var right(default, null):Float;
	public var bottom(default, null):Float;

	public function new(left:Float, top:Float, right:Float, bottom:Float)
	{
		this.left = left;
		this.top = top;
		this.right = right;
		this.bottom = bottom;
	}
	public function toString():String
	{
		return [left, top, right, bottom].join(":");
	}
	public static function convert(bounds:Array<UnitValue>):Bounds
	{
		return new Bounds(bounds[0].value, bounds[1].value, bounds[2].value, bounds[3].value);
	}
}
