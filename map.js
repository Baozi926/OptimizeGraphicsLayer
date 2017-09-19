/**
 * Created by Caihm on 2017/5/10.
 */

var map;
var view;
var s;
var test;
var layer;

require([
    "dojo/parser", 'dojo/_base/lang', "esri/Map", "esri/views/MapView","esri/request",
    "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/geometry/support/webMercatorUtils",
    'esri/Graphic','widgets/SearchAround','widgets/OptimizeGraphicsLayer',
    "esri/geometry/support/jsonUtils",
    "dojo/domReady!"
], function (parser, lang, Map, MapView,esriRequest,
    Point,
    SimpleMarkerSymbol,
    SimpleFillSymbol,
    webMercatorUtils,
    Graphic,SearchAround,OptimizeGraphicsLayer,geometryUtils) {
    parser.parse();

    // mapManager = MapManager.getInstance({     appConfig: appConfig },
    // 'mapishere'); mapManager.showMap();

    map = new Map({basemap: "streets"});
    view = new MapView({
        container: "mapishere", // Reference to the scene div created in step 5
        map: map, // Reference to the map object created before the scene
        zoom: 4, // Sets zoom level based on level of detail (LOD)
        center: [15, 65]
    });

    layer = new OptimizeGraphicsLayer({
        clipZoom:12
    });

    view.map.add(layer);
    view.then(lang.hitch(this,function(){       

        esriRequest('polygon.json',{
            responseType: "json"
        }).then(function(res){
    
            var geometry = geometryUtils.fromJSON(res.data);
            // geometry.spatialReference = view.spatialReference;
            geometry = webMercatorUtils.geographicToWebMercator(geometry);
         
            test = new Graphic({
                geometry: geometry,
                symbol:new SimpleFillSymbol()
            });
    
            view.goTo(test);
    
            layer.add(test);
        });


    }));

});
