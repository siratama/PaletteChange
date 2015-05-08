package extension.palette_change;
import jQuery.JQuery;
class PaletteChangeUI
{
	@:allow(extension) private static var instance(get, null):PaletteChangeUI;
	private static inline function get_instance():PaletteChangeUI
		return instance == null ? instance = new PaletteChangeUI(): instance;

	private var element:JQuery;
	public var runButton(default, null):RunButton;
	private function new()
	{
		element =  new JQuery("#palette_changer");
		runButton = new RunButton(element, "run_button");
	}
}
