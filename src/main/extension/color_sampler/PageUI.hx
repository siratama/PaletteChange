package extension.color_sampler;
import jQuery.JQuery;
import extension.parts.Button;

enum PageUIEvent
{
	NONE;
	SELECTED_NEXT;
	SELECTED_PREV;
}
enum PageMaximumChangeEvent
{
	NONE;
	UP;
	DOWN;
}
class PageUI
{
	@:allow(extension.color_sampler) private static var instance(get, null):PageUI;
	private static inline function get_instance():PageUI
		return instance == null ? instance = new PageUI(): instance;

	private var element:JQuery;
	private var prevButton:PageButton;
	private var nextButton:PageButton;
	public var pageNumber(default, null):PageNumber;

	private var event:PageUIEvent;
	public function getEvent():PageUIEvent
	{
		var n = event;
		event = PageUIEvent.NONE;
		return n;
	}

	private function new()
	{
		element = new JQuery("#page_ui");
		prevButton = setButton("prev");
		nextButton = setButton("next");
		pageNumber = new PageNumber(element);

		event = PageUIEvent.NONE;
	}
	private function setButton(className:String):PageButton
	{
		var button = new PageButton(element, className);
		button.initialize();
		return button;
	}
	public function changeMaximumIndex(maximumIndex:Int):PageMaximumChangeEvent
	{
		var beforeMaximumIndex = pageNumber.maximumIndex;

		var wasMaximum = pageNumber.isMaximum();
		var wasMinimum = pageNumber.isMinimum();
		pageNumber.changeMaximumIndex(maximumIndex);

		if(pageNumber.isMaximum()){
			nextButton.disable();
		}
		if(pageNumber.isMinimum()){
			prevButton.disable();
		}
		return
			(beforeMaximumIndex == maximumIndex) ? PageMaximumChangeEvent.NONE:
			(beforeMaximumIndex > maximumIndex) ? PageMaximumChangeEvent.DOWN: PageMaximumChangeEvent.UP;
	}
	public function run()
	{
		if(prevButton.isClicked())
		{
			var wasMaximum = pageNumber.isMaximum();
			pageNumber.decrement();
			if(wasMaximum){
				nextButton.removeDisabled();
			}
			if(pageNumber.isMinimum()){
				prevButton.disable();
			}
			pageNumber.draw();
			event = PageUIEvent.SELECTED_PREV;
		}
		else if(nextButton.isClicked())
		{
			var wasMinimum = pageNumber.isMinimum();
			pageNumber.increment();
			if(wasMinimum){
				prevButton.removeDisabled();
			}
			if(pageNumber.isMaximum())
			{
				nextButton.disable();
			}
			pageNumber.draw();
			event = PageUIEvent.SELECTED_NEXT;
		}
	}
}
class PageNumber
{
	private var element:JQuery;
	public var index(default, null):Int;
	public static inline var DEFAULT_INDEX = 0;

	public var maximumIndex(default, null):Int;

	public function new(parentElement:JQuery)
	{
		element = new JQuery(".page", parentElement);
		index = DEFAULT_INDEX;
		maximumIndex = index;
		draw();
	}
	public function increment(){
		index++;
	}
	public function decrement(){
		index--;
	}
	public function isMinimum():Bool{
		return index == DEFAULT_INDEX;
	}
	public function isMaximum():Bool{
		return index == maximumIndex;
	}
	public function changeMaximumIndex(maximumIndex:Int)
	{
		this.maximumIndex = maximumIndex;
		index = maximumIndex;
	}
	public function draw()
	{
		element.text(index + 1);
	}
}

class PageButton extends Button
{
	public function initialize()
	{
		disable();
	}
}