var bounds = [-74.047185, 40.679648,
    -73.907005, 40.882078];
var format = 'image/png';
var tile = new ol.layer.Tile({
    visible: true,
    source: new ol.source.TileWMS({
        url: 'http://192.168.0.204:8080/geoserver/wms',


        params: {
            service: 'WMS',
            request: 'GetMap',
            layers: "tiger-ny",
            width: 354,
            height: 512,
            srs: "EPSG:4326",
            'format': format,
            exceptions: "application/vnd.ogc.se_xml",
            'version': '1.1.0',
            tiled: true,
            styles: '',
            tilesOrigin: 121 + "," + 30
        },
        wrapX: false
    })
});

var projection = new ol.proj.Projection({
    code: 'EPSG:4326',
    units: 'degrees',
    axisOrientation: 'neu',
    global: true
});
var map = new ol.Map({
    target: 'map',
    layers: [tile],
    view: new ol.View({
        projection: projection,
        center:[-74.047185, 40.679648],
    })
});
map.getView().fit(bounds, map.getSize());
var point = [
    [121.76, 31.05],
    [121.70, 31.19],
    [121.48, 31.41],
    [121.48, 31.22],
    [121.46, 30.92],
    [121.40, 31.73],
    [121.24, 31.00],
    [121.24, 31.40],
    [121.16, 30.89],
    [121.10, 31.15]
];
// var point = /** @type {ol.geom.LineString} */ (new ol.format.Polyline({
//     factor: 1e6
// }).readGeometry(point, {
//     dataProjection: 'EPSG:4326',
//     featureProjection: 'EPSG:3857'
// }));
var route = new Route({
    target: map,
    path: {
        point: point,
        pathFeature: {
            type: 'path'
        },
        pathStyle: {
            stroke: {
                width: 10,
                color: "#fca2ca"
            }
        }
    },
    navData: {
        maxDeviate: 0.5,
        endMaxDeviate: 0.3
    }
});
/*****获取最近的最标点*****/
// var coordinate = route._pathSource.getClosestFeatureToCoordinate([121.56,32]);
// var coordinate2 = [[121.56,32], [121.4, 31.73]];
var coordinateStyle;
var coordinateFeature;
var line;
map.on('pointermove', function (evt) {
    var coordinate = map.getEventCoordinate(evt.originalEvent);
    var coordinate2 = route._pathSource.getClosestFeatureToCoordinate(coordinate);
    route.options.navData.currentPoint = coordinate;
    route.navStart();
    if(coordinate2){
        var geometry = coordinate2.getGeometry();
        var closestPoint = geometry.getClosestPoint(coordinate);
        // if(line == null){
            line =  new ol.geom.LineString([coordinate, closestPoint])
        // }else{
        //     line = line.setCoordinates([coordinate, closestPoint])
        // }

        coordinateFeature = new ol.Feature({
            geometry: line
        });

        coordinateStyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#000",
                width: 5
            })
        })
    }else{
       line = null;
    }
    map.render();
});
map.on('postcompose', function (evt) {
    var vectorContext = evt.vectorContext;
    if(line){
        vectorContext.setStyle(coordinateStyle);

    }
    if(line){
        vectorContext.drawGeometry(line);
    }
    map.render();
});
