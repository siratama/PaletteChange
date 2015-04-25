package psd;

@:native("Layer")
extern class Layer
{
	public var bounds(default, null):Array<UnitValue>;
	public var visible:Bool;
	public var allLocked:Bool;
	public var name:String;
	public function duplicate(relativeObject:Dynamic = null, insertionLocation:ElementPlacement = null):Layer;
}
