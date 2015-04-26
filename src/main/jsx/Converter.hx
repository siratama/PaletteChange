package jsx;

import jsx.util.LayersDisplay;
import js.html.Point;
import jsx.PaletteInfo.PaletteColorPosition;
import psd.RGBColor;
import psd.SolidColor;
import psd.Document;
import psd.Layers;
import psd.Layer;
import psd.Application;

using jsx.util.Bounds;

class Converter
{
	private var application:Application;
	private var activeDocument:Document;
	private var layers:Layers;
	private var palletInfo:PaletteInfo;
	private var layersDisplay:LayersDisplay;

	public function new()
	{
		palletInfo = PaletteInfo.instance;

		application = untyped app;
		activeDocument = application.activeDocument;
		layers = activeDocument.layers;

		layersDisplay = new LayersDisplay(layers);

		layersDisplay.hide();
		execute();
		layersDisplay.restore();
	}
	private function selectPixel(x:Int, y:Int)
	{
		activeDocument.selection.select([[x, y], [x+1, y], [x+1, y+1], [x, y+1]]);
	}

	//
	private function execute()
	{
		for (i in 0...layers.length)
		{
			var layer:Layer = layers[i];
			if(layer.allLocked) continue;

			application.activeDocument.activeLayer = layer;

			layer.visible = true;
			var conversionDataSet = getConversionDataSet(layer);
			paint(layer, conversionDataSet);
			layer.visible = false;
		}
	}
	private function getConversionDataSet(layer:Layer):Array<ConversionData>
	{
		var conversionDataSet:Array<ConversionData> = [];

		var bounds = layer.bounds.convert();
		for (y in Std.int(bounds.top)...Std.int(bounds.bottom))
		{
			for (x in Std.int(bounds.left)...Std.int(bounds.right))
			{
				var colorSample = activeDocument.colorSamplers.add([x, y]);
				var rgb = colorSample.color.rgb.hexValue;

				var palletColorPosition = palletInfo.before.indexOf(colorSample.color.rgb.hexValue);
				switch(palletColorPosition)
				{
					case PaletteColorPosition.NONE: continue;
					case PaletteColorPosition.EXSITS(index):

						var conversionData = new ConversionData(new Point(x, y), palletInfo.after.rgbHexValueSet[index]);
						conversionDataSet.push(conversionData);
				}
			}
		}
		return conversionDataSet;
	}

	/**
	 * 着色後の色が 変換対象の色と同値になる場合がある事を避けるため
	 * 元レイヤーを複製して複製したレイヤーに着色
	 * 色の抽出調査は元レイヤーを利用
	 */
	private function paint(layer:Layer, conversionDataSet:Array<ConversionData>)
	{
		var duplicatedLayer:Layer = layer.duplicate();

		for (conversionData in conversionDataSet)
		{
			application.activeDocument.activeLayer = layer;
			var pixel = conversionData.pixel;
			selectPixel(Std.int(pixel.x), Std.int(pixel.y));
			activeDocument.selection.similar(0, false);

			application.activeDocument.activeLayer = duplicatedLayer;
			var color = new SolidColor();
			color.rgb.hexValue = conversionData.rgbHexValue;
			activeDocument.selection.fill(color);
			activeDocument.selection.deselect();
		}
		var duplicatedArtLayer = activeDocument.artLayers.getByName(duplicatedLayer.name);
		duplicatedArtLayer.merge();
	}
}

class ConversionData
{
	public var pixel(default, null):Point;
	public var rgbHexValue(default, null):String;
	public function new(pixel:Point, rgbHexValue:String)
	{
		this.pixel = pixel;
		this.rgbHexValue = rgbHexValue;
	}
}

