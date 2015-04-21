package app;

import psd.Layers;
import psd.Layer;
import psd.Application;

using jsx.Bounds;

class LayersParser
{
	private var application:Application;
	private var layers:Layers;
	private var defaultVisibleSet:Array<Bool>;

	public function new()
	{
		application = untyped app;

		layers = application.activeDocument.layers;
		defaultVisibleSet = [];

		hideAll();
		execute();
		restoreVisible();
	}
	private function hideAll()
	{
		for (i in 0...layers.length)
		{
			var layer:Layer = layers[i];
			defaultVisibleSet[i] = layer.visible;
			layer.visible = false;
		}
	}
	private function execute()
	{
		for (i in 0...layers.length)
		{
			var layer:Layer = layers[i];
			var bounds = layer.bounds.convert();
		}
	}
	private function restoreVisible()
	{
		for (i in 0...layers.length)
		{
			var layer:Layer = layers[i];
			layer.visible = defaultVisibleSet[i];
		}
	}
}

