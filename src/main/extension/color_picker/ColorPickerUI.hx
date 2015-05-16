package extension.color_picker;

import extension.color_picker.PixelColorSearchRunner.PixelColorSearchRunnerEvent;
import extension.parts.Button;
import common.PixelSelectorEvent;
import extension.color_picker.PixelSelectorRunner.PixelSelectorRunnerEvent;
import common.PixelColor;
import jQuery.JQuery;
import extension.color_picker.ColorPickerDialog.ColorPickerDialogEvent;
enum ColorPickerUIEvent
{
	NONE;
	ERROR(message:String);
	DIALOG_CANCELLED_STILL_TRANSPARENT;
	CLOSED(pixelColor:PixelColor);
}
class ColorPickerUI
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private var element:JQuery;
	private var editColorButton:Button;
	private var colorSearchButton:Button;
	private var closeButton:Button;

	private var dialog:ColorPickerDialog;
	private var pixelSelectorRunner:PixelSelectorRunner;
	private var pixelColorSearchRunner:PixelColorSearchRunner;
	
	private var pixelColor:PixelColor;

	private var event:ColorPickerUIEvent;
	public function getEvent():ColorPickerUIEvent
	{
		var n = event;
		event = ColorPickerUIEvent.NONE;
		return n;
	}

	public function new()
	{
		csInterface = AbstractCSInterface.create();
		dialog = new ColorPickerDialog();
		pixelSelectorRunner = new PixelSelectorRunner();
		pixelColorSearchRunner = new PixelColorSearchRunner();

		element = new JQuery("#color_picker");
		editColorButton = new Button(element, "edit_color");
		colorSearchButton = new Button(element, "color_search");
		closeButton = new Button(element, "close");
	}
	public function run()
	{
		mainFunction();
	}
	public function show(pixelColor:PixelColor)
	{
		this.pixelColor = pixelColor;
		element.css("display", "block");

		if(pixelColor != null)
		{
			csInterface.evalScript('app.foregroundColor.rgb.hexValue = "${pixelColor.rgbHexValue}";');

			if(!pixelColor.isNotSetPosition())
				initializeToPixelSelector();
			else
				initializeToObserveToClickUI();
		}
		else
		{
			showDialog();
		}
	}

	//
	private function initializeToPixelSelector()
	{
		pixelSelectorRunner.call(pixelColor);
		mainFunction = selectPixel;
	}
	private function selectPixel()
	{
		pixelSelectorRunner.run();
		var event = pixelSelectorRunner.getEvent();
		switch(event)
		{
			case PixelSelectorRunnerEvent.NONE: return;
			case PixelSelectorRunnerEvent.ERROR:
				destroy(ColorPickerUIEvent.ERROR);
			case PixelSelectorRunnerEvent.FINISH(pixelSelectorEvent):
				/*
				switch(pixelSelectorEvent){
					case PixelSelectorEvent.SELECTED: false;
					case PixelSelectorEvent.UNSELECTED: true;
				}
				*/
				initializeToObserveToClickUI();
		}
	}

	//
	private function initializeToObserveToClickUI()
	{
		mainFunction = observeToClickUI;
	}
	private function observeToClickUI()
	{
		if(editColorButton.isClicked())
		{
			showDialog();
		}
		else if(colorSearchButton.isClicked())
		{
			searchPixelColor();
		}
		else if(closeButton.isClicked())
		{
			destroy(ColorPickerUIEvent.CLOSED(pixelColor));
		}
	}

	//
	private function searchPixelColor()
	{
		pixelColorSearchRunner.call(pixelColor.rgbHexValue);
		mainFunction = observeToSearchPixelColor;
	}
	private function observeToSearchPixelColor()
	{
		pixelColorSearchRunner.run();
		var event = pixelColorSearchRunner.getEvent();
		switch(event)
		{
			case PixelColorSearchRunnerEvent.NONE: return;
			case PixelColorSearchRunnerEvent.ERROR:
				destroy(ColorPickerUIEvent.ERROR(message));

			case PixelColorSearchRunnerEvent.CANCEL | PixelColorSearchRunnerEvent.UNSELECTED:
				initializeToObserveToClickUI();

			case PixelColorSearchRunnerEvent.SELECTED(pixelColor):
				this.pixelColor = pixelColor;
				initializeToObserveToClickUI();
		}
	}

	//
	private function showDialog()
	{
		dialog.show();
		mainFunction = observeDialog;
	}
	private function observeDialog()
	{
		var event = dialog.getEvent();
		switch(event)
		{
			case ColorPickerDialogEvent.NONE: return;

			case ColorPickerDialogEvent.CANCELLED:
				if(pixelColor == null)
					destroy(ColorPickerUIEvent.DIALOG_CANCELLED_STILL_TRANSPARENT);
				else
					initializeToObserveToClickUI();

			case ColorPickerDialogEvent.GOTTEN(rgbHexValue):
				pixelColor = PixelColor.createWithoutPosition(rgbHexValue);
				initializeToObserveToClickUI();
		}
	}

	//
	private function destroy(event:ColorPickerUIEvent)
	{
		this.event = event;
		mainFunction = finish;
	}
	private function finish(){}
}
