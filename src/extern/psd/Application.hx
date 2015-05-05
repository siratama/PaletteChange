package psd;

@:native("Application")
extern class Application
{
	public var activeDocument:Document;
	public var documents(default, null):Documents;
}
