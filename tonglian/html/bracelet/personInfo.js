$(function () {
    //初始化下拉选择滚动数据
    initMobiscrollFunc();
});
/**
 * 初始化下拉选择滚动数据
 */
function initMobiscrollFunc() {
    var options = {
        theme: 'android-ics light',
        lang: 'zh',
        display: "bottom",
        showOnFocus: true,
        max: new Date(),
        onSelect: function (valueText) {
            var valueText = valueText.replace(/\s/, "-");
            $(".person-information .list li.birthday").find(".pull-right span.num").text(valueText);
        }
    };
    var defaultValue = $(".person-information .list li.birthday .pull-right span.num").text();
    if(defaultValue !== ""){
        options['defaultValue'] = new Date(defaultValue);
    }
    options['headerText'] = "生日";
    options["dateFormat"] = 'yy-mm-dd';
    $("#birthdayTree").mobiscroll().date(options);

    $(".person-information .list li").unbind("click touch").bind('click touch', function () {
        var style = $(this).attr("class");
        var _this = this;
        var defaultValue = $(this).find(".num").text();
        var defaultArr = defaultValue.split("-");
        options['onSelect'] = function (valueText) {
            var valueText = valueText.replace(/\s/, "-");
            $(_this).find(".pull-right span.num").text(valueText);
        };
        if(defaultArr["0"] !== ""){
            options['defaultValue'] = defaultArr;
        }
        switch (style) {
            case "sex":
                options['headerText'] = "性别";
                fillMobiscrollData(_this, "sex", options);
                break;
            case "birthday":
                $("#birthdayTree").trigger("focus");
                break;
            case "height":
                options['headerText'] = "身高";
                fillMobiscrollData(_this, "heights", options);
                break;
            case "weight":
                options['headerText'] = "体重";
                fillMobiscrollData(_this, "weight", options);
                break;
        }
    });
}