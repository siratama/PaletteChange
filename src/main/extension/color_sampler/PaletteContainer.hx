package extension.color_sampler;
import extension.color_sampler.palette.PaletteKind;
import extension.color_sampler.palette.PaletteArea;
import jQuery.JQuery;
class PaletteContainer
{
	private var element:JQuery;
	public var before(default, null):PaletteArea;
	public var after(default, null):PaletteArea;

	public function new(parentElement:JQuery)
	{
		element = new JQuery(".container", parentElement);
		before = new PaletteArea(element, PaletteKind.BEFORE);
		after = new PaletteArea(element, PaletteKind.AFTER);
	}
}
