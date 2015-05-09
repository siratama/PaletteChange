package extension.color_sampler;
import extension.color_sampler.palette.Palette;
import extension.color_sampler.palette.PaletteKind;
import extension.parts.TitleBar;
import extension.color_sampler.PageUI.PageMaximumChangeEvent;
import extension.color_sampler.PageUI.PageUIEvent;
import jQuery.JQuery;
class CanvasColorSamplerUI
{
	private var element:JQuery;
	public var paletteContainer(default, null):PaletteContainer;
	private var pageUI:PageUI;

	@:allow(extension) private static var instance(get, null):CanvasColorSamplerUI;
	private static inline function get_instance():CanvasColorSamplerUI
		return instance == null ? instance = new CanvasColorSamplerUI(): instance;

	private function new()
	{
		element = new JQuery("#canvas_color_sampler");
		paletteContainer = new PaletteContainer(element);
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
				paletteContainer.changePage();
		}
	}
	private function ovserveClearButton()
	{
		if(paletteContainer.before.clearButton.isClicked())
		{
			paletteContainer.before.palette.clear();
			updatePageIndex();
		}
		else if(paletteContainer.after.clearButton.isClicked())
		{
			paletteContainer.after.palette.clear();
			updatePageIndex();
		}
	}
	public function updatePageIndex()
	{
		var changedEvent = pageUI.changeMaximumIndex(paletteContainer.getPageMaximumIndex());
		switch(changedEvent)
		{
			case PageMaximumChangeEvent.DOWN:
				paletteContainer.changePage();
			case PageMaximumChangeEvent.UP | PageMaximumChangeEvent.NONE:
				return;
		}
	}

	public function changeCellColor(paletteKind:PaletteKind, rgbHexColor:String)
	{
		var palette:Palette = switch(paletteKind)
		{
			case PaletteKind.BEFORE: paletteContainer.before.palette;
			case PaletteKind.AFTER: paletteContainer.after.palette;
		}
		palette.changeCellColor(rgbHexColor);
	}
}
