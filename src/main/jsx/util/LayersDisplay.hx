package jsx.util;

import psd.LayerSet;
import psd.LayerTypeName;
import psd.ArtLayer;
import psd.Layers;
import psd.Layer;

class LayersDisplay
{
	private var layers:Layers;
	private var defaultLayerVisibleSet:Array<Bool>;
	private var layersDisplayMap:Map<LayerSet, LayersDisplay>;

	public function new(layers:Layers)
	{
		this.layers = layers;
		defaultLayerVisibleSet = [];
		layersDisplayMap = new Map();
	}
	public function hide()
	{
		for (i in 0...layers.length)
		{
			var layer:Layer = layers[i];
			if(layer.typename == LayerTypeName.LAYER_SET)
			{
				var layerSet = cast(layer, LayerSet);
				var layersDisplay = new LayersDisplay(layerSet.layers);
				layersDisplay.hide();
				layersDisplayMap.set(layerSet, layersDisplay);
				continue;
			}
			if(cast(layer, ArtLayer).isBackgroundLayer) continue;

			defaultLayerVisibleSet[i] = layer.visible;
			layer.visible = false;
		}
	}
	public function restore()
	{
		for (i in 0...layers.length)
		{
			var layer:Layer = layers[i];
			if(layer.typename == LayerTypeName.LAYER_SET)
			{
				var layerSet = cast(layer, LayerSet);
				var layersDisplay:LayersDisplay = layersDisplayMap.get(layerSet);
				layersDisplay.restore();
				continue;
			}
			if(cast(layer, ArtLayer).isBackgroundLayer) continue;
			layer.visible = defaultLayerVisibleSet[i];
		}
	}
}
