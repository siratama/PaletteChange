package jsx.util;
import psd.Document;
class ColorSamplePosition
{
	private var activeDocumentHeight:Float;
	private var activeDocumentWidth:Float;

	public function new()
	{
	}
	public function initialize(activeDocument:Document)
	{
		activeDocumentWidth = activeDocument.width;
		activeDocumentHeight = activeDocument.height;
	}
	public inline function getAdjustX(x:Int):Float
	{
		return (x == activeDocumentWidth) ? x : x + 0.1;
	}
	public inline function getAdjustY(y:Int):Float
	{
		return (y == activeDocumentHeight) ? y : y + 0.1;
	}
}
