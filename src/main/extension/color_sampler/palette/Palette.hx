package extension.color_sampler.palette;
import jQuery.JQuery;
class Palette
{
	private static inline var DEFAULT_TOTAL_X = 10;
	private static inline var DEFAULT_TOTAL_Y = 10;

	private var colorBlocks:Array<Array<ColorBlock>>;

	private var element:JQuery;
	public function new(parentElement:JQuery)
	{
		element = new JQuery(".palette", parentElement);

		colorBlocks = [];
		for (y in 0...DEFAULT_TOTAL_Y)
		{
			var colorBlocksX:Array<ColorBlock> = [];
			for (x in 0...DEFAULT_TOTAL_X)
			{
				var colorBlock = new ColorBlock(element);
				colorBlocksX.push(colorBlock);
			}
			colorBlocks.push(colorBlocksX);
		}
	}
}

class ColorBlock
{
	private static inline var BLOCK_PIXEL = 10;
	private var element:JQuery;
	public var painted(default, null):Bool;

	public function new(parentElement:JQuery)
	{
		element = new JQuery(".block").appendTo(parentElement);
		element.css("width", '${BLOCK_PIXEL}px');
		element.css("height", '${BLOCK_PIXEL}px');

		element.click(function(event){

		});
	}
	public function fill(rgbHexColor:String)
	{
		element.css("background-color", '#$rgbHexColor');
		painted = true;
	}
}
