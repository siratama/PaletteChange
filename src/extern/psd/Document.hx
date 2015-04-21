package psd;

@:native("com.adobe.photoshop.Document")
extern class Document
{
	public var activeLayer(default, null):Layer;
	public var artLayers(default, null):ArtLayers;
	public var layers(default, null):Layers;
}
