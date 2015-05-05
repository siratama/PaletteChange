package psd;

@:native("Documents")
extern class Documents implements ArrayAccess<Layer>
{
	public var length(default, null):Int;
}
