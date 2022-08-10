var key = ''; //事件内容
var Nwin = 0; //是否为成功的事件
var sendMode = 0; //发送模式
var sendObj = '3165483442'; //发送对象

//name:发送内容(不可省略)   is_Nwin:是否不成功(不可省略)  send_Mode:发送模式(不可省略)  send_obj:发送对象(可不指定 默认为3165483442)
events.on("key", function(name, is_Nwin, send_Mode, send_obj) {
    key = name;
    Nwin = is_Nwin;
    sendMode = send_Mode;
    if (send_obj != 'undefined' && send_obj != undefined && send_obj != '') sendObj = send_obj;
});

//方法一：只发送文本
function sendText() {
    app.launchApp('QQ');
    var target = desc('搜索').id('com.tencent.mobileqq:id/et_search_keyword').findOne(4000);
    var i = 0;
    while (!target) {
        back();
        target = desc('搜索').id('com.tencent.mobileqq:id/et_search_keyword').findOne(2000);
        i++;
        if (i > 3) {
            home();
            key = 'QQ界面异常！' + '\n' + key;
            Nwin = 0;
            sendPictureAndText();
            return;
        }
    }
    target.click();
    sleep(600);
    setText(sendObj);
    className('android.widget.LinearLayout').drawingOrder(1).clickable(true).findOne().click();
    target = id('com.tencent.mobileqq:id/input').clickable(true).findOne();
    target.setText(key);
    className('android.widget.Button').id('com.tencent.mobileqq:id/fun_btn').text('发送').findOne().click();
}

//方法二：发送截图和文本
function sendPictureAndText() {
    shell('am force-stop com.miui.gallery', true);
    sleep(2000);
    app.launchApp('相册');
    sleep(500);
    var a = className('android.widget.FrameLayout').id('com.miui.gallery:id/home_page_search_bar_container').findOne().bounds();
    click(a.centerX(), a.centerY());
    KeyCode(40);
    text('log').findOne();
    click('log');
    if (Nwin) a = className('android.widget.RelativeLayout').drawingOrder(6).longClickable(true).findOne().bounds();
    else a = className('android.widget.RelativeLayout').drawingOrder(5).longClickable(true).findOne().bounds();
    click(a.centerX(), a.centerY());
    className('android.widget.Button').text('发送').click();
    sleep(1000);
    className('android.widget.TextView').id('com.miui.gallery:id/chooser_text').text('QQ').findOne().parent().click();
    id('com.tencent.mobileqq:id/ik5').text('搜索').findOne().click();
    id('com.tencent.mobileqq:id/ik5').text('搜索').findOne().setText(sendObj);
    className('android.widget.RelativeLayout').depth(8).drawingOrder(1).clickable(true).findOne().click();
    a = text('输入留言').findOne();
    a.setText(key);
    className('android.widget.TextView').id('com.tencent.mobileqq:id/dialogRightBtn').text('发送').findOne().click();
    sleep(4000);
    home();
    shell('am force-stop com.miui.gallery', true);
}




//sendLog脚本主线程
var thread = threads.start(function() {
    sleep(2000);
    switch (sendMode) {
        //QQ消息方式发送 (脚本截屏QQ相册内容不更新,无法发送截图)
        case 1:
            sendText();
            break;
            //相册分享方式发送   当前稳定(发送截图用此方法)
        case 2:
            sendPictureAndText();
            break;
        default:
            console.error('选择发送方式出错！');
    }
    home();
    exit();
})


//如果线程在90s后都还在运行，则将线程杀死
setTimeout(function() {
    if (thread.isAlive())
        thread.interrupt();
    console.error('sendLog脚本运行超时！');
}, 1000 * 90);