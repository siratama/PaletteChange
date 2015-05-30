package jsx.util;

import psd_private.CharacterID;
import psd_private.Lib;
import psd_private.DialogModes;
import psd_private.ActionReference;
import psd_private.ActionDescriptor;

class PrivateAPI
{
	public static function selectSingleLayer(layerName:String)
	{
		var idslct = Lib.charIDToTypeID(CharacterID.SELECT);
		var desc = new ActionDescriptor();
		var idnull = Lib.charIDToTypeID(CharacterID.NULL);
		var ref = new ActionReference();
		var idLyr = Lib.charIDToTypeID(CharacterID.LAYER);
		ref.putName(idLyr, layerName);
		desc.putReference(idnull, ref);
		var idMkVs = Lib.charIDToTypeID(CharacterID.MKVS);
		desc.putBoolean(idMkVs, false);
		Lib.executeAction(idslct, desc, DialogModes.NO);
	}
}
