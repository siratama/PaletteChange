package common;
enum PaletteChangeEvent
{
	NONE;
	SUCCESS;
}

enum PaletteChangeInitialErrorEvent
{
	NONE;
	ERROR(message:String);
}

