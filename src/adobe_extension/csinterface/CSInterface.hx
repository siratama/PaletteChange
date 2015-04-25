package csinterface;

@:native("CSInterface")
extern class CSInterface
{
	public function new():Void;
	public function getSystemPath(pathType:String):String;

	//script type is not String
	//example: String + static Function
	public function evalScript(script:Dynamic, ?callback:Dynamic->Void):Void;
}

class AbstractCSInterface
{
	public var csInterface(default, null):CSInterface;

	public static function create():AbstractCSInterface{
		return new AbstractCSInterface(new CSInterface());
	}
	public function new(csInterface:CSInterface){
		this.csInterface = csInterface;
	}
	public function getExtensionUri():String{
		return "file:///" + csInterface.getSystemPath(SystemPath.EXTENSION);
	}
	public function evalScript(script:Dynamic, ?callback:Dynamic->Void){
		csInterface.evalScript(script, callback);
	}
}
