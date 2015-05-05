package psd;

@:native("LayerTypeName")
@:fakeEnum(String)
extern enum LayerTypeName
{
	LAYER_SET;
}

@:native("LayerTypeName")
private class Impl
{
	public static inline var LAYER_SET = "LayerSet";
}
