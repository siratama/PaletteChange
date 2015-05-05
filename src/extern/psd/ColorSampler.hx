package psd;

@:native("ColorSampler")
extern class ColorSampler
{
	public var color(default, null):SolidColor;
	public var position(default, null):Array<UnitValue>;
	public function remove():Void;
}
