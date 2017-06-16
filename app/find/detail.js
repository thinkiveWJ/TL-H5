var token = "",
    querySelectInfoShare = "http://m3.beacool.com/mozan/selectInfoShare.do";
$(function () {
    //获取token
    token = getUrlParam("token");
    var dataId = getUrlParam("dataId");
    //获取详细信息
    queryDetailsFunc(dataId);
});
/**
 * 获取详细信息
 */
function queryDetailsFunc(dataId){
    var data = {
        token: token,
        id: dataId,
        page_num: 1,
        page_size: 1
    };
    POST(querySelectInfoShare, data, function (result) {
        var result = result['data'];
        if(!result){
            return;
        }
        $("#title").html(result[0]['title']);
        $("#imgBox img").attr("src", result[0]['imgPath']);
        $("#details").html(result[0]['detail']);
    });
}