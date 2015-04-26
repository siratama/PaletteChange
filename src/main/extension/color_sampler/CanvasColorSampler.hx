package extension.color_sampler;
import jQuery.JQuery;
class CanvasColorSampler
{
	private var element:JQuery;
	private var palletContainer:PaletteContainer;

	public function new()
	{
		element = new JQuery("#canvas_color_sampler");
		palletContainer = new PaletteContainer(element);
	}
}
