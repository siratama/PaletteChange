package psd;
class Lib
{
	public static var app:Application = untyped app;

	public static function alert(message:Dynamic):Void {
		js.Lib.alert(message);
	}

	public static function writeIn(message:Dynamic) {
		untyped $.writeln(message);
	}
}
