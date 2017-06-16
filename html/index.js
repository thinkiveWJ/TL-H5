
window = window.top;
$(function(){
    //初始化
    _init();
    //点击菜单事件
    bindMenus();
    //点击登录菜单事件
    bindLogin();
});
/******初始化*****/
function _init(){
    $(".menu-boxs > ul li ul").show();
    window.frames["contentFrame"].location.replace("dataAnalysis/userStatistics.html");
    $(".menu-boxs li a").click(function(){
        $(this).next("ul").find("li:eq(0)").addClass("on").siblings().removeClass("on");
        var _target = $(this).attr("href");
        _target = _target.split("#");
        if(_target){
            _target = _target[1];
            _target = _target + "?v=2.0.0";
            window.frames["contentFrame"].location.replace(_target);
        }
    });
}


/********点击菜单事件*******/
function bindMenus(){
    $(".menu-box li").unbind("click").bind("click",function(){
        $(".menu-box li").removeClass("on");
        $(this).addClass("on");
    });
}
/**
 * 点击登录菜单事件
 */
function bindLogin(){
    //修改密码
    $("#updatePassword").click(function(){
        $("#dialog .modal-title").text("修改密码");
        var str ='<div class="form-display">请输入旧密码以验证身份</div>'
        +'        <div class="form-display">'
        +'          <label for="oldPassword" class="form-label">旧密码</label>'
        +'          <input type="text" class="form-control form-input" id="oldPassword" placeholder="请输入6-20有效数字或字母">'
        +'        </div>'
        +'<div class="form-display">请输入请输入您希望的新密码</div>'
        +'        <div  class="form-display">'
        +'          <label for="password"  class="form-label">新密码</label>'
        +'          <input type="email" class="form-control form-input" id="password" placeholder="请输入6-20有效数字或字母">'
        +'        </div>'
        +'        <div  class="form-display">'
        +'          <label for="password2"  class="form-label">确认密码</label>'
        +'          <input type="email" class="form-control form-input" id="password2" placeholder="请输入6-20有效数字或字母">'
        +'        </div>';
        $("#dialog .modal-body").html(str);
        $("#dialog").modal();
        $("#dialog .ok").unbind('click').bind('click',function(){
            var oldPassword = $("#oldPassword").val(),
                password = $("#password").val(),
                password2 = $("#password2").val();
            //修改密码
            updatePassword(oldPassword, password, password2);
        });
    });
    //点出退出
    $("#loginOut").unbind('click').bind('click', function () {
        sessionStorage.clear();
        window.top.location.href="./login.html";
    });
}
/**
 * 修改密码
 * @param oldPassword
 * @param password
 * @param password2
 */
function updatePassword(oldPassword, password, password2){
    window.top.$("#dialog .error-info").remove();
    var str = "";
    if(!testPassword(oldPassword)){
        str = '<div class="form-display error-info">请输入6-20位有效数字或字母的旧密码</div>';

    }else if(!testPassword(password)){
        str = '<div class="form-display error-info">请输入6-20位有效数字或字母的新密码</div>';
    }else if(password != password2){
        str = '<div class="form-display error-info">确认密码与新密码不一致</div>';
    }
    $(str).appendTo(window.top.$("#dialog .modal-body"));
    if(str){
        return;
    }
}
