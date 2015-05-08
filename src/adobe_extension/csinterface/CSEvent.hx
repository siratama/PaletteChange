package csinterface;

@:native("CSEvent")
extern class CSEvent
{
	public function new():Void;
	public var type:String;
	public var scope:String;
	public var extensionId:String;
}

