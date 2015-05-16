package extension.color_sampler.palette;
import common.PixelColor;
import extension.option.Setting;
import extension.color_sampler.palette.Palette.LastFilledLine;
import jQuery.JQuery;
class Palette
{
	private static inline var LINE_TOTAL = 5;
	private var PAGE_CELL_TOTAL:Int;

	private var kind:PaletteKind;
	private var lines:Array<Line>;
	public var pixelColorSet(default, null):Array<PixelColor>;
	private var rgbHexColorMap:Map<String, Bool>;
	private var allowDuplicateColor:Bool;
	public var clickedCell(default, null):Cell;
	private var element:JQuery;

	public function new(parentElement:JQuery, kind:PaletteKind)
	{
		this.kind = kind;

		PAGE_CELL_TOTAL = LINE_TOTAL * Line.CELL_TOTAL;
		element = new JQuery(".palette", parentElement);

		rgbHexColorMap = new Map();
		pixelColorSet = [];
		lines = [];
		for (i in 0...LINE_TOTAL) lines.push(new Line(element, i));
		setEditableLastCell();
	}

	//
	public function updateRgbHexColor(addedRgbHexColor:String)
	{
		updateAllowDuplicateColor();
		addRgbHexColor(addedRgbHexColor);
		update();
	}
	public function updateRgbHexColorSet(addedPixelColorSet:Array<PixelColor>)
	{
		updateAllowDuplicateColor();
		addRgbHexColorSet(addedPixelColorSet);
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
	}
	private function addRgbHexColorSet(addedPixelColorSet:Array<PixelColor>)
	{
		for (i in 0...addedPixelColorSet.length)
			addRgbHexColor(addedPixelColorSet[i]);
	}
	private function addRgbHexColor(pixelColor:PixelColor)
	{
		if(rgbHexColorMap.exists(pixelColor.rgbHexValue) && !allowDuplicateColor) return;

		rgbHexColorMap.set(pixelColor.rgbHexValue, true);
		pixelColorSet.push(pixelColor);
	}

	public function clear()
	{
		pixelColorSet = [];
		rgbHexColorMap = new Map();
		update();
	}
	public function getMaximumIndex():Int
	{
		return (pixelColorSet.length < PAGE_CELL_TOTAL) ?
			0: Math.floor(pixelColorSet.length / PAGE_CELL_TOTAL);
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
				(splicedStartPosition > pixelColorSet.length) ? []:

				(splicedStartPosition + Line.CELL_TOTAL < pixelColorSet.length) ?
					pixelColorSet.slice(splicedStartPosition, splicedStartPosition + Line.CELL_TOTAL):
					pixelColorSet.slice(splicedStartPosition);

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
		var coloringCellTotal = pixelColorSet.length - startPosition;

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

	//
	public function searchClickedCell():Bool
	{
		for (line in lines)
		{
			var cell = line.searchClickedCell();
			if(cell != null){
				clickedCell = cell;
				return true;
			}
		}
		return false;
	}
	public function changeCellColor(pixelColor:PixelColor)
	{
		updateAllowDuplicateColor();
		if(!clickedCell.painted){
			addRgbHexColor(pixelColor);
		}
		else{
			if(rgbHexColorMap.exists(pixelColor.rgbHexValue) && !allowDuplicateColor) return;

			var baseRgbHexColor = clickedCell.rgbHexColor;
			rgbHexColorMap.remove(baseRgbHexColor);
			rgbHexColorMap.set(pixelColor.rgbHexValue, true);

			var displayedFirstCellIndex = PageUI.instance.pageNumber.index * PAGE_CELL_TOTAL;
			var registeredIndex = clickedCell.index + displayedFirstCellIndex;

			pixelColorSet.splice(registeredIndex, 1);
			pixelColorSet.insert(registeredIndex, pixelColor.rgbHexValue);
		}
		update();
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

	public function new(parentElement:JQuery, lineIndex:Int)
	{
		element = new JQuery("<tr>")
			.attr("class", "line")
			.appendTo(parentElement);

		cells = [];
		for (i in 0...CELL_TOTAL)
		{
			var cellIndex = lineIndex * CELL_TOTAL + i;
			var cell = new Cell(element, cellIndex);
			cells.push(cell);
		}
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
	public function searchClickedCell():Cell
	{
		for (i in 0...cells.length)
		{
			var cell = cells[i];
			if(cell.isClicked()){
				return cell;
			}
		}
		return null;
	}
}

class Cell
{
	public var index(default, null):Int;
	private var element:JQuery;
	public var painted(default, null):Bool;
	private static inline var EDITABLE = "cell editable";
	private static inline var ACTIVE = "cell active";
	//public var rgbHexColor(default, null):String;
	public var pixelColor(default, null):PixelColor;

	private var clicked:Bool;
	public function isClicked():Bool
	{
		var n = clicked;
		clicked = false;
		return n;
	}

	public function new(parentElement:JQuery, index:Int)
	{
		this.index = index;

		element = new JQuery("<td>")
			.attr("class", "cell")
			.appendTo(parentElement);

		element.mousedown(function(event)
		{
			if(
				element.attr("class") == EDITABLE ||
				element.attr("class") == ACTIVE
			){
				clicked = true;
			}
		});
	}
	public function fill(pixelColor:PixelColor)
	{
		this.pixelColor = pixelColor;
		element.css("background-color", '#${pixelColor.rgbHexValue}');
		painted = true;
		element.attr("class", ACTIVE);
	}
	public function clear()
	{
		pixelColor = null;
		element.css("background-color", 'transparent');
		painted = false;
		element.attr("class", "cell");
	}
	public function setEditabled()
	{
		element.attr("class", EDITABLE);
	}
}
