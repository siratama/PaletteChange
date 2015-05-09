package extension.color_sampler.palette;
import extension.parts.Button;
import jQuery.JQuery;
import jQuery.JQuery;
class PaletteArea
{
	private var element:JQuery;
	public var palette(default, null):Palette;
	public var scanButton(default, null):Button;
	public var clearButton(default, null):Button;

	public function new(parentElement:JQuery, kind:PaletteKind)
	{
		var idName = switch(kind){
			case PaletteKind.BEFORE: "before";
			case PaletteKind.AFTER: "after";
		}
		element = new JQuery('.$idName', parentElement);

		palette = new Palette(element, kind);
		scanButton = new Button(element, "scan_button");
		clearButton = new Button(element, "clear_button");
	}
}
