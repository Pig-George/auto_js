//toast('aa');

// events.on("to", function(engine_main){

//     toastLog(engine_main);
// });

// setInterval(()=>{}, 1000);

//监听say事件

//保持脚本运行

// events.broadcast.emit("hello", "小明");
// //保持脚本运行
// setInterval(()=>{}, 1000);
// function Excepion(name, is_exit) {
//     events.broadcast.emit("excepion", name);
//     if(is_exit) exit();
// }

// var i=0;
// while(1){
//     i++;
// //     Excepion(i, false);
// //     sleep(1000);
// // }

// // var time = new Date();
// // time.setHours(10);
// // time.setMinutes(56);
// // log(time);

// function getRand_time() {
//     var next_time = new Date();
//     next_time.setDate(next_time.getDate()+1);
//     next_time.setMinutes(random(0, 59));
//     return next_time.setHours(random(5, 11));
// }

// log(getRand_time() - new Date().getTime());




// if(!device.isScreenOn()) {
//     device.wakeUpIfNeeded()
//     swipe(0, 1000, device.width/3, 1000, 10);
//     text('锁屏画报').findOne(2000).parent().click();
//     var passwd = [4,6];
//     for(var i in passwd) {
//         text(5).findOne().parent().click();
//         text(passwd[i]).findOne().parent().click();
//     }
// }


// log(className('android.widget.FrameLayout').id('com.android.systemui:id/keyguard_clock_view').findOne(1000));
// requestScreenCapture();
//log(packageName('com.android.systemui').id('android:id/button1').text('立即开始').findOne().click());




// log(id('com.xiaomi.shop.plugin.planet:id/total_mi_gold_num_tv').findOne().text());
// app.launch("com.xiaomi.shop");
// var target = className('android.widget.FrameLayout').drawingOrder(5).depth(8).findOne().bounds();
// click(target.centerX(), target.centerY());
// text('做任务得米金').id('com.xiaomi.shop.plugin.homepage:id/top_ad_cell_subtitle').findOne().parent().parent().parent().click(); 
// target = text('每日签到').id('com.xiaomi.shop.plugin.planet:id/mi_gold_desc_tv').findOne(5000);
// if(target) target.parent().parent().click();
// gesture(400, [device.width / 2, device.height - 300], [device.width / 2, device.height / 2 - 300]);
// target = className('android.view.ViewGroup').depth(10).drawingOrder(1).findOne().child(5);
// while(target.text() != '明天再来') {
//     target.click();
//     sleep(1000);
//     back();
//     target = className('android.view.ViewGroup').depth(10).drawingOrder(1).findOne().child(5);
// }
// home();



// function key_speak(name) {
//     // engines.execScriptFile('./sendLog.js');
//     // sleep(600);
//     // events.broadcast.emit("key", name, 1, 1);
//     var e = engines.execScriptFile('./sendLog.js');
//     sleep(600);
//     e.getEngine().emit("key", name, 0, 1);
// }



// key_speak('11');

// threads.start(function() {
//     sleep(new Date().getTime());
// });
// className('android.widget.TextView').id('com.tencent.mobileqq:id/dialogRightBtn').text('发送').findOne().click();


// var key ='1';


// function sendOneText() {
//     app.launchApp('QQ');
//     var target = desc('搜索').id('com.tencent.mobileqq:id/et_search_keyword').findOne(4000);
//     var i = 0;
//     while(!target) {
//         back();
//         target = desc('搜索').id('com.tencent.mobileqq:id/et_search_keyword').findOne(2000);
//         i++;
//         if(i > 3) {
//             events.broadcast.emit("error", 'QQ页面异常！', 2);
//             exit();
//         }
//     }
//     target.click();
//     sleep(500);
//     setText('逝淮');
//     className('android.widget.LinearLayout').drawingOrder(1).clickable(true).findOne().click();
//     target = id('com.tencent.mobileqq:id/input').clickable(true).findOne();
//     target.setText(key);
//     className('android.widget.Button').id('com.tencent.mobileqq:id/fun_btn').text('发送').findOne().click();
// }





// sendOneText();




// var next_t = new Date();
// next_t = new Date(next_t.getFullYear(), next_t.getMonth(), next_t.getDate()+1, 12,0,0);
// log(next_t);
// var get_http = http.get('https://mp.weixin.qq.com/mp/homepage?__biz=MzIzNTc4NzMzNA==&hid=1&sn=a812a6338c1462fa363a4dfabc8951a7&scene=18').body.string();
// get_http = get_http.substr(get_http.indexOf("第十二季第十四期"));
// var begin = get_http.indexOf('http://mp.weixin.qq.com/s');
// get_http = get_http.substr(begin, get_http.indexOf('","digest"') - begin);
// log(http.get(get_http).body.string());
// log(get_http.substr(0,target));


// https://mp.weixin.qq.com/mp/appmsgalbum?action=getalbum&__biz=Mzk0ODI3Mzc5Ng==&scene=1&album_id=2106155305549037572&count=3&from=singlemessage#wechat_redirect

var res = http.get("https://microserver4.jvtc.jx.cn/api/blade-signin/signinlog/getsignin", {
    headers: {
        //'Authorization' : 'Basic YXBwOmFwcF9zZWNyZXQ=',
        'Blade-Auth' : 'bearer eyJ0eXAiOiJKc29uV2ViVG9rZW4iLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJpc3N1c2VyIiwiYXVkIjoiYXVkaWVuY2UiLCJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJyb2xlX25hbWUiOiJzdHVkZW50IiwidXNlcl9pZCI6IjE0NjcwMTI1NDU3MzczMTAyMTAiLCJyb2xlX2lkIjoiMTEyMzU5ODgxNjczODY3NTIwNSIsInVzZXJfbmFtZSI6IjIwMzA1NTY5MCIsIm5pY2tfbmFtZSI6IuS9leelpeaWjCIsInRva2VuX3R5cGUiOiJhY2Nlc3NfdG9rZW4iLCJkZXB0X2lkIjoiMTEyMzU5ODgxNjczODY3NTIwMSIsImFjY291bnQiOiIyMDMwNTU2OTAiLCJjbGllbnRfaWQiOiJhcHAiLCJleHAiOjE2NTI2NjY4MjksIm5iZiI6MTY1MjY2MzIyOX0.M3SHV_AsLnts8LHikfZvL-T32tCQSuMhAxF1Ap2JLhw',
        //'Cookie' : 'JSESSIONID=nUys5Vbc5BFyn0k_Jogbc5MSGb6nfcXeSIMJNwxz'
    }
});
log(res.body.json().data);