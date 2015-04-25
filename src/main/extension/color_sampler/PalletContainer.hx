package extension.color_sampler;
import extension.color_sampler.pallet.PaletteKind;
import extension.color_sampler.pallet.PaletteArea;
import jQuery.JQuery;
class PalletContainer
{
	private var element:JQuery;
	public var before(default, null):PaletteArea;
	public var after(default, null):PaletteArea;
	private var clearButton:PalletClearButton;

	public function new(parentElement:JQuery)
	{
		element = new JQuery(".container", parentElement);
		before = new PaletteArea(element, PaletteKind.BEFORE);
		after = new PaletteArea(element, PaletteKind.AFTER);

		clearButton = new PalletClearButton(element, "clear_button");
	}
}
