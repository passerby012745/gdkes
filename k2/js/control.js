var resource = null;
var state1 = null;
var name1 = null;
var state2 = null;
var name2 = null;
var outID = null;
var btnClick = null;
var status = null;
var primaryColor = null;//主色
var minorColor = null;//次色

function getResource() {
    return resource;
}

function getCurrentDeviceSn() {
    return window.AppJsBridge.service.deviceService.getCurrentDeviceSn();
}

function initPage() {
    var spanArray = document.getElementsByTagName("span");
    for (var i = 0; i < spanArray.length; i++) {
        var key = spanArray[i].getAttribute("local_key");
        spanArray[i].innerHTML = getResource()[key];
    }
}

function loadpage() {
    console.log(getCurrentDeviceSn());
    window.AppJsBridge.service.deviceService.getDevice({
        "sn": getCurrentDeviceSn(),
        "success": function (res) {
            console.log(res);
            if (res.hasOwnProperty("gdkesDoubleWallSwitch")) {
                state1 = res.gdkesDoubleWallSwitch.state1;
                name1 = res.gdkesDoubleWallSwitch.scene1;
                state2 = res.gdkesDoubleWallSwitch.state2;
                name2 = res.gdkesDoubleWallSwitch.scene2;
                status = res.basic.status;
                $("#uiTitle").text(res.basic.name);
            }
            if (name1 == "" || name1 == null) {
                $("#btn1").html(getResource()["BUTTON_ONE"]);
            }else{
                $("#btn1").html(name1);
            }
            if (name2 == "" || name2 == null) {
                $("#btn2").html(getResource()["BUTTON_TWO"]);
            }else{
                $("#btn2").html(name2);
            }

            if (res == null || res.basic == null || status == null || status == "offline") {
                $(".status").text(getResource().OFFLINE);
            } else {
                $(".status").text(getResource().ONLINE);
                if (res.gdkesDoubleWallSwitch == null) {
                    $(".status").text(getResource().OFFLINE);
                    // return;
                }
            }
            setColor(state1,state2);
        },
        "error": function (res) {
        }
    })
}


function setColor(key1,key2) {
    clearTimeout(outID);
    if (status == "offline") {
        $(".offLine").css("display", "block");
        $(".back_img_light_small").css("background-color", "#cccccc");
        $(".status").css("color", "#cccccc");
        for (var i = 21; i <= 22; i++) {
            var id = "light" + i;
            $("#" + id).css("background-color", "#cccccc");
        }
    } else {
        $(".offLine").css("display", "none");
        $(".back_img_light_small").css("background-color", primaryColor);
        $(".status").css("color", primaryColor);
        if (key1 == "on") {
            $("#light21").css("background-color", primaryColor);
        } else {
            $("#light21").css("background-color", "#cccccc");
        }

        if (key2 == "on") {
            $("#light22").css("background-color", primaryColor);
        } else {
            $("#light22").css("background-color", "#cccccc");
        }
    }
    outID = setTimeout(loadpage, 5000);
}

function changState(num) {
    clearTimeout(outID);
    if (num == "one") {
        console.log("state1", state1);
        if (state1 == "off") {
            state1 = "on";
            setColor(state1,state2);
            doAction("turnOnFirst",{})
        } else {
            state1 = "off";
            setColor(state1,state2);
            doAction("turnOffFirst", {});
        }
    }else{
        if (state2 == "off") {
            state2 = "on";
            setColor(state1,state2);
            doAction("turnOnSecond",{})
        } else {
            state2 = "off";
            setColor(state1,state2);
            doAction("turnOffSecond", {});
        }
    }
}


function doAction(action, para) {
    console.log("action", action);
    console.log("para", para);
    clearTimeout(outID);
    window.AppJsBridge.service.deviceService.doAction({
        "sn": getCurrentDeviceSn(),
        "deviceClass": "gdkesDoubleWallSwitch",
        "action": action,
        "parameters": para,
        "success": function (data) {
            console.log("doaction success", data);
            outID =setTimeout(loadpage,5000);
        },
        "error": function (data) {
        }
    });
}

function iosCallback(colorParam){
    var color = JSON.parse(colorParam);
    primaryColor = color.colorPrimary;
    minorColor = color.colorPrimary2;
}

$(document).ready(function () {
    var sUserAgent = navigator.userAgent.toLowerCase();
    if (sUserAgent.indexOf('android') > -1) {
        //android
        //android
        //var color = JSON.parse(window.szsbay.getColorConfig());
        // primaryColor = color.colorPrimary;
        // minorColor = color.colorPrimary2;
        primaryColor = "blue";
    } else if (sUserAgent.indexOf('iphone') > -1 || sUserAgent.indexOf('ipad') > -1) {
        //ios
        window.szsbay.getColorConfig();
    } else {
        //pc
    }
    window.AppJsBridge.service.localeService.getResource({
        "success": function (data) {
            resource = data;
            initPage();
            loadpage();
        },
        "error": function (data) {
        }
    });
})


$(function () {
    $("#btn1").click(function () {
        $(".changeNameDiv").css("display", "block");
        $(".inputName").attr("value",name1);
        btnClick=1;
    })

    $("#btn2").click(function () {
        $(".changeNameDiv").css("display", "block");
        $(".inputName").attr("value",name2);
        btnClick=2;
    })

    $(".ui-block-a").click(function () {
        $(".changeNameDiv").css("display", "none");

    })

    $(".ui-block-b").click(function () {
        if($(".inputName").val()=="" || $(".inputName").val()==null){
            return;
        }
        $(".changeNameDiv").css("display", "none");
        var par=null;
        if(btnClick==1){
            par={"scene1":$(".inputName").val()};
            $("#btn1").html($(".inputName").val());
            doAction("setSceneName",par);
        }else{
            par={"scene2":$(".inputName").val()};
            $("#btn2").html($(".inputName").val());
            doAction("setSceneName2",par);
        }
    })

})


