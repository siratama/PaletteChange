package extension;
import common.ClassName;
class JsxLoader
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private static inline var JSX_DIRECTORY = "/jsx/";
	private static inline var JSX_EXTENSION = ".jsx";
	private var loaded:Bool;

	public function new()
	{
		csInterface = AbstractCSInterface.create();
		loadCanvasColorSampler();
	}
	private function getJsxPath(fileName:String):String
	{
		return csInterface.getExtensionSystemPath() + JSX_DIRECTORY + fileName + JSX_EXTENSION;
	}
	public function run()
	{
		mainFunction();
	}
	private function loadCanvasColorSampler()
	{
		loaded = false;
		var filePath = getJsxPath(ClassName.CANVAS_COLOR_SAMPLER);
		csInterface.evalFile(filePath, function(result){
			loaded = true;
		});
		mainFunction = observeToLoadCanvasColorSampler;
	}
	private function observeToLoadCanvasColorSampler()
	{
		if(loaded)
			loadPaletteChange();
		
	}
	private function loadPaletteChange()
	{
		loaded = false;
		var filePath = getJsxPath(ClassName.PALETTE_CHANGE);
		csInterface.evalFile(filePath, function(result){
			loaded = true;
		});
		mainFunction = observeToLoadPaletteChange;
	}
	private function observeToLoadPaletteChange()
	{
		if(loaded)
			mainFunction = finish;
	}
	private function finish(){}
	public function isFinished():Bool
		return Reflect.compareMethods(mainFunction, finish);
}
