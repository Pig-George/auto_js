// var therd_ScreenCap = threads.start(function() {
//     packageName('com.android.systemui').id('android:id/button1').text('立即开始').findOne().click();
// })

// sleep(500);
// if (!requestScreenCapture()) exit();
// var img = images.captureScreen();
// log(img.pixel(100, 1900) == -279288);


log(id('com.xiaomi.shop.plugin.discovery:id/mi_circle_like_view').findOne(10000));