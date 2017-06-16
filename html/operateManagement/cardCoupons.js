var token = sessionStorage.getItem("token"),
    queryListUrl = 'http://m3.beacool.com/mozan/getCardCoupon.do',
    produceCardCouponUrl = 'http://m3.beacool.com/mozan/produceCardCoupon.do';
$(function () {
    _initSelect(); //初始化下拉框
    var page = 1,
        pageSize = 20,
        numberOfPages = 10;
    var data = {
        token: token,
        page: page,
        pageSize: pageSize,
        numberOfPages: numberOfPages,
        batchNumber: "",
        cardCouponId: "",
        status: ""
    };
    //查询公交充值列表
    queryFunc(data);
    //点击按钮
    bindBTNFunc();
});
/**
 * 初始化下拉框
 * @private
 */
function _initSelect(){
    var cardStatusArr = [
        {
            text: "请选择",
            value: ""
        }
    ];
    for(var i in dictionary['cardStatus']){
        cardStatusArr.push({
            text: dictionary['cardStatus'][i],
            value: i
        });
    }
    $("#status").data("chosen")._clearOptions();
    $("#status").data("chosen")._addOptions(cardStatusArr);
}
/**
 * 查询卡券管理列表
 */
function queryFunc(data) {
    POST(queryListUrl, data, function (result) {
        $("input[name='batchNumber']").val(data['batchNumber']);
        $("input[name='cardCouponId']").val(data['cardCouponId']);
        $("input[name='status']").val(data['status']);
        $("input[name='token']").val(data['token']);
        if(!result['data']){
            return;
        }
        var dataArr = result['data']['data'];
        if(!dataArr){
            return;
        }
        var dataFile = [
            "couponId",
            "batchNumber",
            function (dataArr, i) {
                return dataArr[i]['denomination']/100;
            },
            function (dataArr, i) {
                return getDictionary("cardStatus", dataArr[i]['status'])
            },
            "updateTime",
            "remark"
        ];
        //填充数据
        fillTableData(false, "#tbody", data.page, data.pageSize, dataFile, dataArr);
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
                    page: page,
                    pageSize: data.pageSize,
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
    //点击查询
    $("#queryBTN").unbind('click').bind('click', function () {
        var batchNumber = $("#batchNumber").val(),
            cardCouponId = $("#cardCouponId").val(),
            status = $("#status").data("chosen").selectedItem();
        status = status ? status['value'] : "";
        var page = 1,
            pageSize = 20,
            numberOfPages = 10;
        var data = {
            token: token,
            page: page,
            pageSize: pageSize,
            numberOfPages: numberOfPages,
            batchNumber: batchNumber,
            cardCouponId: cardCouponId,
            status: status
        };
        //查询公交充值列表
        queryFunc(data);
    });
    //点击导出功能
    $("#exportBTN").unbind('click').bind('click', function () {
        $("#exportForm").submit();
    });
    //点击批量生产卡券
    $("#addBatchCardBTN").unbind('click').bind('click', function () {
        $("#cardPanel input").val("");
        $("#cardPanel .error-info").remove();
        $("#cardPanel").modal();
        // 批量生产卡券
        batchCardFunc();
    });
}
/**
 * 批量生产卡券
 */
function batchCardFunc(){
    $("#cardPanel .btn.ok").unbind('click').bind('click', function () {
        var data = {},
            denomination = $("#denominationAdd").val(),
            count = $("#countAdd").val();
        $("#cardPanel .error-info").remove();
        if(isNaN(denomination) || denomination <= 0){
            var str = '<div class="error-info">请输入面额大于0的数字！</div>'
            $("#cardPanel .modal-body").append(str);
            return;
        }
        if(isNaN(count) || count <= 0){
            var str = '<div class="error-info">请输入数量大于0数字！</div>'
            $("#cardPanel .modal-body").append(str);
            return;
        }
        data = {
            token: token,
            denomination: denomination*100,
            count: count
        }
        POST(produceCardCouponUrl, data, function () {
            $("#cardPanel").modal("hide");
            var page = 1,
                pageSize = 20,
                numberOfPages = 10;
            var data = {
                token: token,
                page: page,
                pageSize: pageSize,
                numberOfPages: numberOfPages,
                batchNumber: "",
                cardCouponId: "",
                status: ""
            };
            //查询公交充值列表
            queryFunc(data);
        });
    });
}