var token = sessionStorage.getItem("token"),
    queryListUrl = 'http://m3.beacool.com/mozan/userWalletRecordsQueryForWeb.do';
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
        page_num: page,
        page_size: pageSize,
        numberOfPages: numberOfPages
    };
    //查询余额充值列表
    queryFunc(data);
    //点击按钮
    bindBTNFunc();
});
/**
 * 下拉菜单初始化
 * @private
 */
function _initSelect(){
    $("#payType").data("chosen")._clearOptions();
    var payTypeArr = [{
        text: "请选择",
        value: ""
    }];
    for(var i in dictionary['balancePayType']){
        payTypeArr.push({
            text: dictionary['balancePayType'][i],
            value: i
        });
    }
    $("#payType").data("chosen")._addOptions(payTypeArr);
}
/**
 * 查询余额充值列表
 * @param data
 */
function queryFunc(data){
    POST(queryListUrl, data, function (result) {
        $("input[name='orderId']").val(data['orderId']);
        $("input[name='cardCoupon']").val(data['cardCoupon']);
        $("input[name='payMethod']").val(data['payMethod']);
        $("input[name='userName']").val(data['userName']);
        $("input[name='userPhone']").val(data['userPhone']);
        $("input[name='startTime']").val(data['startTime']);
        $("input[name='endTime']").val(data['endTime']);

        $("input[name='token']").val(data['token']);

        if(!result['data']){
            return;
        }
        var dataArr = result['data']['data'];
        if(!dataArr){
            return;
        }
        var dataFile = [
            'orderId',
            function (dataArr, i){
                return dataArr[i]['tradeMoney']/100;
            },
            'busiType',
            'cardCoupon',
            "userName",
            "userPhone",
            "tradeTime",
            "orderRemark"
        ];
        //填充数据
        fillTableData(false, "#tbody", data.page_num, data.page_size, dataFile, dataArr);
        //分页数据
        var options = {
            bootstrapMajorVersion:3,//版本号。3代表的是第三版本
            currentPage: data.page, //当前页数
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
                    page_num: page,
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
            cardCoupon = $("#cardCoupon").val(),
            userName = $("#userName").val(),
            userPhone = $("#userPhone").val(),
            payMethod = $("#payType").data("chosen").selectedItem();
        payMethod = payMethod ? payMethod['value'] : "";
        var page = 1,
            pageSize = 20,
            numberOfPages = 10;
        var data = {
            token: token,
            page_num: page,
            page_size: pageSize,
            numberOfPages: numberOfPages,
            startTime: startTime,
            endTime: endTime,
            orderId: orderId,
            payMethod: payMethod,
            userName: userName,
            userPhone: userPhone
        };
        //查询余额充值列表
        queryFunc(data);
    });
    //点击导出按钮
    $("#exportBTN").unbind('click').bind('click', function () {
        $("#exportForm").submit();
    });
}