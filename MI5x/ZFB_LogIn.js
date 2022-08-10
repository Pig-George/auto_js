function getRand() {
    return random(500, 2000);
}

var therd_ScreenCap;

function getScreenCapture() {
    therd_ScreenCap = threads.start(function() {
        packageName('com.android.systemui').id('android:id/button1').text('立即开始').findOne().click();
    })
    return requestScreenCapture();
}

//获取截图权限接口：
var is_getsScreenCapture = false;

function getScreenCapturePower() {
    if (!is_getsScreenCapture && !getScreenCapture()) {
        events.broadcast.emit("sendLog", 'ZFB', '请求截图失败', true, 1);
        exit();
    } else {
        is_getsScreenCapture = true;
        if (therd_ScreenCap.isAlive()) therd_ScreenCap.interrupt();
    }
}


//异常广播接口：
function Exception(name, is_exit) {
    events.broadcast.emit("sendLog", 'ZFB', name, is_exit);
    if (is_exit) {
        getScreenCapturePower();
        captureScreen('/storage/emulated/0/MIUI/Gallery/cloud/owner/log/sendLog.png');
        sleep(10000);
        exit();
    }
}



function getPoint(color, region_x, region_y, region_w, region_h, thres, time_s) {
    getScreenCapturePower();
    var get_p = images.findColor(captureScreen(), color, {
        region: [region_x, region_y, region_w, region_h],
        threshold: thres
    });
    var i = 0;
    while (!get_p) {
        sleep(500);
        get_p = images.findColor(captureScreen(), color, {
            region: [region_x, region_y, region_w, region_h],
            threshold: thres
        });
        if (++i > time_s) {
            Exception('未找到颜色', false);
            break;
        }
    }
    return get_p;
}


//签到
function signIn() {
    var target = text('校园防疫').id('com.alipay.android.phone.openplatform:id/app_text').className('android.widget.TextView').findOne(2000);
    var i = 0;
    while (!target) {
        sleep(getRand());
        target = text('校园防疫').id('com.alipay.android.phone.openplatform:id/app_text').className('android.widget.TextView').findOne(3000);
        if (++i > 3) {
            Exception('目标未找到，签到失败！', true);
        }
    }
    target.parent().parent().click();
    sleep(getRand());
    target = className('android.widget.Button').text('确定').findOne(2000);
    if (target) {
        target.click();
        sleep(1000);
    }
    target = text('校园安全').className('android.view.View').findOne(2000);
    while (!target) {
        target = text('校园安全').className('android.view.View').findOne(2000);
        if (++i > 3) {
            Exception('目标未找到，签到失败！', true);
        }
    }
    target.parent().click();
    sleep(getRand());
    //#007aff
    var if_yes = getPoint('#007aff', 600, 1480, 200, 100, 0, 10);
    if (if_yes && className('android.widget.FrameLayout').desc('关闭').findOne(5000)) click(if_yes.x, if_yes.y);
    else Exception('#007aff 异常中断', false);
    //#ebf4fb 
    sleep(getRand());
    if_yes = getPoint('#ebf4fb', 138, 940, 40, 50, 4, 10);
    if (if_yes && className('android.widget.FrameLayout').desc('关闭').findOne(5000)) click(if_yes.x, if_yes.y);
    else Exception('#ebf4fb 异常中断', true);
    //#009afa 提交页面
    sleep(3000);
    if_yes = getPoint('#009afa', 450, 1620, 150, 110, 4, 10);
    if (if_yes && className('android.widget.FrameLayout').desc('关闭').findOne(5000)) click(if_yes.x, if_yes.y);
    else Exception('今日已签到', false);
    //#007aff 签到成功页面
    if_yes = getPoint('#007aff', 390, 1030, 300, 120, 0, 10);
    if (if_yes) {
        images.captureScreen('/storage/emulated/0/MIUI/Gallery/cloud/owner/log/succeed.png');
        var target = className('android.widget.FrameLayout').desc('关闭').findOne(5000);
        while (!target) {
            target = className('android.widget.FrameLayout').desc('关闭').findOne(5000);
            if (++i > 3) {
                Exception('目标未找到，返回支付宝页面失败！', true);
            }
        }
        target.click();
        sleep(getRand());
        shell('am force-stop com.eg.android.AlipayGphone', true);
        Exception('签到成功', false);
    } else {
        Exception('未找到签到成功页面，不能确保签到成功，建议手动查看一次！', true);
    }
}


//登录接口
function logIn() {
    sleep(getRand());

    var i = 0;
    if (!(id('com.ali.user.mobile.security.ui:id/userAccountImage').findOne(2000))) {
        var ok = packageNameContains('com.eg.android.AlipayGphone').text('好的').id('com.alipay.mobile.antui:id/ensure').findOne(2000);
        while (!ok) {
            ok = packageNameContains('com.eg.android.AlipayGphone').text('好的').id('com.alipay.mobile.antui:id/ensure').findOne(2000);
            if (++i > 3) {
                Exception('未找到确认被挤号控件', false);
                break;
            }
        }
        if (ok) ok.click();
        else {
            if (text('扫一扫').id('com.alipay.android.phone.openplatform:id/king_kong_text').className('android.widget.TextView').findOne(3000)) {
                Exception('确认已登录！', false);
                signIn();
                return;
            }
        }
    }
    sleep(getRand());
    var userHade_click = id('com.ali.user.mobile.security.ui:id/userAccountImage').findOne(2000);
    i = 0;
    while (!userHade_click) {
        userHade_click = id('com.ali.user.mobile.security.ui:id/userAccountImage').findOne(2000);
        if (++i > 3) {
            Exception('登录控件未找到，登录失败！', true);
        }
    }
    userHade_click.click();
    sleep(getRand());
    if (!(id('com.ali.user.mobile.security.ui:id/forget_password').text('忘记密码？').findOne(5000))) {
        var login_change = id('com.ali.user.mobile.security.ui:id/switchLoginMethodCenter').text('换个方式登录').findOne(2000);
        i = 0;
        while (!login_change) {
            login_change = id('com.ali.user.mobile.security.ui:id/switchLoginMethodCenter').text('换个方式登录').findOne(2000);
            if (++i > 3) {
                Exception('改变登录方式控件找到，登录失败！', true);
            }
        }
        login_change.click();
        sleep(getRand());
        var query_way = className('android.widget.TextView').text('密码登录').findOne().parent();
        i = 0;
        while (!query_way) {
            query_way = className('android.widget.TextView').text('密码登录').findOne().parent();
            if (++i > 3) {
                Exception('确定登录方式控件未找到，登录失败！', true);
            }
        }
        query_way.click();
        sleep(getRand());
    }
    if (files.exists('./.passwd.txt')) {
        var pad = files.read('./.passwd.txt');
    } else {
        Exception('文本获取失败，登录失败!！', true);
    }
    input(pad);
    var log_query = id('com.ali.user.mobile.security.ui:id/loginButton').enabled(true).findOne(2000);
    i = 0;
    while (!log_query) {
        log_query = id('com.ali.user.mobile.security.ui:id/loginButton').enabled(true).findOne(2000);
        if (++i > 3) {
            Exception('登录按钮控件未找到，登录失败！', true);
        }
    }
    log_query.click();

    sleep(getRand());

    var if_no_updata = id('com.alipay.mobile.accountauthbiz:id/update_cancel_tv').text('稍后再说').findOne(2000);
    while (!if_no_updata) {
        if_no_updata = id('com.alipay.mobile.accountauthbiz:id/update_cancel_tv').text('稍后再说').findOne(2000);
        if (++i > 3) {
            Exception('是否更新按钮控件未找到', false);
            break;
        }
    }
    if (if_no_updata) if_no_updata.click();
    signIn();
}

launchApp("支付宝");
logIn();