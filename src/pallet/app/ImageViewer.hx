package app;

import js.html.ImageElement;
import js.Browser;
import createjs.BitmapData;
import jQuery.JQuery;

using color.RGBA.Converter;

class ImageViewer
{
	private var element:JQuery;
	private var imageElement:JQuery;
	private var imagePairSet:Array<ImagePair>;

	@:allow(app) private static var instance(get, null):ImageViewer;
	private static inline function get_instance():ImageViewer
		return instance == null ? instance = new ImageViewer(): instance;

	private function new()
	{
		imagePairSet = [];
		element = new JQuery("#image_viewer");
	}
	public function show(imageSourceUri:String)
	{
		imageElement = new JQuery("<img>").appendTo(element);
		imageElement.attr("src", imageSourceUri);
	}

	public function getHTMLImageElement():ImageElement
	{
		return cast imageElement[0];
	}
}

class ImagePair
{
	public var before(default, null):Image;
	public var after(default, null):Image;

	private var element:JQuery;

	public function new(parentElement:JQuery)
	{
		element = new JQuery("<div>").appendTo(parentElement);
		element.attr("class", "pair");

		before = new Image(element);
		after = new Image(element);
	}
}
class Image
{
	private var element:JQuery;
	private var imageElement:JQuery;

	public function new(parentElement:JQuery)
	{
		element = new JQuery("<div>").appendTo(parentElement);
		element.attr("class", "image");
	}
	public function setImageTag(imageSourceUri:String)
	{
		imageElement = new JQuery("<img>").appendTo(element);
		imageElement.attr("src", imageSourceUri);
	}
	public function getHTMLImageElement():ImageElement
	{
		return cast imageElement[0];
	}
}
