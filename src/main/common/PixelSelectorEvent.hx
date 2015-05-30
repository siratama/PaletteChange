package common;
enum PixelSelectorEvent
{
	SELECTED;
	UNSELECTED;
}
enum PixelSelectorInitialErrorEvent
{
	NONE;
	UNSELECTED_SINGLE_LAYER;
	SELECTED_LAYER_SET;
	ERROR(message:String);
}
