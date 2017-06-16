$(function(){
    //初始化控件
    $("select[data-xtype='chosen']").chosen();

    /**清除导出form表单中的数据**/
    $("#exportForm input").val("");

    $(".modal").on("shown.bs.modal", function () {
        $(this).remove(".erro-info");
    })
});

/***
 * 搜索框中的时间与时间段的关系
 * @param id 开始时间
 * @param id2 结束时间
 * @param id3 select下拉框
 */
function dateSearch(id, id2, id3){
    $(id).datepicker({
        format: 'yyyy-mm-dd',
        language: 'cn',
        autoclose:true,
    }).on("changeDate",function(e){
        var startTime = e.date;
        if(startTime && id3){
            $(id3).data("chosen").selectedItem("");
        }
        $(id2).datepicker('setStartDate',startTime);
    });
    $(id2).datepicker({
        format: 'yyyy-mm-dd',
        language: 'cn',autoclose:true,
    }).on("changeDate",function(e){
        var endTime = e.date;
        if(endTime && id3){
            $(id3).data("chosen").selectedItem("");
        }
        $(id).datepicker('setEndDate',endTime);
    });
    if(id3){
        $(id3).change(function(){
            var value = $(this).val();
            if(value){
                $(id).val("");
                $(id2).val("");
            }
        });
    }
}
/**
 * 年月日时分秒
 * @param id
 * @param id2
 * @param id3
 */
function dateSearch2(id, id2, id3){
    $(id).datetimepicker({
        format: "yyyy-mm-dd hh:ii:ss",
        language: 'zh-CN',
        autoclose:true,
    }).on("changeDate",function(e){
        var startTime = e.date;
        if(startTime && id3){
            $(id3).data("chosen").selectedItem("");
        }
        $(id2).datetimepicker('setStartDate',startTime);
    });
    $(id2).datetimepicker({
        format: "yyyy-mm-dd hh:ii:ss",
        language: 'zh-CN',autoclose:true,
    }).on("changeDate",function(e){
        var endTime = e.date;
        if(endTime && id3){
            $(id3).data("chosen").selectedItem("");
        }
        $(id).datetimepicker('setEndDate',endTime);
    });
    if(id3){
        $(id3).change(function(){
            var value = $(this).val();
            if(value){
                $(id).val("");
                $(id2).val("");
            }
        });
    }
}
/**
 * 填充表格数据
 * @param id ele
 * @param data 入参
 * @param result 出参
 * */
function fillTableData(checkboxFlag, id, currentPage, currentNum, data, result, callback){
    // var data=[
    //         "a", "b", "c", "d", "e", "f", "g",
    //     function(result, i){
    //         return '<a type="button" class="btn btn-default">按钮'+result[i]["a"]+'</a>';
    //     }
    //
    // ];
    // var result = [
    //     {
    //         a: "1",
    //         b: "2",
    //         c: "3",
    //         d: "4",
    //         e: "5",
    //         f: "6",
    //         g: "7",
    //         h: "8",
    //         i: "9",
    //         k: ""
    //     },
    //     {
    //         a: "1",
    //         b: "2",
    //         c: "3",
    //         d: "4",
    //         e: "5",
    //         f: "6",
    //         g: "7",
    //         h: "8",
    //         i: "9"
    //     },
    //     {
    //         a: "3",
    //         b: "2",
    //         c: "3",
    //         d: "4",
    //         e: "5",
    //         f: "6",
    //         g: "7",
    //         h: "8",
    //         i: "9"
    //     }
    // ];
    var str = "";
    $(id).html("");
    var resultLen = result.length,
        dataLen = data.length;
    // var currentPage = 2,
    //     currentNum = 10;
    for(var i = 0; i < resultLen; i ++){
        if(checkboxFlag){
            str += '<tr>'
            +'     <td><input name="check_item" type="checkbox"></td>';
        }else{
            str += '<tr>';
            // +'     <td><input name="check_item" type="checkbox"></td>';
        }

        if(currentPage && currentNum){
            str += '<td>'+(currentNum * (currentPage - 1) + i + 1)+'</td>';
        }
        for(var  j = 0; j < dataLen; j ++ ){
            if(typeof (data[j]) !== "function"){
                str += '<td>' + result[i][data[j]] + '</td>';
            }else{
                str += '<td>'+ data[j](result,i) + '</td>';
            }
        }
        str += '  </tr>';
    }
    $(id).html(str);
    if(callback && typeof callback ==="function"){
        callback();
    }
}
/**
 * 全选 table列表下的
 * @param id  全选的id
 * @param id2 单个集合的父类的id
 */
function checkAll(id, id2){
    $(id).click(function() {
        if($(this).is(":checked")){
            $(id2+" input[type='checkbox']").prop("checked",true);
        }else{
            $(id2+" input[type='checkbox']").prop("checked",false);
        }
    });
    $(id2).on('click', " input[type='checkbox']", function() {
        for (var i = 0; i < $(id2 +" input[type='checkbox']").length; i++) {
            if($(id2 +" input[type='checkbox']")[i].checked != true){
                $(id).prop("checked", false);
                return;
            }else{
                $(id).prop("checked", true);
            }
        }
    });
}
/**
 * 帶label的全選
 * @param id
 * @param id2
 */
function checkLabelAll(id, id2){
    window.top.$(id).click(function() {
        if($(this).find("input[type='checkbox']").is(":checked")){
            window.top.$(id2+" input[type='checkbox']").prop("checked",true);
        }else{
            window.top.$(id2+" input[type='checkbox']").prop("checked",false);
        }
    });
    window.top.$(id2).on('click', " input[type='checkbox']", function() {
        for (var i = 0; i < window.top.$(id2 +" input[type='checkbox']").length; i++) {
            if(window.top.$(id2 +" input[type='checkbox']")[i].checked != true){
                window.top.$(id+" input[type='checkbox']").prop("checked", false);
                return;
            }else{
                window.top.$(id+" input[type='checkbox']").prop("checked", true);
            }
        }
    });
}


window.ajaxIsloadingIndex = 0;
var str = '<div class="content-load no-select">' +
                '<div class="content-load-box">' +
                    '<img src="../images/ajaxLoading.gif"/>' +
                    '<h3 class="title">正在努力加载中。。。</h3>' +
                '</div>' +
            '</div>';
window.$(document).ajaxStart(function() {
    if (window.ajaxIsloadingIndex == 0) {
        window.top.$('body').append(str);
    }
    window.ajaxIsloadingIndex++;
});
window.$(document).ajaxStop(function() {
    window.ajaxIsloadingIndex--;
    if (window.ajaxIsloadingIndex == 0) {
        window.top.$('.content-load').fadeOut(function() {
            $(this).remove();
        });
    }
});
/**
 *
 * @param url 请求路径
 * @param data  请求数据
 * @param callback  回调函数
 */
window.POST = function(url, data, callback){
    var token= sessionStorage.getItem("token");
    window.$.ajax({
        url: url,
        data: data,
        type: "post",
        timeout: "60000",
        success: function(result){
            var result = JSON.parse(result);
            if(result['result'] === 105){
                return window.top.location.href="../login.html";
            }
            if(result['result'] !== 0){
                if((window.top.$(".modal.fade.in").length == 0 && $(".modal.fade.in").length == 0)){
                    window.top.$("#dialog-error .modal-title").html("报错信息");
                    window.top.$("#dialog-error .modal-body").html(result["message"]);
                    window.top.$("#dialog-error").modal();
                }else{
                    $(".modal.fade.in .modal-body").append("<div class='form-display error-info'>"+result["message"]+"</div>");
                    window.top.$(".modal.fade.in .modal-body").append("<div class='form-display error-info'>"+result["message"]+"</div>");
                }
                return;
            }

            typeof(callback) == "function" && callback(result);
        }
    }).fail(function(err,xhr){
        if(err &&( err.status==0 || err.status==200)){
            return;
        }
        window.ajaxIsloadingIndex = 0;
        window.top.$('.content-load').fadeOut(function() {
            $(this).remove();
        });
    });
};
/**
 * 检验密码格式
 * @param password
 * @returns {boolean}
 */
function testPassword(password){
    var pattern = /^[a-zA-Z\d]{6,20}$/;
    return pattern.test(password);
}
/**
 * 上传图片并显示图片路径
 * @param dialog
 * @param uploadInput type=file
 * @param uploadName  type=text显示图片路径
 */
function uploadPicName(dialog, uploadInput, uploadName) {
    var _this = dialog;
    $(_this).find(uploadInput).change(function () {
        $(_this).find(".error-info").remove();
        if (!$(this)[0]&&!$(this)[0].value) {
            var str = "";
            str = '<div class="form-display error-info">您的浏览器版本太低！</div>';
            $(str).appendTo($(_this).find(".modal-body"));
            return;
        }
        var imgSrc = $(this)[0].value;
        if (!/\.(jpg|png|JPG|PNG)$/.test(imgSrc)) {
            var str = "";
            str = '<div class="form-display error-info">请上传正确格式的图片！</div>';
            $(str).appendTo($(_this).find(".modal-body"));
            return false;
        }
        $(uploadName).val(imgSrc);
    });
}
/**
 * 数据字典
 * @type {{busiStatus: {KC_SUCCESS: string, KC_FAIL: string, KC_PROCESS: string, QC_GETINFO: string, QC_SUCCESS: string, QC_PROCESS: string, QC_FAIL: string}, cardType: {TFT: string}, cardStatus: {UNUSE: string, USED: string, EXPORTED: string}, payType: {w: string, z: string, b: string, k: string, x_bus: string, x_opencard: string}}}
 */
var dictionary = {
    busiStatus: {   //订单状态
        1: "空充前",
        2: "天府通已空充未圈存",
        3: "已下发圈存指令，app未确认",
        4: "app确认圈存成功",
        5: "app确认圈存失败",
        6: "天府通确认成功",
        7: "天府通冲正成功"
    },
    cardType: { //卡类型
        TFT: "天府通"
    },
    cardStatus: {   //卡券状态
       UNUSE: "未使用",
       USED: "已使用",
       EXPORTED: "已导出"
    },
    payType: {
        0: "智向钱包余额支付"
    },
    balancePayType: {//
        w: "微信支付",
        z: "支付宝支付",
        b: "百度钱包支付",
        k: "卡卷充值"
    }
};
/**
 * 获取数据字典
 * @param text
 * @param value
 * @returns {*}
 */
function getDictionary(text, value){
    if(!dictionary[text]){
        return value;
    }
    if(!dictionary[text][value]){
        return value;
    }
    return dictionary[text][value];
}
/**
 * 格式化时间
 * @param times
 * @returns {string}
 */
function getYYMMDD(times){
    var date = new Date(times*1000),
        m = date.getMonth() + 1,
        d = date.getDate();
    m = m < 10 ? "0" + m : m;
    d = d < 10 ? "0" + d : d;
    return date.getFullYear() + "-" + m + "-" + d;
}
/**
 * yyyy-MM-dd转换成秒数
 * @param yyyymmdd
 * @param flag
 * @returns {number}
 */
// function getSeconds(yyyymmdd, flag) {
//     if(!yyyymmdd){
//         return;
//     }
//     var date = new Date(yyyymmdd);
//     var seconds = date.getTime()/1000;
//     if(flag){
//         seconds += 86399;
//     }
//     return seconds;
// }