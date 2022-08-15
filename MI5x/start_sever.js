
//---------------------------- 下方是发送请求处理代码 ----------------------------

//启动发送脚本接口
function sendLog() {
    var e = engines.execScriptFile('./sendLog.js');
    sleep(600);
    return e;
}

//普通发送方式
function Common(name, is_Nwin, sendObj) {
    // var e = engines.execScriptFile('./sendLog.js');
    // sleep(600);
    sendLog().getEngine().emit("key", name, is_Nwin, 1, sendObj);
}

//支付宝打卡特例发送方式
var count = 0; //支付宝打卡尝试次数变量
function Exception(name, is_Nwin) {
    if (name == 1) {
        console.info('被确认签到成功');
        // var e = engines.execScriptFile('./sendLog.js');
        // sleep(600);

        //这里随带了需要驾考提示信息， 这里提醒便于维护
        sendLog().getEngine().emit("key", new Date().toLocaleDateString() + '签到成功！' + '\n' + '下次签到时间为：' + next_t.toLocaleString() + "\n\n此外，请在10:00之前设定驾考所要预约的课时！！！\n格式：grab_num:第几节课", false, 2);
    }
    if (is_Nwin) {
        // new_engine.forceStop();
        count++;
        // console.info('支付宝打卡失败！正在尝试第' + count + '次打卡');
        console.info('慧通九职打卡失败！正在尝试第' + count + '次打卡');
        if (count < 3) {
            sleep(9000);
            // shell('am force-stop com.eg.android.AlipayGphone', true);
            shell('am force-stop com.supwisdom.jvtc');
            sleep(1000);
            // new_engine = engines.execScriptFile('./LogIn.js');
            new_engine = engines.execScriptFile('./jvtc_LogIn&signIn.js');

            //这里随带了需要驾考提示信息， 这里提醒便于维护
        } else sendLog().getEngine().emit("key", new Date().toLocaleDateString() + '\n' + '签到异常，未完成签到，请手动签到。' + '\n' + name + "\n\n此外，请在10:00之前设定驾考所要预约的课时！！！\n格式：grab_num:第几节课", true, 2);
    } else log(name);
}

//带图发送方式
function Img_text(name, is_Nwin, sendObj) {
    sendLog().getEngine().emit("key", name, is_Nwin, 2, sendObj);
}




// ---------------------------- 下方是监听代码 ----------------------------




//自定义发送类型下方监听sendLog事件函数的 switch 语句中添加选择   执行函数写在上方
//一般发送 classname ： Common  带图发送用 classname ：Img-text
events.broadcast.on("sendLog", function(classname, name, is_Nwin, sendObj) {
    switch (classname) {
        case ('ZFB'):
            ZFB_exception(name, is_Nwin);
            break;
        case ('Common'):
            Common(name, is_Nwin, sendObj);
            break;
        case ('Img-text'):
            Img_text(name, is_Nwin, sendObj);
            break;
        default:
            Common(classname + "！ start_sever.js中发送接口选择错误！" + '\n' + name, is_Nwin, sendObj);
    }
});

events.broadcast.on("tell_server", function(data) {
    switch(data) {
        case('down_led_fail') : 
    }
})

//监听通知栏消息
events.observeNotification();
events.onNotification(function(notification) {
    try {
        var mode = notification.text.substr(0, 5);
        switch (mode) {
            case ("shell"):
                shell_fun(notification);
                break;
            case ("grad_"):
                write_jiakaofile_num(notification);
                break;
            default:
                ;
        }
    } catch (e) {}

});



// ----------------------------下方是服务代码！！！(切记每个需要操作屏幕的服务需要异步执行)-----------------------------------


//后台shell操作函数，将shell完的结果返回到http_log文件夹下的index.html文件中  通过8206端口访问http服务可得到每隔5s更新的返回结果
function shell_fun(notification) {
    var text = notification.text;
    text = text.substr(6);
    if (text.indexOf('clear') == 0) {
        if (text.lastIndexOf("root_password:password") != -1) change_index_file('');
        else change_index_file('<p id="n">' + new Date().toLocaleString() + '-' + notification.title.replace(/\(([0-9])+条新消息\)/g, '') + '：<br>' + '你没有权限执行该命令！</p>');
        return;
    }
    if ((text.indexOf("reboot") != -1 || text.indexOf("shoudown") != -1 || text.indexOf("poweroff") != -1) && text.lastIndexOf("root_password:password") == -1) {
        change_index_file('<p id="n">' + new Date().toLocaleString() + '-' + notification.title.replace(/\(([0-9])+条新消息\)/g, '') + '：<br>' + '你没有权限执行该命令！</p>');
        return;
    }
    if (text.indexOf("top") != -1 || text.indexOf("su ") != -1) {
        change_index_file('<p id="n">' + new Date().toLocaleString() + '-' + notification.title.replace(/\(([0-9])+条新消息\)/g, '') + '：<br>' + ' 该命令在本脚本无法执行！</p>');
        return;
    }

    // log(1);
    if (text.lastIndexOf("root_password:password") != -1) var sh = shell(text.substring(0, text.lastIndexOf("root_password:password") - 1), true);
    else var sh = shell(text.replace(/\sroot_password:.*/, ""), false);
    if (sh.error == '') sh = '<p id="y">' + new Date().toLocaleString() + '-' + notification.title.replace(/\(([0-9])+条新消息\)/g, '') + '：<br>' + sh.result.replace(/\n/g, "<br>");
    else sh = '<p id="n">' + new Date().toLocaleString() + '-' + notification.title.replace(/\(([0-9])+条新消息\)/g, '') + '：<br>' + sh.error.replace(/\n/g, "<br>");
    sh += '</p>';
    change_index_file(sh);
}


//修改http_log/index.html文件接口
function change_index_file(text) {
    var fstr = files.read("./http_log/index.html");
    if (fstr.length > 100000 || text == '') fstr = fstr.replace(/<p(\n|.)*/gm, ""); //清理日志
    else fstr = fstr.substr(0, fstr.lastIndexOf("</body>"));
    if (text != '') fstr += text;
    files.write("./http_log/index.html", fstr + "</body></html>");
}


//修改驾考课时文件接口：
function write_jiakaofile_num(notification) {
    try {
        var text = notification.text.substr(9);
        var data = new Date();
        if ((text = parseInt(text)) && data.getDay != 6 && text <= (data.getDay ? 7 : 11)) {
            files.write("./jiakao/jiakao_num.txt", text);
        }
    } catch (e) {};
}


//myLed桉时关闭接口：
function down_led() {
    if(count > 0) {

    }
    engines.execScriptFile('./downLed.js');
    count++;
}


//解锁手机接口：
function unlock() {
    engines.execScriptFile('./unlock.js');
    //每次解锁后都重置count
    count = 0; //因为每次解锁都是某种服务开始第一次试运行，所以恰好在解锁后重置count
    sleep(1500);
}

//获取下一天7 - 9:30 点内的随机时间接口
//9:30 - 10:30 被抢练车资格服务占用

function getRand_time() {
    var next_time = new Date();
    next_time.setDate(next_time.getDate() + 1);
    next_time.setHours(random(7, 9));
    next_time.setMinutes(random(0, 40));
    next_time.setSeconds(random(0, 59));
    return next_time;
}

//获取下一指定时间 (只指定时间，不能指定日期)
function get_assginTime(h, m, s) {
    if (m === undefined) m = 0;
    if (s === undefined) s = 0;
    let next_t = new Date();
    next_t.setHours(h);
    next_t.setMinutes(m);
    next_t.setSeconds(s);
    if (next_t - new Date() < 0) next_t.setDate(next_t.getDate() + 1);
    return next_t;
}

var next_t;
var new_engine;

//支付宝打卡定时服务    支付宝打卡服务已服务到期
// var ZFB_signIn = threads.start(function() {
//     //定时器：
//     while (1) {
//         next_t = getRand_time();
//         log('下一次打卡时间为：' + next_t.toLocaleString());
//         sleep(next_t - new Date());
//         unlock();
//         new_engine = engines.execScriptFile('./LogIn.js');
//     }
// });



//支付宝打卡定时服务 
// var jvtc_signIn = threads.start(function() {
//     while (1) {
//         next_t = getRand_time();
//         log('下一次打卡时间为：' + next_t.toLocaleString());
//         sleep(next_t - new Date());
//         unlock();
//         new_engine = engines.execScriptFile('./jvtc_LogIn&signIn.js');
//     }
// })


//米金签到定时服务
var Mi_shop_signIn = threads.start(function() {
    while (1) {
        sleep(get_assginTime(12) - new Date());
        unlock();
        engines.execScriptFile('./Mi_shop_signIn.js');
    }
});

//预约练车资格定时服务
// var jiakao = threads.start(function() {
//     while (1) {
//         sleep(get_assginTime(9, 56) - new Date()); //提前准备好页面
//         if (parseInt(files.read("./jiakao/jiakao_num.txt"))) {
//             unlock();
//             engines.execScriptFile('./jiakao.js');
//         }
//     }
// })