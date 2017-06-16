var token = sessionStorage.getItem("token"),
    dateStartType = [
        {text: "请选择开始时间", value: "0"},
        {text: "创建开始时间", value: "1"},
        {text: "领取开始时间", value: "2"},
        {text: "过期开始时间", value: "3"},
        {text: "使用开始时间", value: "4"}
    ],
    dateEndType = [
        {text: "请选择结束时间", value: "0"},
        {text: "创建结束时间", value: "1"},
        {text: "领取结束时间", value: "2"},
        {text: "过期结束时间", value: "3"},
        {text: "使用结束时间", value: "4"}
    ];
$(function () {
    //初始化搜索时间
    dateSearch("#startDate", "#endDate");
    //点击按钮
    bindBTN();
    //初始化下拉框
    _initSelect();
});
/**
 * 点击按钮
 */
function bindBTN(){
    //点击批量生产优惠券按钮
    $("#addBatchCouponBTN").unbind('click').bind("click", function () {
        $("#couponPanel input").val("");
        $("#couponPanel input[name='use']:eq(1)").trigger('click');
        $("#couponPanel .error-info").remove();
        $("#couponPanel").modal();
        // 批量优惠券
        batchCouponFunc();
    });
}
/**
 * 初始化下拉框
 * @private
 */
function _initSelect() {
    $("#dateStartType").data("chosen")._clearOptions();
    $("#dateEndType").data("chosen")._clearOptions();
    $("#dateStartType").data("chosen")._addOptions(dateStartType);
    $("#dateEndType").data("chosen")._addOptions(dateEndType);
    //开始结束时间下拉框联动
    $("#dateStartType").change(function () {
        var value = $(this).data("chosen").selectedItem();
        value = value ? value['value'] : "0";
        $("#dateEndType").data("chosen").selectedItem(value);
    });
}
/**
 * 批量优惠券
 */
function batchCouponFunc() {
    //有效期关联
    dateSearch("#couponStartDate", "#couponEndDate", "#couponValidityDate");
}