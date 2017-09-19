/**
 * Created by Caihm on 2017/5/10.
 */
/**
 * Created by Caihm on 2017/3/13.
 */



define(["dojo/parser",
    'dojo/_base/declare', 'dijit/_WidgetBase', 'dijit/_TemplatedMixin', 'dojo/dom-construct', 'dojo/_base/lang', 'dojo/dom-style', "dijit/_WidgetsInTemplateMixin",
    'dojo/_base/array', 'dojo/mouse', 'dojo/on', 'dojo/touch', 'dojo/dom', 'dojo/dom-class', "dijit/layout/StackContainer", "dijit/layout/ContentPane",
    'dojo/text!widgets/common/LeftPane/LeftPane.html', 'dijit/form/ToggleButton', 'widgets/shanjianghu/DataQuery/DataQuery',
    'widgets/shanjianghu/WaterExtractWidget/WaterExtractWidget', 'widgets/common/MapCompare/MapCompare',
    'widgets/shanjianghu/OverlayCompareWidget/OverlayCompareWidget'

], function (parser, declare, _WidgetBase, _TemplatedMixin, domConstruct, lang, domStyle, _WidgetsInTemplateMixin,
             arrayUtil, mouse, on, touch, dom, domClass, StackContainer, ContentPane,
             templateString, ToggleButton, DataQuery, WaterExtractWidget, MapCompare,
             OverlayCompareWidget) {
    return declare('widgets.common.SidePanel', [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        templateString: templateString,
        constructor: function (options, srcNodeRef) {


        },
        postCreate: function () {

        },


        hide: function () {

        },
        show: function () {

        },


        destroy: function () {

        }

    });


});

