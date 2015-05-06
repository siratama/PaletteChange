package common;
enum CanvasColorSamplerEvent
{
	NONE;
	RESULT(rgbHexColorSet:Array<String>);
}
enum CanvasColorSamplerInitialErrorEvent
{
	NONE;
	ERROR(message:String);
}
