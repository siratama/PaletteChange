package extension.palette_changer;
import jQuery.JQuery;
class PaletteChanger
{
	private var element:JQuery;
	private var runButton:RunButton;
	public function new()
	{
		element =  new JQuery("#palette_changer");
		runButton = new RunButton(element, "run_button");
	}
}
