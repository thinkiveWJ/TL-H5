var sleepArr = ["19:00", "20:12", "22:45", "23:00", "00:10", "01:34", "02:12", "03:10","05:56"];
$(function () {

    //初始化highcharts内容的样式
    _initHighchartStyle();
});
/**
 * 初始化highcharts内容的样式
 * @private
 */
function _initHighchartStyle() {
    if(sleepArr.length == 0){
        $("#container2").show();
        $("#container").hide();
        return
    }
    // var containerW = $("#container")
    var timeJson = getMinutesDistance(sleepArr);
    var totalLen = timeJson['totalMinutes'];
    var minutesArr = timeJson['minutesArr'];
    var str = "<div class='sleep-box'>";
    for(var i in minutesArr){
        str += '<div class="pull-left deep" startTime="'+ minutesArr[i]['startTime'] +'" endTime="'+ minutesArr[i]['endTime']
            +'" style="width:'+ minutesArr[i]['len']/totalLen*100 +'%"></div>';
    }
    str += '<div class="clearfix"></div></div>';
    str += '<div class="sleep-time"><div class="pull-left"><span class="icon go-to-sleep"></span> 19:00</div><div class="pull-right"><span class="icon get-up"></span> 05:56</div><div class="clearfix"></div></div>';
    $("#container").html(str);
    $("#container .sleep-box .pull-left").unbind("click touch").bind("click touch", function () {
        $(this).addClass("on").siblings().removeClass("on");
        var startTime = $(this).attr("startTime") + "开始",
            endTime = $(this).attr("endTime") + "结束";
        $(".record-highchart-title .step-num").html(startTime);
        $(".record-highchart-title .kcal").html(endTime);
    });
}