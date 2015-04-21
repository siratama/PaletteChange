package app;

import app.ImageFileReader.ImageFileReaderEvent;
import app.DropZone.DropZoneEvent;
import js.html.File;
import haxe.Timer;
import jQuery.JQuery;

class Pallet
{
	private var mainFunction:Void->Void;
	private var timer:Timer;

	private var dropZone:DropZone;
	private var attention:Attention;
	private var imageFileReader:ImageFileReader;
	private var imageViewer:ImageViewer;

	public static function main()
	{
		new Pallet();
	}
	public function new()
	{
		new JQuery(function(){ initialize(); });
	}
	public function initialize()
	{
		dropZone = DropZone.instance;
		attention = Attention.instance;
		imageFileReader = ImageFileReader.instance;
		imageViewer = ImageViewer.instance;

		mainFunction = waitToDropImageFile;
		timer = new Timer(100);
		timer.run = run;
	}
	public function run()
	{
		mainFunction();
	}
	private function waitToDropImageFile()
	{
		var event = dropZone.getEvent();
		switch(event){
			case DropZoneEvent.NONE: return;
			case DropZoneEvent.DROP_FILE_ERROR(message):
				attention.show(message);
			case DropZoneEvent.DROPPED(file):
				initializeToReadImageFile(file);
		}
	}

	private function initializeToReadImageFile(file:File)
	{
		imageFileReader.start(file);
		mainFunction = readImageFile;
	}
	private function readImageFile()
	{
		var event = imageFileReader.getEvent();
		switch(event){
			case ImageFileReaderEvent.NONE: return;
			case ImageFileReaderEvent.READ(data):
				attention.clear();
				imageViewer.show(data);
				mainFunction = finish;
		}
	}
	private function finish()
	{
		timer.stop();
	}
}
