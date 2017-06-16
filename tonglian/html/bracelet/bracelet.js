$(function () {

    //初始化下拉选择滚动数据
    initMobiscrollFunc();

    //久坐提醒的开关
    bindSedentaryFunc();


});
/**
 * 初始化下拉选择滚动数据
 */
function initMobiscrollFunc() {

    $(".bracelet ul.list li").unbind("click touch").bind('click touch', function () {
        var style = $(this).attr("class");
        var _this = this;
        var defaultValue = $(this).find(".num").text();
        var defaultArr = defaultValue.split(":");
        var options = {
            theme: 'android-ics light',
            lang: 'zh',
            display: "bottom",
            showOnFocus: true,
            onSelect: function (valueText) {
                var valueText = valueText.replace(/\s/, ":");
                $(_this).find(".pull-right span.num").text(valueText);
            }
        };
        if(defaultArr["0"] !== ""){
            options['defaultValue'] = defaultArr;
        }
        switch (style){
            case "target":
                options['headerText'] = "目标步数";
                fillMobiscrollData(_this, "targetStep", options);
                break;
            case "alarm":
                var str = "<div class='alarm-mobiscroll'>" +
                                "<div class='title'>重复</div><ul>";
                var days = [
                    {text: "日", value: 0},
                    {text: "一", value: 1},
                    {text: "二", value: 2},
                    {text: "三", value: 3},
                    {text: "四", value: 4},
                    {text: "五", value: 5},
                    {text: "六", value: 6}
                ];
                for(var i in days){
                    str += "<li>"+ days[i]['text'] +"</li>";
                }
                str +="</ul></div>";
                options['headerText'] = "手环闹钟"+str;
                options['rows'] = 3;
                fillMobiscrollData(_this, "alarm", options);
                break;
            case "sedentary-time":
                options['headerText'] = "提醒间隔";
                options['rows'] = 4;
                fillMobiscrollData(_this, "sedentaryReminder", options);
                break;
        }
    });
}
/**
 * 久坐提醒的开关
 */
function bindSedentaryFunc() {
    if($(".bracelet-info .list .sedentary .switch").hasClass("on")){
        $(".bracelet-info .sedentary-time").show();
    }else{
        $(".bracelet-info .sedentary-time").hide();
    }
    $(".bracelet .list li .switch").unbind('click touch').bind("click touch", function () {
        var style = $(this).hasClass("on");
        if(style){
            $(this).removeClass("on");
            if($(this).parents("li").hasClass("sedentary")){
                $(".bracelet-info .sedentary-time").hide();
            }
        }else{
            $(this).addClass("on");
            if($(this).parents("li").hasClass("sedentary")){
                $(".bracelet-info .sedentary-time").show();
            }
        }
    });
}
