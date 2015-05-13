package common;
enum PixelSelecterEvent
{
	SELECTED;
	UNSELECTED;
}
enum PixelSelecterInitialErrorEvent
{
	NONE;
	ERROR(message:String);
}
