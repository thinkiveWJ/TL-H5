var queryActivityWinnerRankWebUrl = "http://m3.beacool.com/mozan/queryActivityWinnerRankWeb.do",
    queryActivityLatestWinnerListWebUrl = "http://m3.beacool.com/mozan/queryActivityLatestWinnerListWeb.do",
    activity_id = 1001,
    token = $.cookie("token");
$(function () {
    //queryActivityLatestWinnerList 查询中奖排行榜
    queryTicketRankFunc();
    //获取实时排行榜
    queryTicketRelTimeFunc();
});
/**
 * 查询中奖排行榜
 */
function queryTicketRankFunc() {
    var data = {
        token: token,
        activity_id: activity_id
    };
    POST(queryActivityWinnerRankWebUrl, data, function (result) {
        $("#winnerList").html("");
        var data = result['data'];
        if(!data){
            return;
        }
        data = data['winner_list'];
        if(!data || data.length == 0){
            $("#winnerListBox").hide();
            return;
        }
        $("#winnerListBox").show();
        var str = "";
        for(var i in data){
            str += '<li class="ticket-box">'+
                        '<div class="ticket-detail">' + data[i]['user_name'] + '</div>'+
                        '<div class="ticket-detail two">' + data[i]['phone'] + '</div>'+
                        '<div class="ticket-detail two">' + data[i]['reward'] + '</div>'+
                    '</li>'
        }
        $("#winnerList").html(str);
    });
}
/**
 * 获取实时排行榜
 */
function queryTicketRelTimeFunc(){
    var data = {
        token: token,
        activity_id: activity_id
    };
    POST(queryActivityLatestWinnerListWebUrl, data, function (result) {
        $("#ticketRelTimeList").html("");
        var data = result['data'];
        if(!data){
            return;
        }
        data = data['winner_list'];
        if(!data || data.length == 0){
            $("#ticketRelTimeListBox").hide();
            return;
        }
        $("#ticketRelTimeListBox").show();
        var str = "";
        for(var i in data){
            str += '<li class="ticket-box">'+
                '<div class="ticket-detail">' + data[i]['user_name'] + '</div>'+
                '<div class="ticket-detail two">' + data[i]['phone'] + '</div>'+
                '<div class="ticket-detail two">' + data[i]['reward'] + '</div>'+
                '</li>'
        }
        $("#ticketRelTimeList").html(str);
        $("#ticketList").myScroll();
    });
}