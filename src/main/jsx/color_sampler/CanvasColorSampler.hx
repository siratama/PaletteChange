package jsx.color_sampler;

import haxe.Serializer;
import psd.Layer;
import jsx.util.LayersDisplay;
import psd.Document;
import psd.Layers;
import psd.Application;

using jsx.util.Bounds;

@:expose("CanvasColorSampler")
class CanvasColorSampler
{
	private var application:Application;
	private var activeDocument:Document;
	private var layers:Layers;
	private var layersDisplay:LayersDisplay;

	public static function main(){}
	public function new(){}

	public function execute():String
	{
		application = untyped app;
		activeDocument = application.activeDocument;
		layers = activeDocument.layers;

		layersDisplay = new LayersDisplay(layers);
		layersDisplay.hide();

		var layer:Layer = activeDocument.activeLayer;
		layer.visible = true;

		var rgbHexValueSet:Array<String> = [];

		var bounds = layer.bounds.convert();
		for (y in Std.int(bounds.top)...Std.int(bounds.bottom))
		{
			for (x in Std.int(bounds.left)...Std.int(bounds.right))
			{
				var colorSample = activeDocument.colorSamplers.add([x, y]);

				var rgbHexValue = colorSample.color.rgb.hexValue;
				if(rgbHexValueSet.indexOf(rgbHexValue) != -1)
					rgbHexValueSet.push(rgbHexValue);
			}
		}
		layersDisplay.restore();
		//return rgbHexValueSet.join(CSV.RGB_HAX_VALUE_DELIMITER);
		return Serializer.run(rgbHexValueSet);
	}

	/**
	 * for Photoshop CC Extension
	 */
	/*
	private static var rgbHexValueCsv:String;
	public static function getRgbHexValueCsv():String
		return rgbHexValueCsv;
		*/
}
