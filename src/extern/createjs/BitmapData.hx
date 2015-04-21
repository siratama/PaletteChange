package createjs;

import js.html.ImageElement;
import js.html.CanvasElement;

@:native("createjs.BitmapData")
extern class BitmapData
{
	public function new(image:ImageElement=null, width:Float=300, height:Float=150, fillColor:Dynamic=null):Void;
	public function getPixel(x:UInt, y:UInt):UInt;
	public function getPixel32(x:UInt, y:UInt):UInt;

	public var canvas:CanvasElement;
	public var width(default, null):UInt;
	public var height(default, null):UInt;
}
