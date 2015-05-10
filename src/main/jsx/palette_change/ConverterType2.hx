package jsx.palette_change;

import psd.Application;
import psd.Layers;
import jsx.util.LayersDisplay;
import psd.SolidColor;
import psd.ArtLayer;
import jsx.util.ColorSamplePosition;
import jsx.util.Bounds;
import psd.Layer;
import psd.Document;
import psd.Lib.app;

using jsx.util.Bounds;

//
// paint evey 1 pixel
// speed is very slow
//
class ConverterType2
{
	private var mainFunction:Void->Void;
	private var layersDisplay:LayersDisplay;
	private var painter:Painter;

	private var application:Application;
	private var activeDocument:Document;
	private var layers:Layers;
	private var sampleLayerIndex:Int;
	private var sampleLayer:Layer;

	public function new()
	{
		application = app;
		painter = new Painter();
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
				initializeToPaint();
			}
		}
		else{
			layersDisplay.restore();
			mainFunction = finish;
		}
	}

	//
	private function initializeToPaint()
	{
		painter.initialize(activeDocument, sampleLayer);
		mainFunction = paint;
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

private class Painter
{
	private var mainFunction:Void->Void;
	private var paletteMap:PaletteMap;
	private var activeDocument:Document;

	private var sampleLayerIndex:Int;
	private var sampleBounds:Bounds;
	private var samplePositionX:Int;
	private var samplePositionY:Int;
	private var colorSamplePosition:ColorSamplePosition;

	private var scanPixelCount:Int;
	private static inline var ONCE_SCAN_PIXEL = 10;

	public function new()
	{
		paletteMap = PaletteMap.instance;
		colorSamplePosition = new ColorSamplePosition();
	}
	public function run()
	{
		mainFunction();
	}
	public function initialize(activeDocument:Document, sampleLayer:Layer)
	{
		this.activeDocument = activeDocument;
		colorSamplePosition.initialize(activeDocument);

		activeDocument.activeLayer = sampleLayer;

		if(!cast(sampleLayer, ArtLayer).isBackgroundLayer)
			sampleLayer.visible = true;

		sampleBounds = sampleLayer.bounds.convert();
		samplePositionX = Std.int(sampleBounds.left);
		samplePositionY = Std.int(sampleBounds.top);

		mainFunction = execute;
	}
	private function execute()
	{
		scanPixelCount = 0;
		for (y in samplePositionY...Std.int(sampleBounds.bottom))
		{
			var adjustY = colorSamplePosition.getAdjustY(y);

			for (x in samplePositionX...Std.int(sampleBounds.right))
			{
				var adjustX = colorSamplePosition.getAdjustX(x);
				var colorSampler = activeDocument.colorSamplers.add([adjustX, adjustY]);

				try{
					var hexValue = colorSampler.color.rgb.hexValue;

					if(paletteMap.map[hexValue] != null)
					{
						paintPixel(x, y, paletteMap.map[hexValue]);
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
	private function paintPixel(x:Int, y:Int, rgbHexValue:String)
	{
		selectPixel(x, y);
		var color = new SolidColor();
		color.rgb.hexValue = rgbHexValue;
		activeDocument.selection.fill(color);
		activeDocument.selection.deselect();
	}
	private inline function selectPixel(x:Int, y:Int)
	{
		activeDocument.selection.select([[x, y], [x+1, y], [x+1, y+1], [x, y+1]]);
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