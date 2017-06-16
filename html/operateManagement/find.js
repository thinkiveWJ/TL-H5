var token = sessionStorage.getItem("token"),
    bannerIndex = 0,
    queryBannerUrl = "http://m3.beacool.com/mozan/selectFindBanner.do",
    dealInfoShareUrl = "http://m3.beacool.com/mozan/dealInfoShare.do",
    querySelectInfoShare = "http://m3.beacool.com/mozan/selectInfoShare.do",
    uploadBannerUrl = "http://m3.beacool.com/mozan/updateUploadImgData.do";
$(function () {

    //添加Banner
    $('#banner li').unbind('click').bind('click', function () {
        bannerIndex = $('#banner li').index(this);
        clearBannerPanel();//清除添加banner面板
        //添加Banner ok
        $("#bannerPanel .ok").unbind('click').bind('click', function () {
            $("#bannerPanel .error-info").remove();
            if($("#uploadInput").val()){
                $("#bannerForm").submit();
            }else{
                addBannerPanel();
            }
        });
    });
    //点击添加分享资讯按钮
    $("#addInfoBTN").unbind('click').bind('click', function () {
        clearAddInfoPanel();//清除添加资讯分享面板
    });

    //查询已上传的Banner
    queryBannerFunc();

    //查询出行支付列表--类型 TRAVELPAY:出行支付 SPORTHEALTHY:运动健康
    var page = 1,
        pageSize = 5,
        numberOfPages = 10;
    var data = {
        token: token,
        page_num: page,
        page_size: pageSize,
        numberOfPages: numberOfPages,
        busiType: "TRAVELPAY"
    };
    queryTravelPayFunc(data);

    //点击资讯分享的按钮
    bindBTNFunc();
});
/**
 * 清除添加banner面板
 */
function clearBannerPanel() {
    $("#bannerPanel input").val("");
    $("#bannerPanel .error-info").remove();
    var $img = $('#banner li').eq(bannerIndex).find('img'),
        src = $img.attr("src"),
        advertLink = $img.attr("advertLink");
    if(src && src != "../../images/banner_add.png"){
        $("#uploadPicName").val(src);
    }
    $("#advertLink").val(advertLink);
    $("#bannerPanel").modal();
    $('#bannerPanel').on('shown.bs.modal', function (e) {
        /**
         * 上传图片并显示图片路径
         * @param dialog
         * @param uploadInput type=file
         * @param uploadName  type=text显示图片路径
         */
        uploadPicName("#bannerPanel", "#uploadInput", "#uploadPicName");
    });
}
/**
 * 清除添加分享资讯面板
 */
function clearAddInfoPanel() {
    $("#informationPanel input").val("");
    $("#informationPanel textarea").val("");
    $("#informationPanel .error-info").remove();
    $("#informationPanel").modal();
    var str = $(".share-nav .nav-tabs .active").text();
    $("#addShareTile").html(str);
    $("#informationPanel").attr("dataId", "");
    /**
     * 上传图片并显示图片路径
     * @param dialog
     * @param uploadInput type=file
     * @param uploadName  type=text显示图片路径
     */
    uploadPicName("#informationPanel", "#infoUpload" , "#infoPicName");
}
/**
 * 上传banner 回调
 * @returns {boolean}
 */
function saveBanner() {
    // jquery 表单提交
    $("#bannerForm").ajaxSubmit(function(message){
        // 对于表单提交成功后处理，message为提交页面saveReport.htm的返回内容
        var message = JSON.parse(message);
        if(message['result'] == 0){
            $("#uploadPicName").val(message['data']);
            addBannerPanel();
        }
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}
/**
 * 上传或者修改Banner
 */
function addBannerPanel(){
    var dataId = $('#banner li').eq(bannerIndex).find('img').attr("dataId");
    var url = $("#uploadPicName").val();
    var data = {
        token: token,
        id: dataId,
        "advert_link": $("#advertLink").val(),
        "img_path": url
    };
    POST(uploadBannerUrl, data, function (result) {
        $("#bannerPanel").modal('hide');
        $('#banner li').eq(bannerIndex).find("img").attr("src", result['data']['imgPath']);
        $('#banner li').eq(bannerIndex).find("img").attr("dataId", result['data']['dataId']);
        $('#banner li').eq(bannerIndex).find("img").attr("advertLink", result['data']['advertLink']);
        queryBannerFunc();//查询已上传的Banner
    });
}
/**
 * 查询已上传的Banner
 */
function queryBannerFunc() {
    $("#banner img").attr("dataId", "");
    $("#banner li img").attr("src", "../../images/banner_add.png");
    $("#banner li img").attr("advertLink", "");
    POST(queryBannerUrl, {token: token}, function (result) {
        var data = result['data'],
            dataLen = data.length;
        for(var i = 0; i < dataLen; i ++ ){
            $("#banner li").eq(i).find('img').attr("dataId", data[i]['dataId']);
            if(data[i]['imgPath']&&data[i]['advertLink']){
                $("#banner li").eq(i).find('img').attr("src", data[i]['imgPath']);
                $("#banner li").eq(i).find('img').attr("advertLink", data[i]['advertLink']);
            }
        }
    });
}
/**
 * 查询出行支付列表
 */
function queryTravelPayFunc(data) {
    POST(querySelectInfoShare, data, function (result) {
        if(!result['data']){
            return;
        }
        var dataArr = result['data']['data'];
        if(!dataArr){
            return;
        }
        //填充数据
        fillShareData("#shareContent", dataArr);
        //分页数据
        var options = {
            bootstrapMajorVersion:3,//版本号。3代表的是第三版本
            currentPage: data.page_num, //当前页数
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
                    busiType: data['busiType'],
                    numberOfPages: data.numberOfPages
                };
                queryTravelPayFunc(dataJson);
            }
        };
        $("#pager").bootstrapPaginator(options)
    });
}
/**
 * 填充数据
 */
function fillShareData(id, dataArr) {
    var str = "";
    for(var i in dataArr){
        str += '<li>'+
        '        <div class="image left">'+
        '         <img src="'+dataArr[i]['imgPath']+'" alt="">'+
        '           </div>'+
        '           <div class="share-content-box left">'+
        '               <div class="share-content-title">'+dataArr[i]['title']+'</div>'+
        '               <div class="share-content-details">'+dataArr[i]['detail']+'</div>'+
        '           </div>'+
        '           <div class="right">'+
        '               <a class="btn btn-primary" dataId="'+dataArr[i]['dataId']+'"><span class="glyphicon glyphicon-edit"></span></a>'+
        '            </div>'+
        '           <div class="clearfix"></div>'+
        '       </li>';
    }
    $(id).html(str);
    //修改分享资讯按钮
    $("#shareContent li .btn-primary").unbind('click').bind('click', function () {
        clearAddInfoPanel();//清除添加资讯分享面板
        var dataId = $(this).attr("dataId");
        $("#informationPanel").attr("dataId", dataId);
        //填充编辑资讯分享信息
        fillEditShareInfoFunc(dataId);
    });
}
/**
 * 点击资讯分享的按钮
 */
function bindBTNFunc(){
    //点击标题切换
    $(".share-nav .nav-tabs li").unbind('click').bind('click', function () {
        $(this).addClass("active").siblings().removeClass("active");
        var index = $(".share-nav .nav-tabs li").index(this);
        var page = 1,
            pageSize = 5,
            numberOfPages = 10;
        var busiType = "TRAVELPAY";
        if(index == 0){
            busiType = "TRAVELPAY";
        }else if(index == 1){
            busiType = "SPORTHEALTHY";
        }
        var data = {
            token: token,
            page_num: page,
            page_size: pageSize,
            numberOfPages: numberOfPages,
            busiType: busiType
        };
        queryTravelPayFunc(data);
    });
    //点击新增的ok按钮
    $("#informationPanel .ok").unbind('click').bind('click', function () {
        $("#informationPanel .error-info").remove();
        var title = $("#addShareTitle").val(),
            content = $("#addShareDetail").val(),
            str = '';
        if(title === ""){
            str = '<div class="form-display error-info">标题不能为空！</div>';
            $(str).appendTo($("#informationPanel .modal-body"));
            return;
        }
        if(!$("#infoUpload").val()){
            str = '<div class="form-display error-info">请上传图片！</div>';
            $(str).appendTo($("#informationPanel .modal-body"));
            return;
        }
        if(content === ""){
            str = '<div class="form-display error-info">内容不能为空！</div>';
            $(str).appendTo($("#informationPanel .modal-body"));
            return;
        }
        $("#addShare").submit();
    });
}
/**
 * 出行支付或者运动健康内容的上传图片
 */
function saveShare(){
    // jquery 表单提交
    $("#addShare").ajaxSubmit(function(message){
        // 对于表单提交成功后处理，message为提交页面saveReport.htm的返回内容
        var message = JSON.parse(message);
        if(message['result'] == 0){
            $("#infoPicName").val(message["data"]);
            addSharePanel();//资讯分享
        }
    });
    return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
}
/**
 * 资讯分享
 */
function addSharePanel(){
    var busiType = "",
        str = $(".share-nav .nav-tabs li.active").text();
    if(str == "出行支付"){
        busiType = "TRAVELPAY";
    }else if(str == "运动健康"){
        busiType = "SPORTHEALTHY";
    }
    var data = {
        token: token,
        dataId: $("#informationPanel").attr("dataId"),
        busiType: busiType,
        imgPath: $("#infoPicName").val(),
        title: $("#addShareTitle").val(),
        detail: $("#addShareDetail").val()
    };
    POST(dealInfoShareUrl, data, function (result) {
        $("#informationPanel").modal('hide');
        var str = $(".share-nav .nav-tabs li.active").text();
        var page = 1,
            pageSize = 5,
            numberOfPages = 10;
        var dataJson = {
            token: token,
            page_num: page,
            page_size: pageSize,
            numberOfPages: numberOfPages,
            busiType: data['busiType']
        };
        queryTravelPayFunc(dataJson);
    });
}
/**
 * 填充编辑资讯分享信息
 * @param dataId
 */
function fillEditShareInfoFunc(dataId){
    var busiType = "",
        str = $(".share-nav .nav-tabs li.active").text();
    if(str == "出行支付"){
        busiType = "TRAVELPAY";
    }else if(str == "运动健康"){
        busiType = "SPORTHEALTHY";
    }
    var data = {
        page_num: 1,
        page_size: 1,
        token: token,
        id: dataId,
        busiType: busiType
    };
    POST(querySelectInfoShare, data, function (result) {
        var dataArr = result['data'];
        if(!dataArr){
            return;
        }
        $("#addShareTitle").val(dataArr[0]['title']);
        $("#infoPicName").val(dataArr[0]['imgPath']);
        $("#addShareDetail").val(dataArr[0]['detail']);
    });
}

