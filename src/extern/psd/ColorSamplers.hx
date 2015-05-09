package psd;

@:native("ColorSamplers")
extern class ColorSamplers implements ArrayAccess<ColorSampler>
{
	public var length(default, null):Int;
	public function removeAll():Void;

	@:overload(function (position:Array<UnitValue>):ColorSampler{})
	public function add(position:Array<Float>):ColorSampler;
}
