$(function () {
    //画圆
    designCircleFunc();
    //睡眠与步数的轮播
    sleepAndStepFunc();
    //点击事件
    bindFunc();
});
/**
 * 画圆
 */
function designCircleFunc() {
    var circleW = $('.swiper-slide .circle').width();
    $('.swiper-slide .circle').circleProgress({
        value: 0.3,
        startAngle: -Math.PI/2,
        size: circleW,
        fill: {
            color: "#55e875"
        }
    });
}
/**
 * 睡眠与步数的轮播
 */
function sleepAndStepFunc() {
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
}
/***
 * 点击事件
 */
function bindFunc(){
    //点击忽略蓝牙
    $("#ignore").unbind('click').bind('click', function () {
        $(this).parents("section").hide();
    });
    //下拉同步数据
    var $statu = $('.load-data .text');

    var pullRefresh = $('body').pPullRefresh({
        $el: $('body'),
        $loadingEl: $('.load-data'),
        sendData: {
            id: 1
        },
        url: 'test.php',
        callbacks: {
            pullStart: function(){
                $statu.text('松开开始同步数据');
                $('.load-data').find("img").hide();
            },
            start: function(){
                $statu.text('正在同步数据，请点亮手环');
                $('.load-data').find("img").show();
            },
            success: function(response){
                $('.load-data').find("img").hide();
                $statu.text('数据同步成功！');
            },
            end: function(){
                $('.load-data').find("img").hide();
                // $statu.text('数据同步结束');
            },
            error: function(){
                $('.load-data').find("img").hide();
                $statu.text('找不到请求地址,数据同步失败');
            }
        }
    });

}