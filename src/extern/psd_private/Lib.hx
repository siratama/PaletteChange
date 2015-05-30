package psd_private;
class Lib
{
	public static inline function charIDToTypeID(characterID:CharacterID):Int
	{
		return untyped __js__("charIDToTypeID")(characterID);
	}
	public static inline function executeAction(typeId:Int, actionDescriptor:ActionDescriptor, dialogModes:DialogModes)
	{
		untyped __js__("executeAction")(typeId, actionDescriptor, dialogModes);
	}
}
