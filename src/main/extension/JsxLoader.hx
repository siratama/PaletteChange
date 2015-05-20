package extension;
import common.ClassName;
class JsxLoader
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private static inline var JSX_DIRECTORY = "/jsx/";
	private static inline var JSX_EXTENSION = ".jsx";
	private var loaded:Bool;

	private static var LOAD_JSX_SET = [
		ClassName.CANVAS_COLOR_SAMPLER,
		ClassName.PALETTE_CHANGE,
		//ClassName.PIXEL_SELECTOR,
		//ClassName.PIXEL_COLOR_SEARCH
	];
	private var loadIndex:Int;

	public function new()
	{
		csInterface = AbstractCSInterface.create();
		loadIndex = 0;
		load();
	}
	private function getJsxPath(fileName:String):String
	{
		return csInterface.getExtensionSystemPath() + JSX_DIRECTORY + fileName + JSX_EXTENSION;
	}
	public function run()
	{
		mainFunction();
	}
	private function load()
	{
		var fileName = LOAD_JSX_SET[loadIndex];
		var filePath = csInterface.getExtensionSystemPath() + JSX_DIRECTORY + fileName + JSX_EXTENSION;

		loaded = false;
		csInterface.evalFile(filePath, function(result){
			loaded = true;
		});
		mainFunction = observeToLoad;
	}
	private function observeToLoad()
	{
		if(!loaded) return;

		if(++loadIndex < LOAD_JSX_SET.length)
			load();
		else
			mainFunction = finish;
	}

	private function finish(){}
	public function isFinished():Bool
		return Reflect.compareMethods(mainFunction, finish);
}
