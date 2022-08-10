//显示当前内存占用率悬浮窗

var w = floaty.rawWindow(
    <vertical>
        <list id="list">
            <vertical>
                <text text="{{this.text}}" textColor="{{this.color}}" textSize="{{this.size}}"/>
            </vertical>
        </list>
    </vertical>
);

w.setTouchable(false);

var s, color;
w.list.attr("paddingLeft", 20 + "px");
if(device.model != "Mi 10 Pro") w.list.attr("paddingTop", 50 + "px");

while(1) {
    s = Math.floor((1 - device.getAvailMem() / device.getTotalMem()) * 10000) / 100;
    if(s < 70)  color = "green";
    else if(s < 80) color = "yellow";
    else color = "red";
    ui.run(function() {
        w.list.setDataSource([{text: "当前内存使用率：" + s + "%", color: color, size: "16"}]);
    })
    sleep(1000);
}


