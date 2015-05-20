package extension.parts;
import jQuery.JQuery;

class Button
{
	private var element:JQuery;

	private var clicked:Bool;
	public function isClicked():Bool
	{
		var n = clicked;
		clicked = false;
		return n;
	}

	public function new(parentElement:JQuery, className:String)
	{
		element = new JQuery('.$className', parentElement);
		element.click(function(event){
			clicked = true;
		});
	}
	public function disable()
	{
		element.attr("disabled", "disabled");
	}
	public function removeDisabled()
	{
		element.removeAttr("disabled");
	}

	public function isDisabled():Bool
	{
		return element.attr("disabled") != null;
	}
}
