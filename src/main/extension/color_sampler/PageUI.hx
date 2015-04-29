package extension.color_sampler;
import jQuery.JQuery;
import extension.parts.Button;
class PageUI
{
	private var element:JQuery;
	private var leftButton:ScrollButton;
	private var rightButton:ScrollButton;
	private var pageNumber:PageNumber;

	public function new()
	{
		element = new JQuery("#page_ui");
		leftButton = setButton("prev");
		rightButton = setButton("next");
		pageNumber = new PageNumber(element);
	}
	private function setButton(className:String):ScrollButton
	{
		var button = new ScrollButton(element, className);
		button.initialize();
		return button;
	}
}
class PageNumber
{
	private var element:JQuery;
	public var index(default, null):Int;
	public static inline var DEFAULT_INDEX = 1;

	public function new(parentElement:JQuery)
	{
		element = new JQuery(".page", parentElement);
		element.text(DEFAULT_INDEX);
	}

}

class ScrollButton extends Button
{
	public function initialize()
	{
		element.attr("disabled", "disabled");
	}
}