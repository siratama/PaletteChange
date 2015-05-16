package extension.color_picker;

enum ColorPickerDialogEvent
{
	NONE;
	CANCELLED;
	GOTTEN(rgbHexValue:String);
}
class ColorPickerDialog
{
	private var csInterface:AbstractCSInterface;
	private var event:ColorPickerDialogEvent;
	public function getEvent():ColorPickerDialogEvent
	{
		var n = event;
		event = ColorPickerDialogEvent.NONE;
		return n;
	}
	public function new()
	{
		csInterface = AbstractCSInterface.create();
	}
	public function show()
	{
		event = ColorPickerDialogEvent.NONE;
		csInterface.showColorPicker(true, function(bool)
		{
			if(bool == "false"){
				event = ColorPickerDialogEvent.CANCELLED;
			}
			else{
				observeGettingColor();
			}
		});
	}
	private function observeGettingColor()
	{
		csInterface.evalScript("app.foregroundColor.rgb.hexValue;", function(data){
			event = ColorPickerDialogEvent.GOTTEN(data);
		});
	}
}
