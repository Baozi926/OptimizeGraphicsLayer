// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/4.2/esri/copyright.txt for details. >>built
define([
  "esri/core/Accessor",
  "esri/core/Collection",
  "esri/core/promiseUtils",
  "esri/layers/Layer",
  "esri/layers/mixins/ScaleRangeLayer",
  "esri/Graphic",
  "dojo/_base/lang"
], function (Accessor, Collection, promiseUtils, Layer, ScaleRangeLayer, Graphic,lang) {
  var subClazz = Accessor.createSubclass({
    properties: {
      layer: null,
      layerView: null,
      graphics: null
    }
  });
  return Layer.createSubclass([ScaleRangeLayer], {
    declaredClass: "esri.layers.GraphicsLayer",
    viewModulePaths: {
      "2d": "../views/2d/layers/GraphicsLayerView2D",
      "3d": "../views/3d/layers/FeatureLayerView3D"
    },
    getDefaults: function (a) {
      return lang.mixin(this.inherited(arguments), {graphics: []})
    },
    destroy: function () {
      this.removeAll()
    },
    _gfxHdl: null,
    properties: {
      elevationInfo: null,
      graphics: {
        type: Collection.ofType(Graphic),
        set: function (a) {
          var b = this._get("graphics");
          b || (a.forEach(function (a) {
            a.layer = this
          }, this), this._gfxHdl = a.on("change", function (a) {
            var c,
              b,
              d;
            d = a.added;
            for (c = 0; b = d[c]; c++) 
              b.layer = this;
            d = a.removed;
            for (c = 0; b = d[c]; c++) 
              b.layer = null
          }.bind(this)), this._set("graphics", a), b = a);
          b.removeAll();
          b.addMany(a)
        }
      },
      type: "graphics"
    },
    add: function (a) {
      console.log(a);
      this
        .graphics
        .add(a);
      return this
    },
    addMany: function (a) {
      this
        .graphics
        .addMany(a);
      return this
    },
    removeAll: function () {
      this
        .graphics
        .removeAll();
      return this
    },
    createGraphicsController: function (a) {
      return promiseUtils.resolve(new subClazz({layer: this, layerView: a.layerView, graphics: this.graphics}))
    },
    remove: function (a) {
      this
        .graphics
        .remove(a)
    },
    removeMany: function (a) {
      this
        .graphics
        .removeMany(a)
    },
    graphicChanged: function (a) {
      this.emit("graphic-update", a)
    }
  })
});