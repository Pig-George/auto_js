
if((!device.isScreenOn())||className('android.widget.FrameLayout').id('com.android.systemui:id/keyguard_clock_view').findOne(1000)) {
    device.wakeUp();
    swipe(0, 1000, device.width/3, 1000, 10);
    text('锁屏画报').findOne(2000).parent().click();
    // var passwd = [4,6];
    // for(var i in passwd) {
    //     text(5).findOne().parent().click();
    //     text(passwd[i]).findOne().parent().click();
    // }
}
