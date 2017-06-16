var url = "http://m3.beacool.com/mozan/userLoginManage.do";
$(function () {
    sessionStorage.clear();
    var userName,
        password;
    //点击登录
    $("#loginBTN").unbind('click').bind('click', function () {
        userName = $("#userName").val();
        password = $("#password").val();
        var data = {
            userName: userName,
            password: password
        };
        POST(url, data, function (result) {
            var token = result['data']['token'];
            sessionStorage.setItem("token", token);
            window.location.href='index.html';
        });
    });
});