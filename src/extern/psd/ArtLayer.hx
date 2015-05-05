package psd;

@:native("ArtLayer")
extern class ArtLayer extends Layer
{
	public var isBackgroundLayer:Bool;
	public var kind:LayerKind;
	public function merge():ArtLayer;

	}
