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
	private var rgbHexValueMap:Map<String, Bool>;
	public var clickedCell(default, null):Cell;
	private var element:JQuery;

	public function new(parentElement:JQuery, kind:PaletteKind)
	{
		this.kind = kind;

		PAGE_CELL_TOTAL = LINE_TOTAL * Line.CELL_TOTAL;
		element = new JQuery(".palette", parentElement);

		rgbHexValueMap = new Map();
		pixelColorSet = [];
		lines = [];
		for (i in 0...LINE_TOTAL) lines.push(new Line(element, i));
		setEditableLastCell();
	}

	//
	public function getRgbHexValueSet():Array<String>
	{
		var rgbHexValueSet = new Array<String>();
		for (pixelColor in pixelColorSet)
		{
			rgbHexValueSet.push(pixelColor.rgbHexValue);
		}
		return rgbHexValueSet;
	}
	public function isUnregisterableColor(rgbHexValue:String):Bool
	{
		return (rgbHexValueMap.exists(rgbHexValue) && !isAllowedDuplicateColor());
	}
	public function clear()
	{
		pixelColorSet = [];
		rgbHexValueMap = new Map();
		update();
	}
	public function getMaximumIndex():Int
	{
		return (pixelColorSet.length < PAGE_CELL_TOTAL) ?
		0: Math.floor(pixelColorSet.length / PAGE_CELL_TOTAL);
	}


	//
	public function addColorSet(addedPixelColorSet:Array<PixelColor>)
	{
		var isAllowedDuplicateColor = isAllowedDuplicateColor();
		for (pixelColor in addedPixelColorSet)
		{
			if(rgbHexValueMap.exists(pixelColor.rgbHexValue) && !isAllowedDuplicateColor) continue;

			rgbHexValueMap.set(pixelColor.rgbHexValue, true);
			pixelColorSet.push(pixelColor);
		}
		updateAllPixelColorPosition(addedPixelColorSet);
		update();
	}
	private function updateAllPixelColorPosition(scannedPixelColorSet:Array<PixelColor>)
	{
		for (scannedPixelColor in scannedPixelColorSet)
		{
			for (pixelColor in pixelColorSet)
			{
				if(scannedPixelColor.rgbHexValue == pixelColor.rgbHexValue){
					pixelColor.updatePosition(scannedPixelColor.x, scannedPixelColor.y);
				}
			}
		}
	}
	private function isAllowedDuplicateColor():Bool
	{
		return switch(kind)
		{
			case PaletteKind.BEFORE: false;
			case PaletteKind.AFTER:
				Setting.instance.isAllowedDuplucatePalletColorInPalletAfter();
		}
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

			var linePixelColorSet =
				(splicedStartPosition > pixelColorSet.length) ? []:

				(splicedStartPosition + Line.CELL_TOTAL < pixelColorSet.length) ?
					pixelColorSet.slice(splicedStartPosition, splicedStartPosition + Line.CELL_TOTAL):
					pixelColorSet.slice(splicedStartPosition);

			var line = lines[i];
			line.update(linePixelColorSet);
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
	public function changeClickedCellColor(pixelColor:PixelColor)
	{
		if(!clickedCell.painted)
		{
			rgbHexValueMap.set(pixelColor.rgbHexValue, true);
			pixelColorSet.push(pixelColor);
		}
		else
		{
			var baseRgbHexValue = clickedCell.pixelColor.rgbHexValue;
			rgbHexValueMap.remove(baseRgbHexValue);
			rgbHexValueMap.set(pixelColor.rgbHexValue, true);

			var displayedFirstCellIndex = PageUI.instance.pageNumber.index * PAGE_CELL_TOTAL;
			var registeredIndex = clickedCell.index + displayedFirstCellIndex;

			pixelColorSet.splice(registeredIndex, 1);
			pixelColorSet.insert(registeredIndex, pixelColor);
		}
		update();
	}
	public function updateClickedCellScanPosition(x:Int, y:Int)
	{
		clickedCell.pixelColor.updatePosition(x, y);
	}
}
enum LastFilledLine
{
	ANOTHER_PAGE;
	INDEX(index:Int);
}

private class Line
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
	public function update(pixelColorSet:Array<PixelColor>)
	{
		for (i in 0...CELL_TOTAL)
		{
			var cell = cells[i];
			if(i < pixelColorSet.length){
				cell.fill(pixelColorSet[i]);
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
		for (cell in cells){
			if(cell.isClicked()){
				return cell;
			}
		}
		return null;
	}
}

private class Cell
{
	public var index(default, null):Int;
	private var element:JQuery;
	public var painted(default, null):Bool;
	private static inline var EDITABLE = "cell editable";
	private static inline var ACTIVE = "cell active";
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
