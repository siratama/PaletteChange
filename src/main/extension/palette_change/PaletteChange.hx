package extension.palette_change;
import jQuery.JQuery;
class PaletteChange
{
	private var element:JQuery;
	public var runButton(default, null):RunButton;
	public function new()
	{
		element =  new JQuery("#palette_changer");
		runButton = new RunButton(element, "run_button");
	}
}
