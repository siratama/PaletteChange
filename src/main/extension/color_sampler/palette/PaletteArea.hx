package extension.color_sampler.palette;
import jQuery.JQuery;
import jQuery.JQuery;
class PaletteArea
{
	private var element:JQuery;
	public var palette(default, null):Palette;
	public var scanButton(default, null):ScanButton;
	public var clearButton(default, null):ClearButton;

	public function new(parentElement:JQuery, kind:PaletteKind)
	{
		var idName = switch(kind){
			case PaletteKind.BEFORE: "before";
			case PaletteKind.AFTER: "after";
		}
		element = new JQuery('.$idName', parentElement);

		palette = new Palette(element);
		scanButton = new ScanButton(element, "scan_button");
		clearButton = new ClearButton(element, "clear_button");
	}
}
