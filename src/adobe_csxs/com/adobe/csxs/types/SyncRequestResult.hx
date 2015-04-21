package com.adobe.csxs.types;

@:native("com.adobe.csxs.types.SyncRequestResult")
extern class SyncRequestResult
{
	public var data(default, null):Dynamic;
	public var status(default, null):String;

	public function new():Void;
	public function toString():String;

	public static inline var COMPLETE:String = "PlugPlugRequestComplete";
	public static inline var DENIED:String = "PlugPlugRequestDenied";
	public static inline var EXTERNALINTERFACE_NOT_AVAILABLE:String = "ExternalInterfaceNotAvailable";
	public static inline var failed:String = "PlugPlugRequestFailed";
	public static inline var invalid_input_params:String = "InvalidInputParams";
	public static inline var invalid_return_params:String = "InvalidReturnParams";
}
