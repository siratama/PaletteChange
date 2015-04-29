package extension.color_sampler.palette;
import jQuery.JQuery;
import jQuery.JQuery;
class PaletteArea
{
	private var element:JQuery;
	private var palette:Palette;
	private var scanButton:ScanButton;
	private var clearButton:PaletteClearButton;

	public function new(parentElement:JQuery, kind:PaletteKind)
	{
		var idName = switch(kind){
			case PaletteKind.BEFORE: "before";
			case PaletteKind.AFTER: "after";
		}
		element = new JQuery('.$idName', parentElement);

		palette = new Palette(element);
		scanButton = new ScanButton(element, "scan_button");
		clearButton = new PaletteClearButton(element, "clear_button");
	}
}
