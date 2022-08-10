/*************失败退出微信页面函数************/
function exit_wv() {
    while (className("android.widget.RelativeLayout").desc("搜索").findOne(1000) == null) {
        back();
    }
    sleep(2000);
    exit();
}


/*************等待答题窗口出现函数************/
var pixels = [
    [300, 450],
    [780, 450],
    [300, 960],
    [540, 960],
    [780, 960],
    [300, 1470],
    [780, 1470]
]; //所要取色的点
var colors_data = [];
colors_data.length = pixels.length;
var request_Scr = true;

function wait_Exam() {
    if (request_Scr) {
        requestScreenCapture();
        request_Scr = false;
    }
    var img = images.captureScreen();
    let flag = false;
    for (let i = 0; i < pixels.length; i++) {
        let color = images.pixel(img, pixels[i][0], pixels[i][1])
        if (colors_data[i] != color) {
            colors_data[i] = color;
            flag = true;
        }
    }
    return flag;
}


/*************获取答案部分************/
// var num_data = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十六", "十七", "十八", "十九", "二十", "二十一", "二十二", "二十三", "二十四", "二十五"];
// function get_newName_tool_1(name) {

// }


var get_newName_mode = 0;

function get_newName(name) {
    switch (get_newName_mode) {
        case (0):
            get_newName_mode++;
            return "青年大学习" + name + "答案";
            // case(1):
            //     return get_newName_tool_1(name);
        default:
            events.broadcast.emit("tell_server", true);
            exit_wv();
    }
}


var q_data = [
    [4],
    [4],
    [4],
    [4],
    [4],
    [4],
    [4],
    [4],
    [4]
]; //答案数组数据
function get_result(name) {
    let q_bank_url = "https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI4ODMyMTE5Ng==&action=getalbum&album_id=2298963615762464771&scene=173&from_msgid=2247613807https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzI4ODMyMTE5Ng==&action=getalbum&album_id=2298963615762464771&scene=173&from_msgid=2247613807&from_itemidx=2&count=3&nolastread=1#wechat_redirect&from_itemidx=2&count=3&nolastread=1#wechat_redirect";
    let str = http.get(q_bank_url).body.string();
    let dir = str.lastIndexOf(name);
    if (dir != -1) {
        str = str.substr(dir, 500);
    } else {
        return get_result(get_newName(name));
    }
    dir = str.indexOf("url: '") + 6;
    str = str.substr(dir, str.lastIndexOf("read_count") - dir);
    str = str.replace(/'.(\s)*/ig, "");
    str = http.get(str).body.string();
    str = str.substring(str.indexOf("视频内"), str.indexOf("</table>"));
    str = str.replace(/<(\S*?)[^>]*>.*?|<.*? \/>|&nbsp;|[\u4e00-\u9fa5]|:/ig, "");
    log(str);
    var q_flag = true;
    for (let i = 0; i < str.length; i++) {
        let k = [];
        q_flag = true;
        while (q_flag) {
            switch (str[i++]) {
                case ('A'):
                    k.push(1);
                    break;
                case ('B'):
                    k.push(2);
                    break;
                case ('C'):
                    k.push(3);
                    break;
                case ('D'):
                    k.push(4);
                    break;
                case ('E'):
                    k.push(5);
                    break;
                case ('F'):
                    k.push(6);
                    break;
                default:
                    q_flag = false;
                    i--;
            }
        }
        if (k.length) q_data.push(k);
    }
}


/*************答题函数************/
var q_dir = 0; //记录当前答案位置
function answer_q(target) {
    for (let i in q_data[q_dir]) {
        log(q_data[q_dir][i]);
        target.child(q_data[q_dir][i]).click();
        sleep(1000);
    }
    q_dir++;
}


/*************截图权限************/
var therd_ScreenCap = threads.start(function() {
    packageName('com.android.systemui').id('android:id/button1').text('立即开始').findOne().click();
})




app.launch("com.tencent.mm");
className("android.widget.RelativeLayout").desc("搜索").findOne().click();
sleep(1000);
className("android.widget.EditText").text("搜索").findOne().setText("江西共青团");
sleep(1000);
className("android.widget.ListView").id("com.tencent.mm:id/hf1").findOne().child(2).click();
text("网上团课").className("android.widget.TextView").findOne().parent().parent().click();
className("android.widget.TextView").text("青年大学习").findOne().click();
sleep(8000);
// get_result(get_newName(className("android.view.View").depth(22).findOne().text()));          //获取答案
className("android.widget.Image").depth(22).findOne().click();

var target;
var dir = 0;
var arr = ["高职专科院校团委", "九江职业技术学院团委", "信息工程学院团总支", "网络2003团支部"];

sleep(1000);
for (var i = 0; i < 5; i++) {
    if (i < 4) {
        target = className("android.view.View").depth(22).text("").findOne().child(dir).bounds();

        click(target.centerX(), target.centerY());
        className("android.widget.ListView").depth(24).findOne().children().forEach(e => {
            if (e.text() == arr[i]) e.click();
        });
    } else {
        sleep(500);
        className("android.view.View").depth(22).text("").findOne().child(dir).child(0).setText("203055690");
    }
    sleep(500);
    dir += 2;
}
className("android.widget.Image").text("right-btn").findOne().click();

// target = className("android.widget.Spinner").text("--请选择--").findOne().parent();
// target.child(2).click();
// sleep(1000);
// swipe(device.width / 2, device.height - 200, device.width / 2, device.height / 3, 300);
// text("江西省").findOne().click();
// className("android.widget.LinearLayout").id("com.tencent.mm:id/kl1").findOne();
// target.child(3).click();
// text("九江市").findOne().click();
// className("android.widget.LinearLayout").id("com.tencent.mm:id/kl1").findOne();
// target.child(4).click();
className("android.view.View").text("我来自江西省九江市").findOne();
sleep(2000);
className("android.view.View").text("我来自江西省九江市").findOne().parent().parent().child(3).click();

while (wait_Exam()) {
    sleep(1000);
};
log(1);

sleep(2000);
target = className("android.webkit.WebView").depth(18).findOne().child(0).child(0).child(1);
answer_q(target); //选项键  1 - 4 
for (let i = 0; i < 3; i++) {
    sleep(1500);
    target.child(6).click(); //确定键
}
sleep(2000);
className("android.webkit.WebView").depth(18).findOne().child(0).child(0).child(5).child(8).click(); //继续听讲键
sleep(1500);
while (wait_Exam()) {
    sleep(1000);
};
log(2);
sleep(1500);
// 课后习题部分：
className("android.webkit.WebView").depth(18).findOne().child(0).child(0).child(6).child(0).click(); //课后习题跳转

//target = className("android.webkit.WebView").depth(18).findOne().child(0).child(0).child(11);        //6 7 8 9 10 11
for (let i = 6; i < 12; i++) {
    sleep(1500);
    target = className("android.webkit.WebView").depth(18).findOne().child(0).child(0).child(i);
    answer_q(target) //选项键  1 - 4 
    sleep(1500);
    for (let j = 0; j < 3; j++) {
        target.child(q_data[q_dir - 1].length > 1 ? 9 : 6).click(); //确定键       多选是9 单选是6
        sleep(1000);
    }
}

sleep(1500);

className("android.widget.Button").id("com.tencent.mm:id/fz").findOne().click();