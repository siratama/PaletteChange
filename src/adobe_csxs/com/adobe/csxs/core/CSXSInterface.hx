package com.adobe.csxs.core;

import com.adobe.csxs.types.SyncRequestResult;
@:native("com.adobe.csxs.core.CSXSInterface")
extern class CSXSInterface
{
	public static var instance(default, null):CSXSInterface;
	//public static function instance():CSXSInterface;
	public function new(caller:Dynamic):Void;
	//public function evalScript(functionName:String, ?stringArguments:Array<String>):SyncRequestResult;
	public function getHostEnvironment():SyncRequestResult;
	public static function getInstance():CSXSInterface;
}
