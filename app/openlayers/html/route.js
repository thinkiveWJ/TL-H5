/**
 *
 * @version 1.0.0
 * @date 2017-04-10
 * @desc 室内地图路线的绘制 require---》jquery.js， ol.js
 * @module path
 * @author wj
 *
 * @version 1.0.1
 * @date 2017-04-11
 * @desc 室内地图起始坐标点图标
 * @module marker、icon
 * @author wj
 *
 * @version 1.0.2
 * @date 2017-04-12
 * @desc 室内地图路线的导航，以及对导航路线偏离的判断
 * @module navgation、device
 * @author wj
 *
 * @type {{path: {point: Array, pathFeature: {type: string, geometry: string}, pathStyle: {stroke: {width: number, color: string}}}, marker: {geoMarker: {type: string, url: string, flag: boolean}, icon: {type: string, url: string, flag: boolean}}, navData: {target: null, currentPoint: Array, maxDeviate: number}}}
 */
var default_option = {
    target: "map",
    path: {
        point: [],  //路线坐标点
        pathFeature: {  //
            type: 'path',
            geometry: 'LineString'  //导航路线用直线连接
        },
        pathStyle: {    //绘制路线的样式
            stroke: {
                width: 1,
                color: "#000000"
            }
        }
    },
    marker: {   //图标： 起点、终点
        geoMarker: {
            type: 'geoMarker',
            url: '../images/icon.png',  //起始图标的地址
            flag: true  //是否显示图标的标识 ；默认添加
        },
        icon: {
            type: 'icon',
            url: '../images/icon.png',  //终止图标的地址
            flag: true //是否显示图标的标识 ；默认添加
        }
    },
    navData: {          //导航数据合集
        // target: null, //map
        currentPoint: [], //当前坐标点,
        maxDeviate: 5,  //航线偏离的最大允许距离
        endMaxDeviate: 3  //距离终点的最大距离为3的时候提示已到达终点
    }
};
/**
 * 构造函数
 * @param options
 * @constructor
 */
function Route(options) {
    _this = this;
    this.options = $.extend(true, default_option, options);
    //初始化路线图层
    this.init();
}
/**
 * 绘制样式
 * @returns {Route}
 */
Route.prototype.pathStyleFunc = function () {
    this._pathStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            width: _this.options.path.pathStyle.stroke.width,
            color: _this.options.path.pathStyle.stroke.color
        })
    });
    return this;
};
/**
 * 连接相邻的坐标点
 * @returns {Route}
 */
Route.prototype.pathStrFunc = function () {
    var point = _this.options.path.point;
    if(point.length == 0){
        return;
    }
    if(this.options.path.pathFeature.geometry === 'LineString') {
        this._pathStr = new ol.geom.LineString(point);
    }
    return this;
};
/**
 * 路线矢量集合对象
 * @returns {Route}
 */
Route.prototype.pathFeatureFunc = function () {
    this.pathStrFunc();
    this._pathFeature = new ol.Feature({
        type: _this.options.path.pathFeature.type,
        geometry: _this._pathStr
    });
    return this
};
/**
 * 获取数据源
 * @returns {Route}
 */
Route.prototype.pathSourceFunc = function () {
    var features = [];
    this.pathFeatureFunc();
    features.push(this._pathFeature);   //放入路线
    if(this.options.marker.geoMarker.flag){ //是否添加起点图标
        this.markerFeatureFunc();
        features.push(this._markerFeature);
    }
    if(this.options.marker.icon.flag){  //是否添加终点图标
        this.iconFeatureFunc();
        features.push(this._iconFeature);
    }
    this._pathSource = new ol.source.Vector({
        features: features
    });
    return this;
};
/**
 * 绘制图层
 * @returns {Route}
 */
Route.prototype.pathLayerFunc = function () {
    var styles = [];
    this.pathStyleFunc();
    this.pathSourceFunc();
    styles.push(_this._pathStyle);
    if(this.options.marker.geoMarker.flag){
        this.markerStyleFunc();
        styles.push(_this._markerStyle);
    }
    if(this.options.marker.icon.flag){
        this.iconStyleFunc();
        styles.push(_this._iconStyle);
    }
    this._pathLayer = new ol.layer.Vector({
        source: _this._pathSource,
        style: styles
    });
     return this;
};
/**
 * 起点图标矢量集合
 * @returns {Route}
 */
Route.prototype.markerFeatureFunc = function () {
    var point = this.options.path.point;
    if(point.length == 0){ //如果没有坐标
        return;
    }
    this._markerFeature = new ol.Feature({
        type: _this.options.marker.geoMarker.type,
        geometry: new ol.geom.Point(point[0])
    });
    return this;
};
/**
 * 起点的图标样式
 * @returns {Route}
 */
Route.prototype.markerStyleFunc = function () {
    this._markerStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: this.options.marker.geoMarker.url
        })
    });
   return this;
};
/**
 * 终点图标矢量集合
 * @returns {Route}
 */
Route.prototype.iconFeatureFunc = function () {
    var point = this.options.path.point;
    if(point.length == 0){ //如果没有坐标
        return;
    }
    this._iconFeature = new ol.Feature({
        type: _this.options.marker.icon.type,
        geometry: new ol.geom.Point(point[point.length - 1])
    });
    return this;
};
/**
 * 终点图标样式
 * @returns {Route}
 */
Route.prototype.iconStyleFunc = function () {
    this._iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            src: _this.options.marker.icon.url
        })
    });
    return this;
};
/**
 * 获取偏离导航路线的距离
 * @returns {Route}
 */
Route.prototype.navDeviateFunc = function () {
    if(!this._pathSource){
        return;
    }
    var coordinateFeature = null;
    var currentPoint = this.options.navData.currentPoint;
    coordinateFeature = this._pathSource.getClosestFeatureToCoordinate(currentPoint);
    if(!coordinateFeature){
        return;
    }
    var geometry = coordinateFeature.getGeometry();
    var closetPoint = geometry.getClosestPoint(currentPoint);
    this._navDeviate = Math.sqrt(Math.pow(closetPoint[0] - currentPoint[0], 2) + Math.pow(closetPoint[1] - currentPoint[1], 2));
    return this;
};
/**
 * 是否达到终点
 * @returns {Route}
 */
Route.prototype.navEndDeviateFunc = function () {
    if(!this._pathSource){
        return;
    }
    var coordinateFeature = null;
    var point = this.options.path.point;
    var endPoint = point[point.length -1];
    coordinateFeature = this._pathSource.getClosestFeatureToCoordinate(endPoint);
    if(!coordinateFeature){
        return;
    }
    var geometry = coordinateFeature.getGeometry();
    var closetPoint = geometry.getClosestPoint(endPoint);
    this._navEndDeviate = Math.sqrt(Math.pow(closetPoint[0] - endPoint[0], 2) + Math.pow(closetPoint[1] - endPoint[1], 2));
    return this;
};
/**
 * 开始导航
 */
Route.prototype.navStart = function () {
    var mMap = this.options.target;
    mMap.on('postcompose', function (evt) {
        //判断是否偏离导航
        _this.navDeviateFunc();
        if(_this._navDeviate > _this.options.navData.maxDeviate){
            console.log("您已经偏离导航路线！");
            // return;
        }
        // //是否到达终点
        _this.navEndDeviateFunc();
        if(_this._navEndDeviate < _this.options.navData.endMaxDeviate){
            console.log("您已到达终点！");
            // return;
        }
        var vectorContent = evt.vectorContext;
        var currentPointFeature = new ol.geom.Point(_this.options.navData.currentPoint);
        vectorContent.setStyle(_this._markerStyle);
        vectorContent.drawGeometry(currentPointFeature);
        mMap.render();
    });
    mMap.render();
};

/**
 * 重置属性
 * @returns {Route}
 */
Route.prototype.resetFunc = function () {
    //路线数据
    this._pathStyle = null;
    this._pathStr = null;
    this._pathFeature = null;
    this._pathSource = null;
    this._pathLayer = null;

    //起点数据
    this._markerFeature = null;
    this._markerStyle = null;

    //终点数据
    this._iconFeature = null;
    this._iconStyle = null;

    //距离导航线的数据
    this._navDeviate = null;
    this._navEndDeviate = null;
};
/**
 * 初始化路线
 * @returns {Route}
 */
Route.prototype.init = function () {
    this.options.target.removeLayer(this._pathLayer);
    this.resetFunc();
    this.pathLayerFunc();
    this.options.target.addLayer(this._pathLayer);
};
