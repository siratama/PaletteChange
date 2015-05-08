package csinterface;

@:native("CSEventScope")
@:fakeEnum(String)
extern enum CSEventScope
{
	APPLICATION;
}

@:native("CSEventScope")
private class Impl
{
	public static inline var APPLICATION = "APPLICATION";
}
