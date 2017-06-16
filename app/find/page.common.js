/**
 * 获取url中的参数
 * @param name
 * @returns {null}
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return r[2]; return null; //返回参数值
}
/**
 * $.ajax封装
 * @param data
 * @param url
 * @param callback
 * @constructor
 */
function POST(url, data, callback){
    $.ajax({
        data: data,
        type: "post",
        dataType: "json",
        url: url,
        success: function (result) {
            if(result["result"] === 105){
                alert("登录超时，请重新登录！");
                return;
            }
            if(result['result'] !== 0){
                alert(result['message']);
                return;
            }
            callback && typeof callback == 'function' && callback(result);
        }
    });
}
/**
 * 获取当前时间格式为yyyymmdd(20170516)
 * @returns {Date}
 */
function getToday() {
    var date = new Date();
    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
    month = month > 9 ? month : "0" + month;
    day = day > 9 ? day : "0" + day;
    date = year + month + day;
    return date;
}