package extension.color_sampler;
import extension.parts.TitleBar;
import extension.color_sampler.PageUI.PageMaximumChangeEvent;
import extension.color_sampler.PageUI.PageUIEvent;
import jQuery.JQuery;
class CanvasColorSampler
{
	private var element:JQuery;
	public var palletContainer(default, null):PaletteContainer;
	private var pageUI:PageUI;

	@:allow(extension) private static var instance(get, null):CanvasColorSampler;
	private static inline function get_instance():CanvasColorSampler
		return instance == null ? instance = new CanvasColorSampler(): instance;

	private function new()
	{
		element = new JQuery("#canvas_color_sampler");
		palletContainer = new PaletteContainer(element);
		pageUI = PageUI.instance;
		new TitleBar("title_canvas_color_sampler", element);
	}
	public function run()
	{
		ovservePageUI();
		ovserveClearButton();
	}
	private function ovservePageUI()
	{
		pageUI.run();
		var pageUIEvent = pageUI.getEvent();
		switch(pageUIEvent)
		{
			case PageUIEvent.NONE: return;
			case PageUIEvent.SELECTED_PREV | PageUIEvent.SELECTED_NEXT:
				palletContainer.changePage();
		}
	}
	private function ovserveClearButton()
	{
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
