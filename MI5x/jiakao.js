const file_path = "./jiakao/jiakao_num.txt";
var num = parseInt(files.read(file_path));
if (!num) exit();

function get_time() {
    var next_time = new Date();
    next_time.setHours(10);
    next_time.setMinutes(0);
    next_time.setSeconds(0);
    next_time.setMilliseconds(0);
    return next_time;
}
//周日有 11节课    1 ~ 11
//除周六休息外其余时间有7节课   1 ~ 7

app.launch("com.handsgo.jiakao.android");
text("我的").findOne().parent().click();
sleep(800);
swipe(device.width / 2, device.height / 2, device.width / 2, device.height / 4, 200);
className("android.view.ViewGroup").id("com.handsgo.jiakao.android:id/item1").findOne().click();
id("tv_bottom").className("android.widget.TextView").text("可约课程").findOne().parent().click();
className("android.view.ViewGroup").drawingOrder(7).clickable(true).findOne().click();
className("android.widget.RelativeLayout").depth(12).drawingOrder(num).findOne().child(2).click();
className("android.widget.EditText").id("tv_name").findOne().click();
setText("何祥斌");
id("check_box").findOne().click();
var time = get_time();

while (new Date() < time) {}
while (1) {
    try {
        id("tv_sure").findOne(2000).click();
        sleep(50);
    } catch (e) { break; }
}

files.write(file_path, '0');

sleep(1500);
var str = '';
try {
    if (className("android.widget.RelativeLayout").depth(12).drawingOrder(num).findOne(3000).child(2).text() == "已预约") str = "已成功约到" + className("android.view.ViewGroup").depth(13).drawingOrder(7).findOne().child(0).text() + ' ' + className("android.widget.RelativeLayout").depth(12).drawingOrder(num).findOne().child(0).text() + "课程，请及时关注！";
    else str = "约课失败！！！";
} catch (e) {
    str = "约课失败！！！";
}

events.broadcast.emit("sendLog", 'Common', str, false);

shell('am force-stop com.handsgo.jiakao.android', true);