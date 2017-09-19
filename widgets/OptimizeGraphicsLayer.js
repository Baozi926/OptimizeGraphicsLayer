define([
  "dojo/_base/lang",
  "dojo/_base/declare",
  "dojo/_base/array",
  "esri/Color",
  "dojo/_base/connect",

  "esri/core/Accessor",
  "esri/geometry/SpatialReference",
  "esri/geometry/Point",
  "esri/Graphic",
  "esri/renderers/ClassBreaksRenderer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/TextSymbol",
  "esri/symbols/PictureMarkerSymbol",

  "esri/PopupTemplate",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/geometry/geometryEngine"
], function (lang, declare, arrayUtils, Color, connect, Accessor, SpatialReference, Point, Graphic, ClassBreaksRenderer, SimpleMarkerSymbol, TextSymbol, PictureMarkerSymbol, PopupTemplate, GraphicsLayer, FeatureLayer, geometryEngine) {
  var callbackTeam = [];

  return GraphicsLayer.createSubclass({
      declaredClass: "caihm.optimizeGraphicsLayer",
      constructor: function (options) {
          options = options || {};
          this._data = [];
          // if the zoom of mapView is larger than this, the graphics will be clip by map extent
          this.clipZoom = options.clipZoom || 7;

      },

      // override esri/layers/GraphicsLayer methods _setMap: function(map, surface) {
      createGraphicsController: function (e) {

          var mapView = this._mapView = e.layerView.view;

          this._zoomEnd = mapView.watch("zoom", lang.hitch(this, function (newValue, oldValue, propertyName, target) {
              // 事件会执行两次，newValue是整数时zoomEnd，newValue是浮点数时zoomStart
              if ((newValue | 0) == newValue) {
                  this.__refresh();
              }
          }));
          mapView.on('drag', lang.hitch(this, function (evt) {
              if (evt.action === 'end') {
                  this.__refresh();
              }
          }));
          var div = this.inherited(arguments);
          return div;
      },

      throttle: function (callback, delay) {
          delay = delay || 0;
          callbackTeam.push(callback);
          setTimeout(function () {
              if (callbackTeam.length > 0) {
                  callbackTeam
                      .pop()
                      .apply(null, arguments);
                  callbackTeam.length = 0;
              }
          }, delay);
      },

      __refresh: function () {

          this.throttle(lang.hitch(this, function () {
              this.removeAll(true);
              this.addGraphics();
          }), 0);
      },

      _unsetMap: function () {
          this.inherited(arguments);
      },

      addGraphics: function () {
          for (var i = 0; i < this._data.length; i++) {
              this.add(this._clipGraphic(this._data[i]));
          }

      },

      _clipGraphic: function (graphic) {
          var clipedGraphic = graphic.clone();
          clipedGraphic._cliped = true;
          if (this._mapView.zoom >= this.clipZoom) {
              clipedGraphic.geometry = geometryEngine.clip(clipedGraphic.geometry, this._mapView.extent);
          }
          return clipedGraphic;
      },

      remove: function (graphic) {
          this._data = arrayUtils.filter(this._data, function (v) {
              return !(graphic.geometry === v.geometry && graphic.attributes === v.attributes)
          }, this);

          this.__refresh();
          // this.inherited(arguments);

          return this;

      },

      add: function (p) {

          if (p._cliped) {
              this.inherited(arguments);
              return this;
          }

          if (!p._origin) {

              p._origin = true;
              this
                  ._data
                  .push(p);

              var cliped = this._clipGraphic(p);
              this.add(cliped);

          }

          return this;

      },

      removeAll: function (param) {
          this.inherited(arguments);

          if (!param) {
              this._data.length = 0;
          }
          return this;
      }

  });
});