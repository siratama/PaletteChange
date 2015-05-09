package jsx.palette_change;

import psd.Lib;
import psd.UnitValue;
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
import psd.Lib.app;

using jsx.util.Bounds;

class Converter
{
	private var mainFunction:Void->Void;
	private var paletteMap:PaletteMap;
	private var painter:Painter;
	private var layersDisplay:LayersDisplay;
	private var scanner:Scanner;

	private var application:Application;
	private var activeDocument:Document;
	private var activeDocumentHeight:Float;
	private var layers:Layers;

	private var sampleLayerIndex:Int;
	private var sampleLayer:Layer;

	public function new()
	{
		paletteMap = PaletteMap.instance;
		application = app;
		painter = new Painter();
		scanner = new Scanner();
	}
	public function run()
	{
		mainFunction();
	}

	//
	public function initialize()
	{
		activeDocument = application.activeDocument;
		activeDocumentHeight = activeDocument.height;
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
				initializeToScan();
			}
		}
		else{
			layersDisplay.restore();
			mainFunction = finish;
		}
	}

	//
	private function initializeToScan()
	{
		scanner.initialize(activeDocument, sampleLayer);
		mainFunction = scan;
	}
	private function scan()
	{
		scanner.run();
		if(scanner.isFinished()){
			initializeToPaint();
		}
	}

	//
	private function initializeToPaint()
	{
		if(scanner.conversionDataSet.length > 0){
			painter.initialize(activeDocument, sampleLayer, scanner.conversionDataSet);
			mainFunction = paint;
		}
		else
			destroyToPaint();
	}
	private function paint()
	{
		painter.run();
		if(painter.isFinished())
			destroyToPaint();
	}
	private function destroyToPaint()
	{
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

private class ConversionData
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

private class Scanner
{
	private var mainFunction:Void->Void;
	private var paletteMap:PaletteMap;
	private var activeDocument:Document;
	private var activeDocumentHeight:Float;
	private var activeDocumentWidth:Float;

	private var scanPixelCount:Int;
	private static inline var ONCE_SCAN_PIXEL = 10;

	private var sampleLayer:Layer;
	private var sampleBounds:Bounds;
	private var samplePositionX:Int;
	private var samplePositionY:Int;

	public var conversionDataSet(default, null):Array<ConversionData>;
	private var conversionRgbHexValueMap:Map<String, Bool>;

	public function new()
	{
		paletteMap = PaletteMap.instance;
	}
	public function run()
	{
		mainFunction();
	}
	public function initialize(activeDocument:Document, sampleLayer:Layer)
	{
		this.activeDocument = activeDocument;
		activeDocumentHeight = activeDocument.height;
		activeDocumentWidth = activeDocument.width;

		activeDocument.activeLayer = sampleLayer;

		if(!cast(sampleLayer, ArtLayer).isBackgroundLayer)
			sampleLayer.visible = true;

		sampleBounds = sampleLayer.bounds.convert();
		samplePositionX = Std.int(sampleBounds.left);
		samplePositionY = Std.int(sampleBounds.top);

		conversionDataSet = [];
		conversionRgbHexValueMap = new Map();

		mainFunction = execute;
	}
	private function execute()
	{
		scanPixelCount = 0;
		for (y in samplePositionY...Std.int(sampleBounds.bottom))
		{
			var adjustY = (y == activeDocumentHeight) ? y : y + 0.1;

			for (x in samplePositionX...Std.int(sampleBounds.right))
			{
				var adjustX = (x == activeDocumentWidth) ? x : x + 0.1;
				var colorSampler = activeDocument.colorSamplers.add([adjustX, adjustY]);

				try{
					var hexValue = colorSampler.color.rgb.hexValue;

					if(!conversionRgbHexValueMap[hexValue] && paletteMap.map[hexValue] != null){

						var conversionData = new ConversionData(x, y, paletteMap.map[hexValue]);
						conversionDataSet.push(conversionData);
						conversionRgbHexValueMap[hexValue] = true;
					}
				}
				//colorSampler.color is transparent
				catch(error:Dynamic){}

				colorSampler.remove();

				if(++scanPixelCount < ONCE_SCAN_PIXEL) continue;
				adjustPosition(x, y);
				return;
			}
			samplePositionX = Std.int(sampleBounds.left);
		}
		mainFunction = finish;
	}

	private function adjustPosition(x:Int, y:Int)
	{
		samplePositionX = x + 1;
		samplePositionY = y;
		if(samplePositionX >= Std.int(sampleBounds.right)){
			samplePositionX = Std.int(sampleBounds.left);
			samplePositionY++;
		}
	}
	
	private function finish(){}
	public function isFinished():Bool
		return Reflect.compareMethods(mainFunction, finish);
}

private class Painter
{
	private var mainFunction:Void->Void;
	private var activeDocument:Document;
	private var sampleLayer:Layer;
	private var duplicatedPaintLayer:Layer;

	private var conversionDataSet:Array<ConversionData>;
	private var paintedConversionData:ConversionData;

	public function new()
	{
	}
	public function run()
	{
		mainFunction();
	}
	public function initialize(activeDocument:Document, sampleLayer:Layer, conversionDataSet:Array<ConversionData>)
	{
		this.activeDocument = activeDocument;
		this.conversionDataSet = conversionDataSet;
		this.sampleLayer = sampleLayer;

		duplicatedPaintLayer = sampleLayer.duplicate();
		mainFunction = setPaintedConversionData;
	}
	private function setPaintedConversionData()
	{
		if(conversionDataSet.length > 0)
		{
			paintedConversionData = conversionDataSet.shift();
			mainFunction = execute;
		}
		else{
			mergeLayer();
		}
	}
	private function execute()
	{
		activeDocument.activeLayer = sampleLayer;
		selectPixel(paintedConversionData.pixelX, paintedConversionData.pixelY);
		activeDocument.selection.similar(0, false);

		activeDocument.activeLayer = duplicatedPaintLayer;
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
	private function mergeLayer()
	{
		//don't use merge: Photoshop CC bug
		//merged layer is displayed with all timeline frames
		//https://forums.adobe.com/thread/1355933
		//cast(duplicatedPaintLayer, ArtLayer).merge();

		//fill for copy: [0, 0], [doc.width][doc.height]

		//substitute
		activeDocument.selection.selectAll();
		activeDocument.selection.copy(false);
		activeDocument.activeLayer.remove();
		activeDocument.activeLayer = sampleLayer;
		activeDocument.selection.clear();
		activeDocument.paste(false);

		if(!cast(sampleLayer, ArtLayer).isBackgroundLayer)
			sampleLayer.visible = false;

		mainFunction = finish;
	}

	private function finish(){}
	public function isFinished():Bool
		return Reflect.compareMethods(mainFunction, finish);
}

