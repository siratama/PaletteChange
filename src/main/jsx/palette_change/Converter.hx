package jsx.palette_change;

import jsx.util.Bounds;
import psd.ColorSampler;
import psd.ArtLayer;
import jsx.util.LayersDisplay;
import psd.RGBColor;
import psd.SolidColor;
import psd.Document;
import psd.Layers;
import psd.Layer;
import psd.Application;

using jsx.util.Bounds;

class Converter
{
	private var mainFunction:Void->Void;
	private var application:Application;
	private var activeDocument:Document;
	private var layers:Layers;
	private var paletteMap:PaletteMap;
	private var layersDisplay:LayersDisplay;

	private var scanPixelCount:Int;
	private static inline var ONCE_SCAN_PIXEL = 10;

	private var sampleLayerIndex:Int;
	private var sampleLayer:Layer;
	private var sampleBounds:Bounds;
	private var samplePositionX:Int;
	private var samplePositionY:Int;

	private var conversionDataSet:Array<ConversionData>;
	private var conversionRgbHexValueMap:Map<String, Bool>;
	private var paintedConversionData:ConversionData;

	private var duplicatedPaintLayer:Layer;

	public function new()
	{
		paletteMap = PaletteMap.instance;
		application = untyped app;
	}
	public function run()
	{
		mainFunction();
	}

	//
	public function initialize()
	{
		activeDocument = application.activeDocument;
		layers = activeDocument.layers;

		layersDisplay = new LayersDisplay(layers);
		layersDisplay.hide();

		sampleLayerIndex = 0;
		mainFunction = setSampleLayer;
	}
	private function setSampleLayer()
	{
		if(sampleLayerIndex < layers.length)
		{
			sampleLayer = layers[sampleLayerIndex];
			if(sampleLayer.allLocked){
				sampleLayerIndex++;
			}
			else{
				initializeToCreateConversionDataSet();
			}
		}
		else{
			layersDisplay.restore();
			mainFunction = finish;
		}
	}
	private function initializeToCreateConversionDataSet()
	{
		application.activeDocument.activeLayer = sampleLayer;

		if(!cast(sampleLayer, ArtLayer).isBackgroundLayer)
			sampleLayer.visible = true;

		sampleBounds = sampleLayer.bounds.convert();
		samplePositionX = Std.int(sampleBounds.left);
		samplePositionY = Std.int(sampleBounds.top);
		conversionDataSet = [];
		conversionRgbHexValueMap = new Map();
		mainFunction = createConversionDataSet;
	}
	private function createConversionDataSet()
	{
		scanPixelCount = 0;
		for (y in samplePositionY...Std.int(sampleBounds.bottom))
		{
			for (x in samplePositionX...Std.int(sampleBounds.right))
			{
				var colorSampler = activeDocument.colorSamplers.add([x, y]);
				try{
					var hexValue = colorSampler.color.rgb.hexValue;
js.Lib.alert(hexValue);
					if(!conversionRgbHexValueMap[hexValue] && paletteMap.map[hexValue] != null){
js.Lib.alert("exchange!");
						var conversionData = new ConversionData(x, y, paletteMap.map[hexValue]);
						conversionDataSet.push(conversionData);
						conversionRgbHexValueMap[hexValue] = true;
					}
				}
				//colorSampler.color is transparent
				catch(error:Dynamic){}

				colorSampler.remove();

				if(++scanPixelCount >= ONCE_SCAN_PIXEL){
					samplePositionX = x + 1;
					samplePositionY = y;
					if(samplePositionX >= Std.int(sampleBounds.right)){
						samplePositionX = 0;
						samplePositionY++;
					}
					return;
				}
			}
		}
		initializeToPaint();
	}

	//
	private function initializeToPaint()
	{
		duplicatedPaintLayer = sampleLayer.duplicate();
		mainFunction = setPaintedConversionData;
	}
	private function setPaintedConversionData()
	{
		if(conversionDataSet.length > 0)
		{
			paintedConversionData = conversionDataSet.shift();
			mainFunction = paint;
		}
		else{
			destroyToPaint();
		}
	}
	private function paint()
	{
		application.activeDocument.activeLayer = sampleLayer;
		selectPixel(paintedConversionData.pixelX, paintedConversionData.pixelY);
		activeDocument.selection.similar(0, false);

		application.activeDocument.activeLayer = duplicatedPaintLayer;
		var color = new SolidColor();
		color.rgb.hexValue = paintedConversionData.rgbHexValue;
		activeDocument.selection.fill(color);
		activeDocument.selection.deselect();

		mainFunction = setPaintedConversionData;
	}
	private function selectPixel(x:Int, y:Int)
	{
		activeDocument.selection.select([[x, y], [x+1, y], [x+1, y+1], [x, y+1]]);
	}
	private function destroyToPaint()
	{
		cast(duplicatedPaintLayer, ArtLayer).merge();

		if(!cast(sampleLayer, ArtLayer).isBackgroundLayer)
			sampleLayer.visible = false;

		sampleLayerIndex++;
		mainFunction = setSampleLayer;
	}
	
	private function finish(){}
	public function isFinished():Bool
		return Reflect.compareMethods(mainFunction, finish);

	public function interrupt()
	{
		layersDisplay.restore();
	}
}

class ConversionData
{
	public var pixelX(default, null):Int;
	public var pixelY(default, null):Int;
	public var rgbHexValue(default, null):String;
	public function new(pixelX:Int, pixelY:Int, rgbHexValue:String)
	{
		this.pixelX = pixelX;
		this.pixelY = pixelY;
		this.rgbHexValue = rgbHexValue;
	}
}

