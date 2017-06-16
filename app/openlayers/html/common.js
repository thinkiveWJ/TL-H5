
window.JSONP = function (url, callback) {
    $.ajax({
        url: url,
        async: false,
        dataType: 'jsonp',
        jsonpCallback: 'parseResponse',
        success: function (result) {
            if(!result){
                return;
            }
            var features = result['features'];
            if(!features || features.length == 0){
                return;
            }
            features = features[0];
            var geometry = features['geometry'];
            if(!geometry){
                return;
            }
            var geometryType = geometry['type'];
            if(geometryType != "LineString"){
                return;
            }
            var coordinates = geometry['coordinates'];
             typeof callback === 'function' && callback(coordinates);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    function parseResponse(data){
    }
};