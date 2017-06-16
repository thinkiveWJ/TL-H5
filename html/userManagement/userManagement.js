$(function(){
    //page.common.js?v=2.0.0 填充数据
    // fillTableData("#tbody","","",checkAll("#all","#tbody"));
    //page.common.js?v=2.0.0 分页
    //点击事件
    bindBTN();
});
/**
 * 点击事件
 */
function bindBTN() {
    //点击查看所有优惠券
    $("#userPanelBTN").unbind("click").bind("click", function () {
       $("#userPanel select").data("chosen").selectedItem("");
        $("#userPanel").modal();
    });
}

