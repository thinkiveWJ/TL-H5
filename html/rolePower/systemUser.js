$(function(){
    // fillTableData("#tbody","","",checkAll("#all","#tbody"));

    //添加用户
    $("#addUser").click(function(){
        clearUserPanel();
    });
});
/**
 * 清除面板
 */
function clearUserPanel() {
    $("#userPanel input").val("");
    $("#userPanel select[data-xtype]").data("chosen").selectedItem("");
    $("#userPanel").modal();
}

