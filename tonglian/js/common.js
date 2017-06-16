var sdkType = "";
$(function () {
    //底部导航点击增加样式
    bindFooterFunc();
});
/**
 * 底部导航点击增加样式
 */
function bindFooterFunc() {
    $("footer a").unbind("click touch").bind("click touch", function () {
        $(this).addClass("on").siblings().removeClass("on");
    });
}
/**
 * 时钟数据
 * @returns {*}
 */
function alarmFunc(){
    var minutes = [];
    for(var i = 0; i < 60; i ++){
        var minute = i < 10 ? "0" + i : i;
        minutes.push({text: minute, value: minute});
    }
    var hours = [];
    for(var i = 1; i < 24; i ++){
        var hour = i < 10 ? "0" + i : i;
        hours.push({text: hour, value: minutes});
    }
    var alaram = hours;
    return alaram;
}
/**
 * 身高数据
 * 体重数据
 * @returns {Array}
 */
function heightOrWeightFunc(start, end, unit) {
    var heights = [];
    for(var i = start; i < end; i ++){
        heights.push({
            text: i+ unit,
            value: i + unit
        });
    }
    return heights;
}
/**
 *
 * @type {{}}
 */
var scroll = {
    targetStep: {
        "3000步": 3000,
        "4000步": 4000,
        "5000步": 5000,
        "6000步": 6000,
        "7000步": 7000,
        "8000步": 8000,
        "9000步": 9000,
        "10000步": 10000
    },
    alarm: alarmFunc(),
    sedentaryReminder: {
        "30分钟": 30,
        "60分钟": 60,
        "90分钟": 90,
        "120分钟": 120
    },
    sex: {
        "男": 0,
        "女": 1
    },
    heights: heightOrWeightFunc(120, 241, "cm"),
    weight: heightOrWeightFunc(30, 201, "kg")

};
/**
 * 填充下拉数据
 */
function fillMobiscrollData(_this, text, options) {
    var str = "";
    var arr = scroll[text];
    if(!arr){
        $("#mobiscroll").html("");
        return;
    }
    //树形数据
    str = getTreeStr(str, arr, false);
    $("#mobiscroll").html(str);
    $("#mobiscroll").mobiscroll().treelist(options);
    $("#mobiscroll_dummy").focus();
    //点击周末7天alarm-mobiscroll
    $(".alarm-mobiscroll ul li").unbind('click touchstart').bind('click touchstart', function () {
        var flag = $(this).hasClass("on");
        if(flag){
            $(this).removeClass("on");
        }else{
            $(this).addClass("on");
        }
    });
}
/**
 * 树形数据
 * @param str
 * @param arr
 * @param flag
 * @returns {*}
 */
function getTreeStr(str, arr, flag) {
    for(var i in arr){
        if(Object.prototype.toString.call(arr[i]['value']) === '[object Array]'){
            var text = arr[i]['text'];
            str += '<li data-val="'+ text +'"><div>'+ text +'</div><ul>';
            var arrJson = arr[i]['value'];
            str = arguments.callee(str, arrJson, true);
        }else{
            var text = arr['text'] || arr[i]['text'] || i;
            str += '<li data-val="' + text + '">' + text + '</li>';
        }
    }
    if(flag) {
        str += '</ul></li>';
    }
    return str;
}
/**
 * 获取两个时间之间的分钟差
 * 以及其每段时间中的开始时间，结束时间
 * @param arr
 * @returns {{totalMinutes: number, minutesArr: Array}}
 */
function getMinutesDistance(arr) {
    var totalMinutes = 0,
        minutesArr = [];
    for(var i = 0; i < arr.length; i ++){
        var time = arr[i].split(":");
        var hour = Number(time[0]),
            minute = Number(time[1]);
        hour = hour > 17 ? hour : hour + 24;
        minute = hour*60 + minute;
        var index = Number(i)+1;
        var timeNext = arr[index].split(":");
        var hourNext = Number(timeNext[0]),
            minuteNext = Number(timeNext[1]);
        hourNext = hourNext > 17 ? hourNext : hourNext + 24;
        minuteNext = hourNext*60 + minuteNext;

        var minuteLen = minuteNext - minute;
        minutesArr.push({
            len: minuteLen,
            startTime: arr[i],
            endTime: arr[index]
        });
        totalMinutes += minuteLen;
        if(index == arr.length - 1){
            break;
        }
    }
    return {
        totalMinutes: totalMinutes,
        minutesArr: minutesArr
    };
}
