$(function () {
    _initTrade();//初始化交易明细
    $(".trad-recharge a").unbind('click touch').bind('click touch', function () {
        $(this).addClass("on").siblings().removeClass("on");
        if($(this).hasClass("nav-trad")){
            $("#trade").show();
            $("#recharge").hide();
        }else{
            $("#trade").hide();
            $("#recharge").show();
        }
    });
});
function _initTrade(){
    $("#trade").show();
    $("#recharge").hide();
}