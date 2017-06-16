var token = sessionStorage.getItem("token"),
    queryListUrl = 'http://m3.beacool.com/mozan/queryTrafficCardChargeRecords.do';
if(!token){
    window.top.location.href="../login.html"
}
$(function(){
    dateSearch("#startDate", "#endDate");
    _initSelect();//下拉菜单初始化
    var page = 1,
        pageSize = 20,
        numberOfPages = 10;
    var data = {
        token: token,
        page_no: page,
        page_size: pageSize,
        numberOfPages: numberOfPages
    };
    //查询公交充值列表
    queryFunc(data);
    //点击按钮
    bindBTNFunc();
});
/**
 * 查询公交充值列表
 */
function queryFunc(data) {
    POST(queryListUrl, data, function (result) {
        $("input[name='record_id']").val(data['record_id']);
        $("input[name='order_status']").val(data['order_status']);
        $("input[name='out_order_id']").val(data['out_order_id']);
        $("input[name='card_type']").val(data['cardType']);
        $("input[name='user_id']").val(data['user_id']);
        $("input[name='start_time']").val(data['start_time']);
        $("input[name='end_time']").val(data['end_time']);
        $("input[name='token']").val(data['token']);
        if(!result['data']){
            return;
        }
        var dataArr = result['data']['record_list'];
        if(!dataArr){
            return;
        }
        var dataFile = [
            "record_id",
            function (dataArr, i){
                return dataArr[i]['amount']/100;
            },
            function (dataArr, i) {
                return getDictionary("busiStatus", dataArr[i]['order_status']);
            },
            function (dataArr, i) {
                return getDictionary("cardType", dataArr[i]['card_type']);
            },
            "out_order_id",
            "user_id",
            function (dataArr, i) {
                return getYYMMDD(dataArr[i]['create_time']);
            },
        ];
        //填充数据
        fillTableData(false, "#tbody", data.page_no, data.page_size, dataFile, dataArr);
        //分页数据
        var options = {
            bootstrapMajorVersion:3,//版本号。3代表的是第三版本
            currentPage: data.page_no, //当前页数
            numberOfPages: data.numberOfPages, //显示页码数标个数
            totalPages: result['data']['total_page'],
            itemTexts: function (type, page, current) {
                //图标的更改显示可以在这里修改。
                switch (type) {
                    case "first":
                        return "首页";
                    case "prev":
                        return "上一页";
                    case "next":
                        return "下一页";
                    case "last":
                        return "尾页";
                    case "page":
                        return  page;
                }
            },
            onPageClicked: function (e, originalEvent, type, page) {
                // 单击当前页码触发的事件。若需要与后台发生交互事件可在此通过ajax操作。page为目标页数。
                var dataJson = {
                    token: token,
                    page_no: page,
                    page_size: data.page_size,
                    numberOfPages: data.numberOfPages
                };
                queryFunc(dataJson);
            }
        };
        $("#pager").bootstrapPaginator(options)
    });
}
/**
 *点击按钮
 */
function bindBTNFunc(){
    //点击搜索按钮
    $("#queryBTN").unbind('click').bind('click', function () {
        var startTime = $("#startDate").val(),
            endTime = $("#endDate").val(),
            orderId = $("#orderId").val(),
            outOrderId = $("#outOrderId").val(),
            userId = $("#userId").val(),
            busiStatus = $("#busiStatus").data("chosen").selectedItem(),
            cardType = $("#cardType").data("chosen").selectedItem();
        busiStatus = busiStatus ? busiStatus['value'] : "";
        cardType = cardType ? cardType['value'] : "";
        var page = 1,
            pageSize = 20,
            numberOfPages = 10;
        var data = {
            token: token,
            page_no: page,
            page_size: pageSize,
            numberOfPages: numberOfPages,
            start_time: startTime,
            end_time: endTime,
            record_id: orderId,
            out_order_id: outOrderId,
            user_id: userId,
            order_status: busiStatus,
            card_type: cardType
        };
        //查询公交充值列表
        queryFunc(data);
    });
    //点击导出按钮
    $("#exportBTN").unbind('click').bind('click', function () {
        $("#exportForm").submit();
    });
}
/**
 * 下拉菜单初始化
 * @private
 */
function _initSelect(){
    //订单状态下拉框
    $("#busiStatus").data("chosen")._clearOptions();
    var busiStatusArr = [
        {text: "请选择", value: ""}
        ];
    for(var i in dictionary['busiStatus']){
        busiStatusArr.push({
            value: i,
            text: dictionary['busiStatus'][i]
        });
    }
    $("#busiStatus").data("chosen")._addOptions(busiStatusArr);

    //卡类型下拉框
    $("#cardType").data("chosen")._clearOptions();
    var cardTypeArr = [
        {text: "请选择", value: ""}
    ];
    for(var i in dictionary['cardType']){
        cardTypeArr.push({
            value: i,
            text: dictionary['cardType'][i]
        });
    }
    $("#cardType").data("chosen")._addOptions(cardTypeArr);
}
