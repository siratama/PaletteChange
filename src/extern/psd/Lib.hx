package psd;
class Lib
{
	public static var app:Application = untyped __js__("app");

/*
	public static function alert(alertText:Dynamic):Void {
		untyped __js__("alert")(alertText);
	}
	*/

	public static function writeln(message:Dynamic) {
		untyped $.writeln(message);
	}
}
