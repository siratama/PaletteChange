package csinterface;

class CSInterfaceUtil {
	public var csInterface(default, null):CSInterface;

	public static function create():CSInterfaceUtil{
		return new CSInterfaceUtil(new CSInterface());
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
