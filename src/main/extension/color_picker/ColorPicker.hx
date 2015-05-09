package extension.color_picker;

enum ColorPickerEvent
{
	NONE;
	CANCELLED;
	GOTTEN(rgbHexValue:String);
}
class ColorPicker
{
	private var csInterface:AbstractCSInterface;
	private var event:ColorPickerEvent;
	public function getEvent():ColorPickerEvent
	{
		var n = event;
		event = ColorPickerEvent.NONE;
		return n;
	}

	public function new()
	{
		csInterface = AbstractCSInterface.create();
	}
	public function show()
	{
		event = ColorPickerEvent.NONE;
		csInterface.showColorPicker(true, function(bool)
		{
			if(bool == "false"){
				event = ColorPickerEvent.CANCELLED;
			}
			else{
				observeGettingColor();
			}
		});
	}
	private function observeGettingColor()
	{
		csInterface.evalScript("app.foregroundColor.rgb.hexValue;", function(data){
			event = ColorPickerEvent.GOTTEN(data);
		});
	}
}
