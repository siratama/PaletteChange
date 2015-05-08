package extension.overlay;
import extension.parts.Button;
import jQuery.JQuery;
class OverlayWindow
{
	@:allow(extension) private static var instance(get, null):OverlayWindow;
	private static inline function get_instance():OverlayWindow
		return instance == null ? instance = new OverlayWindow(): instance;

	private static inline var FACE_SPEED = "fast";
	public var cancelButton(default, null):Button;
	private var messageElement:JQuery;

	private var element:JQuery;
	private function new()
	{
		element =  new JQuery("#overlay");
		cancelButton = new Button(element, "cancel_button");
		messageElement = new JQuery(".message", element);
	}

	public function showCanvasColorSamplerRunning()
	{
		show("Color sampling...");
	}
	public function showPaletteChangeRunning()
	{
		show("Palette changing...");
	}
	private function show(message:String)
	{
		messageElement.text(message);
		element.fadeIn(FACE_SPEED);
	}
	public function hide()
	{
		element.fadeOut(FACE_SPEED);
	}
}
