package extension;
import adobe.cep.SystemPath;
import adobe.cep.CSInterface;
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
	public function getExtensionSystemPath():String{
		return csInterface.getSystemPath(SystemPath.EXTENSION);
	}
	public function evalScript(script:Dynamic, ?callback:Dynamic->Void){
		csInterface.evalScript(script, callback);
	}
	public function evalFile(filePath:String, ?callback:Dynamic->Void){
		csInterface.evalScript('$.evalFile("$filePath");', callback);
	}
}
