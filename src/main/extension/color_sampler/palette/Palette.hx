package extension.color_sampler.palette;
import jQuery.JQuery;
class Palette
{
	private static inline var LINE_TOTAL = 5;

	private var lines:Array<Line>;

	private var element:JQuery;
	public function new(parentElement:JQuery)
	{
		element = new JQuery(".palette", parentElement);
		lines = [];
		for (i in 0...LINE_TOTAL) lines.push(new Line(element));
	}
}

class Line
{
	public static inline var CELL_TOTAL = 10;
	public var cells(default, null):Array<Cell>;
	private var element:JQuery;

	public function new(parentElement:JQuery)
	{
		element = new JQuery("<tr>")
			.attr("class", "line")
			.appendTo(parentElement);

		cells = [];
		for (i in 0...CELL_TOTAL) cells.push(new Cell(element));
	}
}

class Cell
{
	private var element:JQuery;
	public var painted(default, null):Bool;

	public function new(parentElement:JQuery)
	{
		element = new JQuery("<td>")
			//.attr("class", "cell")
			//.attr("class", "cell active")
			.attr("class", "cell editable")
			.appendTo(parentElement);

		element.click(function(event){

		});
	}
	public function fill(rgbHexColor:String)
	{
		element.css("background-color", '#$rgbHexColor');
		painted = true;
	}
	public function clear()
	{
		element.css("background-color", 'transparent');
		painted = false;
	}
}
