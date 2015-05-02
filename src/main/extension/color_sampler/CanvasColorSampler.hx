package extension.color_sampler;
import extension.color_sampler.PageUI.PageMaximumChangeEvent;
import extension.color_sampler.PageUI.PageUIEvent;
import jQuery.JQuery;
class CanvasColorSampler
{
	private var element:JQuery;
	public var palletContainer(default, null):PaletteContainer;
	private var pageUI:PageUI;

	public function new()
	{
		element = new JQuery("#canvas_color_sampler");
		palletContainer = new PaletteContainer(element);
		pageUI = PageUI.instance;
	}
	public function run()
	{
		pageUI.run();
		var pageUIEvent = pageUI.getEvent();
		switch(pageUIEvent)
		{
			case PageUIEvent.NONE: return;
			case PageUIEvent.SELECTED_PREV | PageUIEvent.SELECTED_NEXT:
				palletContainer.changePage();
		}

		if(palletContainer.before.clearButton.isClicked())
		{
			palletContainer.before.palette.clear();
			updatePageIndex();
		}
		else if(palletContainer.after.clearButton.isClicked())
		{
			palletContainer.after.palette.clear();
			updatePageIndex();
		}
	}
	public function updatePageIndex()
	{
		var changedEvent = pageUI.changeMaximumIndex(palletContainer.getPageMaximumIndex());
		switch(changedEvent)
		{
			case PageMaximumChangeEvent.DOWN:
				palletContainer.changePage();
			case PageMaximumChangeEvent.UP | PageMaximumChangeEvent.NONE:
				return;
		}
	}
}
