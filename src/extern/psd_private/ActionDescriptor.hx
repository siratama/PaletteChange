package psd_private;

@:native("ActionDescriptor")
extern class ActionDescriptor
{
	public function new();

	public function putReference(typeId:Int, actionReference:ActionReference):Void;
	public function putBoolean(typeId:Int, bool:Bool):Void;
}
