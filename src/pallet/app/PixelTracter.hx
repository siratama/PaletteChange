package app;

import js.html.ImageElement;
import js.Browser;
import createjs.BitmapData;

using color.RGBA.Converter;

class PixelTracter
{
	@:allow(app) private static var instance(get, null):PixelTracter;
	private static inline function get_instance():PixelTracter
		return instance == null ? instance = new PixelTracter(): instance;

	private function new()
	{
	}

	//public function execute(imageSourceUri:String)
	public function execute(imageElement:ImageElement)
	{
		/*
		var imageElement = Browser.document.createImageElement();
		imageElement.src = imageSourceUri;
		*/
		
		var bitmapData = new BitmapData(imageElement);

		var rgbaValue = bitmapData.getPixel32(0, 0);
		var rgba = rgbaValue.toInstance();
	}
}
