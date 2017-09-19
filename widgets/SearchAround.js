/**
 * Created by Caihm on 2017/8/28
 */
define([
	"dojo/parser",
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dojo/dom-construct',
	'dojo/_base/lang',
	'dojo/dom-style',
	"dijit/_WidgetsInTemplateMixin",
	'dojo/_base/array',
	'dojo/mouse',
	'dojo/on',
	'dojo/touch',
	'dojo/dom',
	'dojo/dom-class',
	"esri/geometry/Circle",
	"esri/geometry/Point",
	"esri/Graphic",
	"esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleMarkerSymbol",
	'dojo/dnd/Moveable',
	'esri/geometry/ScreenPoint',
	'dojo/dom-geometry',
	'esri/geometry/geometryEngine',
  "esri/geometry/support/webMercatorUtils",
  "./MyMover"

], function (parser, declare, _WidgetBase, _TemplatedMixin,
			 domConstruct, lang, domStyle, _WidgetsInTemplateMixin, arrayUtil,
			 mouse, on, touch, dom, domClass, Circle, Point, Graphic, SimpleFillSymbol, SimpleMarkerSymbol,
			 Moveable, ScreenPoint, domGeometry, geometryEngine, webMercatorUtils,MyMover) {
	return declare('modules.Search.SearchAround', [], {
		constructor: function (options) {
			options = options || {};
			this.view = options.view; //MapView
			this.center = options.center; //搜索中心
			this.radius = options.radius || 1000000; //初始化是圆圈的半径
			this.circleLayer = options.layer || this.view.graphics; //渲染圆圈的图层
			this.circleSymbol = options.symbol || new SimpleFillSymbol(); //渲染圆圈的样式
			if (lang.isFunction(options.onDragStop)) {
				this.onDragStop = options.onDragStop; //圆圈改变后执行的函数
			}

			this.events = [];
			this.init();
		},

		_createCircle: function () {
			this.circleGeometry = new Circle({center: this.center, radius: this.radius});
			this.circle = new Graphic({geometry: this.circleGeometry, symbol: this.circleSymbol});

			this
				.circleLayer
				.add(this.circle);
		},

		init: function () {

			this._createCircle();
			this._createDivs(); //用于拖拽的div会加载到view.root下
			this._updateInfo();
			this._onMapMove();
			this._bindEvent();

			this.onDragStop({graphic: this.circle})
		},

		_createDivs: function () {

			this.div = domConstruct.create('div', {}, this.view.root);

			this.dragDiv = domConstruct.create('div', {
				innerHTML: 'dragMe',
				style: 'background:red'
			}, this.div);

			this.input = domConstruct.create('input', {
				style: ''
			}, this.div);

			this.mover = new Moveable(this.div, {handle: this.dragDiv,mover: MyMover});

		},

		onDragStop: function () {
			console.log('onDragStop not implemented');
		},

		_bindEvent: function () {

			this
				.events
				.push(on(this.input, 'change', lang.hitch(this, function (evt) {
					this.radius = parseFloat(evt.target.value);
					this.circleGeometry = new Circle({center: this.circleGeometry.center, radius: this.radius});
					this._updateCircle();
					this._onMapMove();
				})));

			this
				.events
				.push(on(this.mover, 'Move', lang.hitch(this, function (evt) {
					this._onMove(evt);
				})));
			this
				.events
				.push(on(this.mover, 'MoveStop', lang.hitch(this, function (evt) {
					this.onDragStop({graphic: this.circle});
				})));

			this
				.events
				.push(this.view.on('drag', lang.hitch(this, this._onMapMove)));

			this
				.events
				.push(this.view.on('resize', lang.hitch(this, this._onMapMove)));

			this
				.events
				.push(this.view.watch("animation", lang.hitch(this, function (response) {
					if (response && response.state === "running") {
						domStyle.set(this.div, 'opacity', 0.5);
					} else {
						this._onMapMove();
						domStyle.set(this.div, 'opacity', 1);
					}
				})));
		},

		_onMapMove: function () {

			var radius;

			//因为radius是米为单位，所以在坐标系是经纬度时需进行转换
			if (this.view.spatialReference.isGeographic) {
				radius = webMercatorUtils.xyToLngLat(this.radius, this.radius)[0];
			} else {
				radius = this.radius
			}

			// var width = webMercatorUtils.lngLatToXY(this.searchWidth, this.searchWidth);

			this.rightGeometry = new Point({
				x: this.circleGeometry.center.x + radius,
				y: this.circleGeometry.center.y,
				spatialReference: this.view.spatialReference
			});
			var screenPoint = this
				.view
				.toScreen(this.rightGeometry);
			domStyle.set(this.div, {
				position: "absolute",
				top: screenPoint.y + 'px',
				left: screenPoint.x + 'px'
			});

		},

		_updateCircle: function () {

			var newCircle = new Graphic({geometry: this.circleGeometry, symbol: this.circleSymbol});
			this
				.circleLayer
				.remove(this.circle);
			this
				.circleLayer
				.add(newCircle);
			this.circle = newCircle;

		},

		_onMove: function (evt) {

			var screenPoint = new ScreenPoint({x: this.div.style.left, y: this.div.style.top});
			var mapPoint = this
				.view
				.toMap(screenPoint);
			var distance = geometryEngine.distance(this.circleGeometry.center, mapPoint);
			if (this.view.spatialReference.isGeographic) {
				var pointCenterXY = webMercatorUtils.lngLatToXY(this.circleGeometry.center.x, this.circleGeometry.center.y);
				var pointRightXY = webMercatorUtils.lngLatToXY(this.circleGeometry.center.x + distance, this.circleGeometry.center.y);
				distance = geometryEngine.distance(new Point({
					x: pointCenterXY[0],
					y: pointCenterXY[1],
					spatialReference:this.view.spatialReference
				}), new Point({
					x: pointRightXY[0],
					y: pointRightXY[1],
					spatialReference:this.view.spatialReference
				}));
				// console.log(distance);
			}
			this.radius = distance;
			this.circleGeometry = new Circle({center: this.circleGeometry.center, radius: distance});
			this._updateCircle();
			this._updateInfo();

		},

		_updateInfo: function () {
			this.input.value = this.radius;
		},

		postCreate: function () {
		},

		startup: function () {
		},

		destroy: function () {

			this.inherited(arguments);

			domConstruct.destroy(this.div);

			this
				.circleLayer
				.remove(this.circle);

			arrayUtil.forEach(this.events, function (event) {
				if (lang.exists('remove', event)) {
					event.remove();
				}

			}, this);
		}

	});

});
