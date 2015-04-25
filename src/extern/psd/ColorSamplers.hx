package psd;

@:native("ColorSamplers")
extern class ColorSamplers implements ArrayAccess<ColorSampler>
{
	public var length(default, null):Int;
	public function add(position:Array<Int>):ColorSampler;
}
