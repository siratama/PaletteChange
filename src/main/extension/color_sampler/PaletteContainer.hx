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
	public function changePage()
	{
		before.palette.update();
		after.palette.update();
	}
	public function getPageMaximumIndex():Int
	{
		var beforeMaximumIndex = before.palette.getMaximumIndex();
		var afterMaximumIndex = after.palette.getMaximumIndex();
		return (beforeMaximumIndex >= afterMaximumIndex) ? beforeMaximumIndex: afterMaximumIndex;
	}
	public function getRgbHexValueSets():Array<Array<String>>
	{
		var beforePalette = before.palette.pixelColorSet.copy();
		var afterPalette = after.palette.pixelColorSet.copy();
		var beforeLength = beforePalette.length;
		var afterLength = afterPalette.length;
		if(beforeLength > afterLength){
			beforePalette.splice(afterLength, beforeLength);
		}
		else if(afterLength > beforeLength){
			afterPalette.splice(beforeLength, afterLength);
		}

		return [beforePalette, afterPalette];
	}
}
