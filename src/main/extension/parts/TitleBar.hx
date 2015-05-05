package extension.parts;
import jQuery.JQuery;
class TitleBar
{
	private static inline var SLIDE_SPEED = "fast";

	public function new(titleBarId:String, slideElement:JQuery)
	{
		var titleElement = new JQuery("#" + titleBarId);
		titleElement.mousedown(function(event){

			if(slideElement.is(":hidden"))
				slideElement.slideDown(SLIDE_SPEED);
			else
				slideElement.slideUp(SLIDE_SPEED);
		});
	}
}
