var token = sessionStorage.getItem("token");
$(function () {
    //点击按钮
    bindBTN();
});
/**
 * 点击按钮
 */
function bindBTN() {
    //添加
    $("#addBTN").unbind('click').bind('click', function () {
        $("#addActivePanel input").val("");
        $("#addActivePanel textarea").val("");
        $("#addActivePanel .error-info").remove();
        $("#addActivePanel").modal();
        // t添加
        addActiveFunc();
    });
    //点击活动地点
    $("#address").unbind("click").bind("click",function () {
        $("#addressPanel input").val("");
        $("#addressPanel textarea").val("");
        $("#addressPanel .error-info").remove();
        $("#addressPanel").modal();
        // 地点查看
        addressPanelFunc();
    });
}
/**
 * 添加
 */
function addActiveFunc() {
    dateSearch("#addStartDate","#addEndDate");
}
/**
 * 地点查看
 */
function addressPanelFunc() {
    //点击添加地点
    $("#addAddressBTN").unbind("click").bind('click', function () {
        $("#addAddressPanel input").val("");
        $("#addAddressPanel .col-sm-8 label:eq(0) input").trigger("click");
        $("#addAddressPanel .form-group.beacon").hide();
        $("#addAddressPanel .error-info").remove();
        $("#addAddressPanel").modal();
        $("#addAddressPanel input[type='radio']").unbind("click").bind('click', function () {
            var valueType = $(this).attr("valueType");
            if(valueType == "beacon"){
                $("#addAddressPanel .form-group.beacon").show();
            }else{
                $("#addAddressPanel .form-group.beacon").hide();
            }
        });
        //添加具体地点
        addAddressDetailsFunc();
    });
}
/**
 * 添加具体地点
 */
function addAddressDetailsFunc() {


}