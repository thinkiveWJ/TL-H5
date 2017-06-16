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
    $(".highchart").scrollLeft(containerW);
    highchartFunc();
}
function highchartFunc() {
    var cahr = Highcharts.chart('container', {
        exporting:{
            enabled:false
        },
        credits: {
          text: "",
          enabled: false
        },
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: [
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
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
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
        series: [{
            name: '东京',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            name: '纽约',
            data: [0, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]
        }, {
            name: '伦敦',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]
        }, {
            name: '柏林',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
        },{
            name: '柏林',
            data: [0, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]
        }]
    });
}
