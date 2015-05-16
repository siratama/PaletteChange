package common;
enum PixelSelectorEvent
{
	SELECTED;
	UNSELECTED;
}
enum PixelSelectorInitialErrorEvent
{
	NONE;
	ERROR(message:String);
}
