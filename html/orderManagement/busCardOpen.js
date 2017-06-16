var token = sessionStorage.getItem("token"),
    getOpenCardInfoUrl = "http://m3.beacool.com/mozan/queryCreateCardRecords.do";
if(!token){
    window.top.location.href="../login.html"
}
$(function () {
    dateSearch("#startDate", "#endDate");
    _initSelect();//下拉菜单初始化
    var page = 1,
        pageSize = 20,
        numberOfPages = 10;
    var data = {
        token: token,
        page_no: page,
        page_size: pageSize,
        numberOfPages: numberOfPages,
        start_time: "",
        end_time: "",
        record_id: "",
        consume_order_id: "",
        user_id: "",
        pay_method: "",
        card_type: "",
        card_no: ""
    };
    //查询公交开发列表
    queryFunc(data);
    //点击按钮
    bindBTNFunc();
});
/**
 * 下拉菜单初始化
 * @private
 */
function _initSelect() {
    $("#payMethod").data("chosen")._clearOptions();
    var payMethodArr = [{
        text: "请选择",
        value: ""
    }];
    for(var i in dictionary['payType']){
        payMethodArr.push({
            text: dictionary['payType'][i],
            value: i
        });
    }
    $("#payMethod").data("chosen")._addOptions(payMethodArr);

    $("#cardType").data("chosen")._clearOptions();
    var cardTypeArr = [{
        text: "请选择",
        value: ""
    }];
    for(var i in dictionary['cardType']){
        cardTypeArr.push({
            text: dictionary['cardType'][i],
            value: i
        });
    }
    $("#cardType").data("chosen")._addOptions(cardTypeArr);
}
/**
 * 查询公交开卡列表
 * @param data
 */
function queryFunc(data){
    POST(getOpenCardInfoUrl, data, function (result) {
        $("input[name='record_id']").val(data['record_id']);
        $("input[name='consume_order_id']").val(data['consume_order_id']);
        $("input[name='card_no']").val(data['card_no']);
        $("input[name='user_id']").val(data['user_id']);
        $("input[name='start_time']").val(data['start_time']);
        $("input[name='end_time']").val(data['end_time']);
        $("input[name='card_type']").val(data['card_type']);
        $("input[name='pay_method']").val(data['pay_method']);
        $("input[name='token']").val(data['token']);
        if(!result['data']){
            return;
        }
        var dataArr = result['data']['record_list'];
        if(!dataArr){
            return;
        }
        var dataFile = [
            'record_id',
            function (dataArr, i){
                return dataArr[i]['amount']/100;
            },
            function (dataArr, i){
                return dictionary['payType'][dataArr[i]['pay_method']];
            },
            'consume_order_id',
            function (dataArr, i){
                return dictionary['cardType'][dataArr[i]['card_type']];
            },
            "card_no",
            "user_id",
            function (dataArr, i){
                return getYYMMDD(dataArr[i]['create_time']);
            }
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
 * 点击按钮
 */
function bindBTNFunc() {
    //点击查询按钮
    $('#queryBTN').unbind('click').bind('click', function () {
        var cardType = $("#cardType").data("chosen").selectedItem();
        cardType = cardType ? cardType['value']: "";
        var payMethod = $("#payMethod").data("chosen").selectedItem();
        payMethod = payMethod ? payMethod['value']: "";
        var page = 1,
            pageSize = 20,
            numberOfPages = 10;
        var data = {
            token: token,
            page_no: page,
            page_size: pageSize,
            numberOfPages: numberOfPages,
            record_id: $("#dataId").val(),
            consume_order_id: $("#seid").val(),
            card_no: $("#cardNo").val(),
            user_id: $("#userId").val(),
            start_time: $("#startDate").val(),
            end_time: $("#endDate").val(),
            card_type: cardType,
            pay_method: payMethod
        };
        //查询公交开卡列表
        queryFunc(data);
    });
    //点击导出按钮
    $("#exportBTN").unbind('click').bind('click', function () {
        $("#exportForm").submit();
    });
}