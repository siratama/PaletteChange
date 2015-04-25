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
}
