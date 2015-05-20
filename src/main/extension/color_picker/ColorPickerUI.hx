package extension.color_picker;

import extension.color_sampler.CanvasColorSamplerUI;
import extension.color_sampler.palette.PaletteKind;
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
	DIALOG_CANCELLED_STILL_TRANSPARENT;
	CLOSED;
}
class ColorPickerUI
{
	private var mainFunction:Void->Void;
	private var csInterface:AbstractCSInterface;
	private var canvasColorSamplerUI:CanvasColorSamplerUI;

	private var element:JQuery;
	private var displayElement:JQuery;
	private var editColorButton:Button;
	private var selectCanvasButton:Button;
	private var closeButton:Button;

	private var dialog:ColorPickerDialog;
	private var pixelSelectorRunner:PixelSelectorRunner;
	private var pixelColorSearchRunner:PixelColorSearchRunner;

	private var paletteKind:PaletteKind;
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
		canvasColorSamplerUI = CanvasColorSamplerUI.instance;

		dialog = new ColorPickerDialog();
		pixelSelectorRunner = new PixelSelectorRunner();
		pixelColorSearchRunner = new PixelColorSearchRunner();

		element = new JQuery("#color_picker");
		displayElement = new JQuery(".display", element);
		editColorButton = new Button(element, "edit_button");
		selectCanvasButton = new Button(element, "select_button");
		closeButton = new Button(element, "close_button");
	}
	public function run()
	{
		mainFunction();
	}
	public function show(paletteKind:PaletteKind, pixelColor:PixelColor)
	{
		this.paletteKind = paletteKind;
		this.pixelColor = pixelColor;
		element.css("display", "block");
		event = ColorPickerUIEvent.NONE;

		if(pixelColor != null)
		{
			csInterface.evalScript('app.foregroundColor.rgb.hexValue = "${pixelColor.rgbHexValue}";');
			displayElement.css("background-color", '#${pixelColor.rgbHexValue}');

			if(!pixelColor.isNotSetPosition())
				initializeToPixelSelector();
			else
				initializeToObserveToClickUI();
		}
		else
		{
			displayElement.css("background-color", 'transparent');
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
			case PixelSelectorRunnerEvent.ERROR(message):
				initializeToObserveToClickUI();
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
		else if(selectCanvasButton.isClicked())
		{
			searchPixelColor();
		}
		else if(closeButton.isClicked())
		{
			destroy(ColorPickerUIEvent.CLOSED);
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
			case PixelColorSearchRunnerEvent.ERROR(message):
				js.Lib.alert(message);
				initializeToObserveToClickUI();

			case PixelColorSearchRunnerEvent.CANCEL | PixelColorSearchRunnerEvent.UNSELECTED:
				initializeToObserveToClickUI();

			case PixelColorSearchRunnerEvent.SELECTED(pixelColor):
				this.pixelColor = pixelColor;
				canvasColorSamplerUI.updateClickedCellScanPosition(paletteKind, pixelColor.x, pixelColor.y);
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
			case ColorPickerDialogEvent.NONE:
				return;

			case ColorPickerDialogEvent.CANCELLED:
				if(pixelColor == null)
					destroy(ColorPickerUIEvent.DIALOG_CANCELLED_STILL_TRANSPARENT);
				else
					initializeToObserveToClickUI();

			case ColorPickerDialogEvent.GOTTEN(rgbHexValue):

				if(canvasColorSamplerUI.isUnregisterableColor(paletteKind, rgbHexValue))
				{
					js.Lib.alert("The color overlaps.");
					destroy(ColorPickerUIEvent.DIALOG_CANCELLED_STILL_TRANSPARENT);
				}
				else
				{
					displayElement.css("background-color", '#$rgbHexValue');
					pixelColor = PixelColor.createWithoutPosition(rgbHexValue);
					canvasColorSamplerUI.changeClickedCellColor(paletteKind, pixelColor);
					initializeToObserveToClickUI();
				}
		}
	}

	//
	private function destroy(event:ColorPickerUIEvent)
	{
		element.css("display", "none");
		this.event = event;
		mainFunction = finish;
	}
	private function finish(){}
}
