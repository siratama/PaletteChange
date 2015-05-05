package extension.option;
import extension.parts.TitleBar;
import jQuery.JQuery;
class Setting
{
	@:allow(extension) private static var instance(get, null):Setting;
	private static inline function get_instance():Setting
		return instance == null ? instance = new Setting(): instance;

	private var element:JQuery;

	private function new()
	{
		element = new JQuery("#setting");
		new TitleBar("title_option", element);
	}

	public function isAllowedDuplucatePalletColorInPalletAfter():Bool{
		return isChecked("duplicate_color");
	}
	public function isIgnoredLockedLayerPaint():Bool{
		return isChecked("ignore_locked");
	}
	private function isChecked(className:String):Bool{
		return new JQuery('.$className', element).is(":checked");
	}
}
