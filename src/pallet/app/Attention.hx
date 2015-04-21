package app;
import jQuery.JQuery;
class Attention
{
	@:allow(app) private static var instance(get, null):Attention;
	private static inline function get_instance():Attention
		return instance == null ? instance = new Attention(): instance;

	private var element:JQuery;
	private function new()
	{
		element = new JQuery("#attention");
	}
	public function show(message:String)
	{
		element.text(message);
	}
	public function clear()
	{
		element.text("");
	}
}
