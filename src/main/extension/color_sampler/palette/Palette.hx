package extension.color_sampler.palette;
import extension.option.Setting;
import extension.color_sampler.palette.Palette.LastFilledLine;
import jQuery.JQuery;
class Palette
{
	private static inline var LINE_TOTAL = 5;
	private var PAGE_CELL_TOTAL:Int;

	private var kind:PaletteKind;
	private var lines:Array<Line>;
	public var rgbHexColorSet(default, null):Array<String>;
	private var rgbHexColorMap:Map<String, Bool>;
	private var allowDuplicateColor:Bool;

	private var element:JQuery;
	public function new(parentElement:JQuery, kind:PaletteKind)
	{
		this.kind = kind;
		PAGE_CELL_TOTAL = LINE_TOTAL * Line.CELL_TOTAL;
		element = new JQuery(".palette", parentElement);

		rgbHexColorMap = new Map();
		rgbHexColorSet = [];
		lines = [];
		for (i in 0...LINE_TOTAL) lines.push(new Line(element));
		setEditableLastCell();
	}

	//
	public function updateRgbHexColor(addedRgbHexColor:String)
	{
		updateAllowDuplicateColor();
		addRgbHexColor(addedRgbHexColor);
		update();
	}
	public function updateRgbHexColorSet(addedRgbHexColorSet:Array<String>)
	{
		updateAllowDuplicateColor();
		addRgbHexColorSet(addedRgbHexColorSet);
		update();
	}
	private function updateAllowDuplicateColor()
	{
		allowDuplicateColor = switch(kind)
		{
			case PaletteKind.BEFORE: false;
			case PaletteKind.AFTER:
				Setting.instance.isAllowedDuplucatePalletColorInPalletAfter();
		}
		trace(allowDuplicateColor);
	}
	private function addRgbHexColorSet(addedRgbHexColorSet:Array<String>)
	{
		for (i in 0...addedRgbHexColorSet.length)
			addRgbHexColor(addedRgbHexColorSet[i]);
	}
	private function addRgbHexColor(addedRgbHexColor:String)
	{
		var exists = rgbHexColorMap.exists(addedRgbHexColor);
		if(exists && !allowDuplicateColor) return;

		rgbHexColorMap.set(addedRgbHexColor, true);
		rgbHexColorSet.push(addedRgbHexColor);
	}

	public function clear()
	{
		rgbHexColorSet = [];
		rgbHexColorMap = new Map();
		update();
	}
	public function getMaximumIndex():Int
	{
		return (rgbHexColorSet.length < PAGE_CELL_TOTAL) ?
			0: Math.floor(rgbHexColorSet.length / PAGE_CELL_TOTAL);
	}

	//
	public function update()
	{
		updateLine();
		setEditableLastCell();
	}
	private function updateLine()
	{
		var displayedFirstCellIndex = PageUI.instance.pageNumber.index * PAGE_CELL_TOTAL;

		for (i in 0...LINE_TOTAL)
		{
			var splicedStartPosition = displayedFirstCellIndex + (i * Line.CELL_TOTAL);

			var lineRgbHexColorSet =
				(splicedStartPosition > rgbHexColorSet.length) ? []:

				(splicedStartPosition + Line.CELL_TOTAL < rgbHexColorSet.length) ?
					rgbHexColorSet.slice(splicedStartPosition, splicedStartPosition + Line.CELL_TOTAL):
					rgbHexColorSet.slice(splicedStartPosition);

			var line = lines[i];
			line.update(lineRgbHexColorSet);
		}
	}
	private function setEditableLastCell()
	{
		var lastFilledLine = getLastFilledLineIndex();
		switch(lastFilledLine)
		{
			case LastFilledLine.ANOTHER_PAGE: return;

			case LastFilledLine.INDEX(index):
				var line = lines[index];
				line.setEditableLastCell();
		}
	}
	private function getLastFilledLineIndex():LastFilledLine
	{
		var startPosition = PageUI.instance.pageNumber.index * PAGE_CELL_TOTAL;
		var coloringCellTotal = rgbHexColorSet.length - startPosition;

		//editable cell of another page
		if(coloringCellTotal >= PAGE_CELL_TOTAL || coloringCellTotal < 0)
		{
			return LastFilledLine.ANOTHER_PAGE;
		}
		else
		{
			return LastFilledLine.INDEX(Math.floor(coloringCellTotal / Line.CELL_TOTAL));
		}
	}
}
enum LastFilledLine
{
	ANOTHER_PAGE;
	INDEX(index:Int);
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
	public function update(rgbHexColorSet:Array<String>)
	{
		for (i in 0...CELL_TOTAL)
		{
			var cell = cells[i];
			if(i < rgbHexColorSet.length){
				cell.fill(rgbHexColorSet[i]);
			}
			else{
				cell.clear();
			}
		}
	}
	public function setEditableLastCell()
	{
		for (i in 0...CELL_TOTAL)
		{
			var cell = cells[i];
			if(cell.painted) continue;
			cell.setEditabled();
			break;
		}
	}
}

class Cell
{
	private var element:JQuery;
	public var painted(default, null):Bool;
	
	private var clicked:Bool;
	public function isClicked():Bool
	{
		var n = clicked;
		clicked = false;
		return n;
	}

	public function new(parentElement:JQuery)
	{
		element = new JQuery("<td>")
			.attr("class", "cell")
			.appendTo(parentElement);

		element.click(function(event){
			clicked = true;
		});
	}
	public function fill(rgbHexColor:String)
	{
		element.css("background-color", '#$rgbHexColor');
		painted = true;
		element.attr("class", "cell active");
	}
	public function clear()
	{
		element.css("background-color", 'transparent');
		painted = false;
		element.attr("class", "cell");
	}
	public function setEditabled()
	{
		element.attr("class", "cell editable");
	}
}
