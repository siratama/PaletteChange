package jsx.util;

import psd.Layers;
import psd.Layer;

class LayersDisplay
{
	private var layers:Layers;
	private var defaultLayerVisibleSet:Array<Bool>;

	public function new(layers:Layers)
	{
		this.layers = layers;
		defaultLayerVisibleSet = [];
	}
	public function hide()
	{
		for (i in 0...layers.length)
		{
			var layer:Layer = layers[i];
			defaultLayerVisibleSet[i] = layer.visible;
			layer.visible = false;
		}
	}
	public function restore()
	{
		for (i in 0...layers.length)
		{
			var layer:Layer = layers[i];
			layer.visible = defaultLayerVisibleSet[i];
		}
	}
}
