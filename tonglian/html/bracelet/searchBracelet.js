$(function () {
    _initBind();
});
function _initBind() {
    //点击先不绑定
    $("#unbind").unbind("click touch").bind('click touch', function () {
        $(".search-binding").hide();
        $(".binding").show();
        $(".binded,footer,header").show();
    });
    //点击绑定手环
    $("#binding").unbind("click touch").bind('click touch', function () {
        $(".search-binding").show();
        $(".binding").hide();
        $(".binded,footer,header").hide();
        $(".search-binding .tips").removeClass("stop");
    });
    //圆环运动
    var flag = true;
    $(".search-binding .circle").unbind("click touch").bind('click touch',function () {
        flag = !flag;
        if(flag){
            $(".search-binding .tips").removeClass("stop");
            return;
        }
        $(".search-binding .tips").addClass("stop");
    });
}