var token = "",
    payNum = 1,
    paySize = 5,
    currentNum = 0,
    querySelectInfoShare = "http://m3.beacool.com/mozan/selectInfoShare.do",
    queryBannerUrl = "http://m3.beacool.com/mozan/selectFindBanner.do";
$(function () {

    //清除token
    $.cookie('token', '');
    //获取token
    token = getUrlParam("token");
    $.cookie('token', token);
    //获取轮播图列表
    queryBannerFunc();

    //查询出行支付列表
    var dataJson = {
        token: token,
        page_num: payNum,
        busiType: "",
        page_size: paySize
    };
    $("#payList ul li").remove();
    queryPayFunc(dataJson);
});
/**
 * 获取轮播图列表
 */
function queryBannerFunc(){
    var dataJson =  {
        token: token
    };
    POST(queryBannerUrl, dataJson, function (result) {
        var data = result['data'],
            str = '<div class="swiper-wrapper">';
        var index = 0;
        for(var i in data){
            var advertLink = data[i]['advertLink'],
                imgPath = data[i]['imgPath'];
            if(advertLink && imgPath){
                index ++;
                str += '<div class="swiper-slide"><a href="'+advertLink+'"><img src="'+imgPath+'"></a></div>';
            }
        }
        var loop = false,
            pagination = "";
        if(index > 1){
            pagination = '.swiper-pagination';
            loop = true;
        }
        str += '</div><div class="swiper-pagination"></div>';
        $(".swiper-container").html(str);

        var swiper = new Swiper('.swiper-container', {
            pagination: pagination,
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 30,
            loop: loop,
            autoplay: 5000,
            autoplayDisableOnInteraction: false
        });
    });
}
/**
 * 查询出行支付列表
 */
function queryPayFunc(dataJson){
    POST(querySelectInfoShare, dataJson, function (result) {
        var data = result['data'];
        if(!data){
            return;
        }
        var total = data['total_count'];
        data = data['data'];
        if(!data){
            return;
        }
        //填充出行支付数据
        fillPayData(data, total, dataJson);
    });
}
/**
 * 填充出行支付数据
 * @param data
 * @param total
 */
function fillPayData(data, total, dataJson) {
    var str = '';
    for(var i in data){
        str += '<li><a href="./detail.html?token='+token+'&dataId='+data[i]['dataId']+'">' +
            '<img src="'+data[i]['imgPath']+'"/><div class="title">'+data[i]['title']+'</div></a></li>';
    }
    currentNum = dataJson['page_num'] * dataJson['page_size'];
    if(total > 0){
        $(".dry-share").show();
    }
    if(total > currentNum){
        $("#payListMore").find("a").text("更多");
        $("#payListMore").find("a").removeClass("disabled");
    }else{
        $("#payListMore").find("a").text("已全部加载");
        $("#payListMore").find("a").addClass("disabled");

    }
    $("#payListMore").before(str);
    $("#payListMore").unbind('click').bind('click', function () {
        var dataJson = {
            token: token,
            page_size: paySize
        };
        if(total <= currentNum){
            return;
        }
        payNum ++;
        dataJson['page_num'] = payNum;
        queryPayFunc(dataJson);
    });
}
