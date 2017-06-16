var token = $.cookie("token"),
    queryServerStepRankingListUrl = "http://m3.beacool.com/mozan/queryServerStepRankingListWeb.do",
    likeUserDayStepWebUrl = "http://m3.beacool.com/mozan/likeUserDayStepWeb.do",
    queryUserServerStepRankingStatusWebUrl = "http://m3.beacool.com/mozan/queryUserServerStepRankingStatusWeb.do",
    userId = "",
    payNum = 1,
    paySize = 5;
$(function () {
    //查询记步列表
    queryStepRankListFunc();
    //获取当前用户的排行榜
    queryCurrentRankFunc();
});
/**
 * 查询记步列表
 */
function queryStepRankListFunc() {
    var dataJson = {
        page_no: payNum,
        page_size: paySize,
        date: getToday(),
        token: token
    };
    POST(queryServerStepRankingListUrl, dataJson, function (result) {
        if(dataJson['page_no'] === 1){
            $("#rankList").html("");
        }
        var data = result['data'];
        if(!data){
            return;
        }
        var totalPage = data['total_page'];
        data = data['ranking_list'];
        if(totalPage == 0){
            $("#rankList").html("<div style='text-align: center;color:#8E8E8E;background: #f4f3f8;margin-top: 48px;font-size: 20px;'>暂无榜单</div>");
            $("#firstRank").hide();
            $("#payListMore").hide();
        }else{
            $("#firstRank").show();
            $("#payListMore").show();
        }
        //填充记步数据
        fillPayData(data, totalPage, dataJson);
    });
}
function fillPayData(data, totalPage, dataJson) {
    var str = '';
    var currentPage = dataJson['page_no'];
    if(totalPage == currentPage){
        $("#payListMore a.btn").html("已全部加载");
    }else{
        $("#payListMore a.btn").html("更多");
    }
    for(var i in data){
        var index = 0;
        var like =  data[i]['like'];
        like = like > 99 ? '99+' : like;
        var step = data[i]['step'];
        var userIcon = data[i]['user_icon'];
        userIcon = userIcon ? userIcon : '../images/icon_head_default.png';
        if(currentPage === 1 && i< 3 ){
            //占据封面
            if(i == 0){
                $("#firstRank img").attr("src", userIcon);
                $("#firstRank .name").html(data[i]['user_name']);
            }
            index = Number(i) + 1;
            str += '<div class="rank-box-details">'+
                        '<div class="icon icon-sort on left"><img src="../images/rank_0' + index + '.png"></div>'+
                        '<img src="'+ userIcon +'" class="icon-rank-head left">'+
                        '<div class="content name left">'+ data[i]['user_name'] +'</div>'+
                        '<div class="content right">'+
                            '<div class="content-num">'+ like +'</div>';
            if(like != 0){
                str += '<img src="../images/follow_01.png" islike="'+ data[i]['islike'] +'" otherUserId="'+ data[i]['user_id'] +'"  class="content-follow">';
            }else{
                str += '<img src="../images/follow_02.png" islike="'+ data[i]['islike'] +'" otherUserId="'+ data[i]['user_id'] +'" class="content-follow">';
            }
            str += '</div>';
            if(step > 5000){
                str += '<div class="step on text-right right">'+ step +'</div>';
            }else{
                str += '<div class="step text-right right">'+ step +'</div>';
            }
            str +=      '<div class="clearfix"></div>'+
                    '</div>';
        }else{
            index = (currentPage - 1) * paySize + Number(i) + 1;
            str += '<div class="rank-box-details">'+
                '<div class="icon icon-sort on left">' + index + '</div>'+
                '<img src="'+ userIcon +'" class="icon-rank-head left">'+
                '<div class="content name left">'+ data[i]['user_name'] +'</div>'+
                '<div class="content right">'+
                '<div class="content-num">'+ like +'</div>';
            if(like != 0){
                str += '<img src="../images/follow_01.png" islike="'+ data[i]['islike'] +'" otherUserId="'+ data[i]['user_id'] +'"  class="content-follow">';
            }else{
                str += '<img src="../images/follow_02.png" islike="'+ data[i]['islike'] +'" otherUserId="'+ data[i]['user_id'] +'"  class="content-follow">';
            }
            str += '</div>';
            if(step > 5000){
                str += '<div class="step on text-right right">'+ step +'</div>';
            }else{
                str += '<div class="step text-right right">'+ step +'</div>';
            }
            str +=      '<div class="clearfix"></div>'+
                '</div>';
        }
    }
    $("#rankList").append(str);
    //点击更多
    $("#payListMore a.btn").unbind('click').bind('click', function () {
        if(totalPage == currentPage){
            return;
        }
        payNum ++;
        queryStepRankListFunc();
    });
    //点赞或取消点赞
    $("#rankList .content.right img").unbind('click').bind('click', function () {
        var otherUserId = $(this).attr("otherUserId"),
            islike = $(this).attr("islike"),
            _this = this;
        islike = islike == 0 ? 1 : 0;
        var dataLike = {
            other_user_id: otherUserId,
            date: getToday(),
            token: token,
            operation: islike
        };
        POST(likeUserDayStepWebUrl, dataLike, function (resultLike) {
            if(dataLike['operation'] == 1){ //点赞
                $(_this).attr("islike", 1);
            }else{
                $(_this).attr("islike", 0);
            }
            var like2 = resultLike['data']['like'];
            like2 = like2 > 99 ? "99+" : like2;
            if(like2 != 0){
                $(_this).attr("src", "../images/follow_01.png");
            }else{
                $(_this).attr("src", "../images/follow_02.png");
            }
            $(_this).parents(".content.right").find('.content-num').html(like2);
            if(userId == dataLike['other_user_id']){
                $("#personInfo .content-num").html(like2);
            }
        });
    });
}
/**
 * 获取当前用户的排行榜
 */
function queryCurrentRankFunc() {
    var data = {
        date: getToday(),
        token: token
    };
    POST(queryUserServerStepRankingStatusWebUrl, data, function (result) {
        var data = result['data'];
        if(!data){
            $("#personInfo").html("");
            return;
        }
        data = data['ranking_info'];
        userId = data['user_id'];
        var userIcon = data['user_icon'];
        userIcon = userIcon ? userIcon : '../images/icon_head_default.png';
        var like = data['like'];
        like = !like ? 0 : like;
        like = like > 99 ? '99+' : like;
        var step = data['step'];
        step = !step ? 0 : step;
        var str = '<div class="rank-box-details">'+
                        '<div class="icon icon-sort on left">&nbsp;</div>'+
                        '<img src="'+ userIcon +'" class="icon-rank-head left">'+
                        '<div class="content left">'+
                            '<div class="name">'+ data['user_name'] +'</div>';
        if(data['ranking'] == 0){
            if(step == 0){
                str += '<div class="sort">未上榜</div>';
            }else{
                str += '<div class="sort">排名 100+</div>';
            }
        }else{
            str += '<div class="sort">排名 '+ data['ranking'] +'</div>';
        }
                 str += '</div>'+
                        '<div class="content right">'+
                            '<div class="content-num">'+ like +'</div>';
        if(like > 0 || like == '99+'){
            str += '<img src="../images/follow_01.png"  class="content-follow on">';
        }else{
            str += '<img src="../images/follow_02.png"  class="content-follow">';
        }
        str +=          '</div>';
        if(step > 5000){
            str += '<div class="step on online' +
                ' text-right right">'+ step +'</div>';
        }else{
            str += '<div class="step online' +
                ' text-right right">'+ step +'</div>';
        }
         str +=     '<div class="clearfix"></div>'+
                '</div>';
        $('#personInfo').html(str);
    });
}