var x = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
    ],
    containerW = 0;
$(function () {
    //初始化highcharts内容的样式
    _initHighchartStyle();

    //向左拉数据加载更多
    bindLeftMore();
});
/**
 * 初始化highcharts内容的样式
 * @private
 */
function _initHighchartStyle() {
    if(x.length == 0){
        $("#container2").show();
        $("#container").hide();
        return
    }
    containerW = x.length * 80;
    $("#container").css({
        width: containerW + "px"
    });
    $("section.highchart").scrollLeft(containerW);
    highchartFunc();
}
function highchartFunc() {
    var chart = new Highcharts.Chart('container', {
        exporting:{
            enabled:false
        },
        credits: {
            text: "",
            enabled: false
        },
        title: {
            text: ''
        },
        subtitle: {
            text: '',
        },
        xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        plotOptions: {
            series: {
                allowPointSelect: true,
                point: {
                    events: {
                        click: function() {
                            console.log(this);
                        },
                        mouseOver: function () {

                        }
                    }
                }
            }
        },
        tooltip: {
            enabled: false
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: '东京',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }]
    });
}
/**
 * 向左拉数据加载更多
 */
function bindLeftMore() {
    var pullRefresh = $('section.highchart').pPullRefresh({
        $el: $('section.highchart'),
        $loadingEl: $('.more-left'),
        sendData: {
            id: 1
        },
        // startPX: Number(containerW) + 10,
        url: 'test.php',
        callbacks: {
            pullStart: function(){
                $('.more-left').find("img").hide();
            },
            start: function(){
                $('.more-left').find("img").show();
            },
            success: function(response){
                $('.more-left').find("img").hide();
            },
            end: function(){
                $('.more-left').find("img").hide();
            },
            error: function(){
                $('.more-left').find("img").hide();
            }
        }
    });
}
