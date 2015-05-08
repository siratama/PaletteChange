package psd;

@:native("Document")
extern class Document
{
	public var activeLayer:Layer;
	public var artLayers(default, null):ArtLayers;
	public var layers(default, null):Layers;
	public var colorSamplers(default, null):ColorSamplers;
	public var selection(default, null):Selection;
	public var height(default, null):Float;
	public function paste(introSelection:Bool = false):ArtLayer;
}
