package psd_private;

@:native("ActionReference")
extern class ActionReference
{
	public function new();
	public function putName(typeId:Int, layerName:String):Void;
}
