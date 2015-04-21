package app;
import js.html.File;
import js.html.FileList;
import jQuery.Event;
import jQuery.JQuery;

enum DropZoneEvent
{
	NONE;
	DROP_FILE_ERROR(message:String);
	DROPPED(file:File);
}

class DropZone
{
	private var event:DropZoneEvent;
	public function getEvent():DropZoneEvent
	{
		var n = event;
		event = DropZoneEvent.NONE;
		return n;
	}

	@:allow(app) private static var instance(get, null):DropZone;
	private static inline function get_instance():DropZone
		return instance == null ? instance = new DropZone(): instance;

	private function new()
	{
		var dropZoneElement = new JQuery(".drop_zone");
		dropZoneElement.on("drop", drop);
		dropZoneElement.on("dragover", dragover);
		event = DropZoneEvent.NONE;
	}
	private function dragover(event:Event)
	{
		preventEvent(event);
		untyped event.originalEvent.dataTransfer.dropEffect = "copy";
	}
	private function drop(event:Event)
	{
		preventEvent(event);
		var files:FileList = untyped event.originalEvent.dataTransfer.files;
		var file:File = files[0];
		if(!~/image.*/.match(file.type)){
			this.event = DropZoneEvent.DROP_FILE_ERROR("Set image file");
		}
		else{
			this.event = DropZoneEvent.DROPPED(file);
		}
	}
	private function preventEvent(event:Event)
	{
		event.preventDefault();
		event.stopPropagation();
	}
}
