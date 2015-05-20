package common;
enum CanvasColorSamplerEvent
{
	NONE;
	RESULT(pixelColorSet:Array<PixelColor>);
}
enum CanvasColorSamplerInitialErrorEvent
{
	NONE;
	ERROR(message:String);
}
