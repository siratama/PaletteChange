package psd;

@:native("com.adobe.photoshop.Layer")
extern class Layer
{
	public var bounds(default, null):Array<UnitValue>;
	public var visible:Bool;
	public var allLocked:Bool;
}
