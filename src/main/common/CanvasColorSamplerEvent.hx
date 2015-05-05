package common;
enum CanvasColorSamplerEvent
{
	NONE;
	RESULT(rgbHexColorSet:Array<String>);
}
enum InitialErrorEvent
{
	NONE;
	ERROR(message:String);
}
