var resource = null;
var state1 = null;
var name1 = null;
var outID = null;
var status = null;
var primaryColor = null;//主色
var minorColor = null;//次色
var color=null;
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
            if (res.hasOwnProperty("gdkesSingleWallSwitch")) {
                state1 = res.gdkesSingleWallSwitch.state1;
                name1 = res.gdkesSingleWallSwitch.scene1;
                status = res.basic.status;
                $("#uiTitle").text(res.basic.name);
            }
            if (name1 == "" || name1 == null) {
                $("#btn1").html(getResource()["BUTTON_ONE"]);
            }else{
                $("#btn1").html(name1);
            }
            if (res == null || res.basic == null || status == null || status == "offline") {
                $(".status").text(getResource().OFFLINE);
            } else {
                $(".status").text(getResource().ONLINE);
                if (res.gdkesSingleWallSwitch == null) {
                    $(".status").text(getResource().OFFLINE);
                    // return;
                }
            }
            setColor(state1);
        },
        "error": function (res) {
        }
    })
}


function setColor(key1) {
    clearTimeout(outID);
    if (status == "offline") {
        $(".offLine").css("display", "block");
        $(".back_img_light_small").css("background-color", "#cccccc");
        $(".back_img_light").css("background-color", "#cccccc");
        $(".status").css("color", "#cccccc");
    } else {
        $(".offLine").css("display", "none");
        $(".back_img_light_small").css("background-color", primaryColor);
        $(".status").css("color", primaryColor);
        if (key1 == "on") {
            $(".back_img_light").css("background-color", primaryColor);
        } else {
            $(".back_img_light").css("background-color", "#cccccc");
        }
    }
    outID=setTimeout(loadpage, 5000);
}

function changState(num) {
    clearTimeout(outID);
    if (num == "one") {
        console.log("state1", state1);
        if (state1 == "off") {
            state1 = "on";
            state11 = "on";
            setColor(state1);
            doAction("turnOnFirst", {})
        } else {
            state1 = "off";
            state11 = "off";
            setColor(state1);
            doAction("turnOffFirst", {});
        }
    }
}


function doAction(action, para) {
    console.log("action", action);
    console.log("para", para);
    clearTimeout(outID);
    window.AppJsBridge.service.deviceService.doAction({
        "sn": getCurrentDeviceSn(),
        "deviceClass": "gdkesSingleWallSwitch",
        "action": action,
        "parameters": para,
        "success": function (data) {
            console.log("doaction success", data);
            outID = setTimeout(loadpage, 5000);
        },
        "error": function (data) {
        }
    });
}

function iosCallback(colorParam){
     color = JSON.parse(colorParam);

}

$(document).ready(function () {
    var sUserAgent = navigator.userAgent.toLowerCase();
    if (sUserAgent.indexOf('android') > -1) {
        //android
         color = window.szsbay.getColorConfig();
        //primaryColor = "blue";


    } else if (sUserAgent.indexOf('iphone') > -1 || sUserAgent.indexOf('ipad') > -1) {
        //ios
        window.szsbay.getColorConfig();
    } else {
        //pc
    }
    console.log(color);
    alert(color);
    primaryColor = color.colorPrimary;
    console.log(primaryColor);
    minorColor = color.colorPrimary2;
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
        $(".inputName").attr("value", name1);
    })

    $(".ui-block-a").click(function () {
        $(".changeNameDiv").css("display", "none");

    })

    $(".ui-block-b").click(function () {
        if ($(".inputName").val() == "" || $(".inputName").val() == null) {
            return;
        }
        $(".changeNameDiv").css("display", "none");
        $("#btn1").html($(".inputName").val());
        doAction("setSceneName", {"scene1": $(".inputName").val()});

    })

})
