//启动发送脚本接口
function sendLog() {
    var e = engines.execScriptFile('./sendLog.js');
    sleep(600);
    return e;
}

events.broadcast.on("error", function(name, sendMode) {
    sendLog().getEngine().emit("key", name, true, sendMode);
});
//内存占用率悬浮窗：会导致 autojs 软件本身卡顿
//engines.execScriptFile('./ui/RAM_ui.js');

//服务脚本：
engines.execScriptFile('./start_sever.js');


//保证main脚本不死:
threads.start(function() {
    sleep(new Date().getTime());
})