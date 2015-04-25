package psd;

@:native("Layers")
extern class Layers implements ArrayAccess<Layer>
{
	public var length(default, null):Int;
	//public function index(idx:Int):Layer; //error
	public function getByName(nameParam:String):Layer;
}
