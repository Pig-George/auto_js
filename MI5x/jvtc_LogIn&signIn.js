const succeed_png = '/storage/emulated/0/MIUI/Gallery/cloud/owner/log/succeed.png';
const sendLog_png = '/storage/emulated/0/MIUI/Gallery/cloud/owner/log/sendLog.png';
mian();

/*******************开始函数*********************/
function mian() {
    shell("am force-stop com.supwisdom.jvtc", true);
    sleep(500);
    app.launch("com.supwisdom.jvtc");
    text("防疫打卡").className("android.view.View").findOne().parent().click();
    var target = text("请打开位置信息").findOne().parent();
    sleep(1500);
    getScreenCapturePower();
    do {
        sleep(500);
        target.child(1).click();
        var img = images.captureScreen();
    } while (img.pixel(1060, 240) != -14560392); //等待载入页面
    sleep(1500);
    text("").findOne().click();
    sleep(2000);
    target = className("android.webkit.WebView").findOne().child(0).child(38);
    if (target.child(0).text() == "提交打卡") {
        target.click();
        sleep(500);
        text("确定").findOne().click();
    }
    var is_succeed = true;
    {
        let count = 50;
        while(images.pixel(images.captureScreen(), 100, 1900) != -279288) {
            sleep(200);
            if(count-- == 0) {
                is_succeed = false;
                break;
            }
        }
    }
    if (is_succeed) {
        images.captureScreen(succeed_png);
        log(1);
        sendLog(1, false);
    } else sendLog("打卡失败请手动打卡！", true);
    sleep(3000);
    shell("am force-stop com.supwisdom.jvtc", true);
    exit();
}

/********************获取截图权限接口********************/
//截图线程：
var therd_ScreenCap;

function getScreenCapture() {
    therd_ScreenCap = threads.start(function() {
        packageName('com.android.systemui').id('android:id/button1').text('立即开始').findOne().click();
    })
    return requestScreenCapture();
}

var is_getsScreenCapture = false;

function getScreenCapturePower() {
    if (!is_getsScreenCapture && !getScreenCapture()) {
        events.broadcast.emit("sendLog", 'ZFB', '请求截图失败', true, 1);
        exit();
    } else {
        is_getsScreenCapture = true;
        if (therd_ScreenCap.isAlive()) therd_ScreenCap.shutDownAll();
    }
}


/*******************发送log函数*********************/

function sendLog(name, is_exit) {
    events.broadcast.emit("sendLog", 'ZFB', name, is_exit); //ZFB 字符串是由于之前未考虑到会参与其他打卡，现在修改过于麻烦，暂时只能沿用先前的规则
    if (is_exit) {
        getScreenCapturePower();
        captureScreen(sendLog_png);
        sleep(10000);
        exit();
    }
}