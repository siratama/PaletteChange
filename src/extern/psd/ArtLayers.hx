package psd;

@:native("com.adobe.photoshop.ArtLayers")
extern class ArtLayers implements ArrayAccess<ArtLayer>
{
	public var length(default, null):Int;
	//public function index(index:Int):ArtLayer; //error
}
