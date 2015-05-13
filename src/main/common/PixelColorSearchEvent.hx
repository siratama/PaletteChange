package common;
enum PixelColorSearchEvent
{
	NONE;
	SELECTED(x:Int, y:Int);
	UNSELECTED;
}
enum PixelColorSearchInitialErrorEvent
{
	NONE;
	ERROR(message:String);
}
