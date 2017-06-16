var format = 'image/png';
var bounds = [302.4584581497801, -6756.14603524229,
    9873.140925110132, -433.3457709251104];

var tiled = new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/mapDemo/wms',
        params: {'FORMAT': format,
            'VERSION': '1.1.1',
            tiled: true,
            STYLES: '',
            LAYERS: 'mapDemo:map',
            tilesOrigin:  302.4584581497801 + "," + -6756.14603524229
        }
    })
});
var projection = new ol.proj.Projection({
    code: 'EPSG:2023',
    units: 'm',
    axisOrientation: 'neu',
    global: false
});
var map = new ol.Map({
    target: 'map',
    layers: [
        tiled
    ],
    view: new ol.View({
        projection: projection
    })
});
map.getView().fit(bounds, map.getSize());
var route;
map.on('singleclick', function(evt) {
    var end = evt.coordinate;
    console.log(end)
    var url = "http://localhost:8080/geoserver/routeDemo/wfs"
        +"?service=WFS&VERSION=1.0.0&REQUEST=GetFeature&outputFormat=text/javascript"+
        "&typeName=routeDemo:routeDemo";
    url += "&viewparams=x1:515.64075658192;y1:-4010.8619138437;x2:"+end[0]+";y2:"+end[1];
// url += "&viewparams=x1:121.599366712968;y1:31.2058811358918;x2:121.599363956229;y2:31.2059407120746";
    JSONP(url, function (coordinates) {
        if(route && route._pathLayer){
            map.removeLayer(route._pathLayer);
            route.options.path.point=[];
        }
        route = new Route({
            target: map,
            path: {
                point: coordinates,
                pathFeature: {
                    type: 'path'
                },
                pathStyle: {
                    stroke: {
                        width: 3,
                        color: "#fca2ca"
                    }
                }
            },
            navData: {
                maxDeviate: 0.5,
                endMaxDeviate: 0.3
            }
        });
    });
});

