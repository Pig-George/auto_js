"ui";
ui.layout(
    <vertical bg="#dddddd">
        <vertical h="*" w="*" gravity="center" >
            <list id="list" w="auto" layout_gravity="center">
                <vertical w="*" gravity="center" padding="0 15">
                    <text w="auto" padding="20 10" textColor="#ffffff" textSize="50px"  textStyle="bold" text="{{this.text}}" foreground="?selectableItemBackground" bg="{{this.bg}}" />
                </vertical>
            </list>
            <vertical h="auto" w="auto" padding="10" >
                <text text="亮    度：" textColor="#252527" w="auto" textStyle="bold"/>
                <horizontal w="auto" padding="0 10" layout_gravity="right">
                    <horizontal w="48" h="auto" gravity="right">
                        <text textColor="#02a9f7" w="auto" id="BR_text" />
                    </horizontal>
                    <seekbar id="BR_SK" max="255" w="220"/>
                </horizontal>
                <text text="人体感应超时时间：" textColor="#252527" w="auto"  textStyle="bold"/>
                <horizontal w="auto" padding="0 10" layout_gravity="right">
                    <horizontal w="48" h="auto" gravity="right">
                        <text textColor="#02a9f7" w="auto" id="human_outTime_text"/>
                    </horizontal>
                    <seekbar id="human_outTime_SK" max="30" w="220"/>
                </horizontal>
            </vertical>
        </vertical>
    </vertical>
);

ui.statusBarColor("#dddddd");       //设置通知栏颜色

var url = "http://192.168.3.50/app";
var myLed_url = "http://192.168.3.65/";


//206LED
var Led = {
    front_led : false,
    end_led : false,
    update_led_state : function () {
        let now_ledState = http.get(url + "?dir=0").body.json();
        if(this.front_led == now_ledState.front_state && this.end_led == now_ledState.end_state) return;
        else {
            this.front_led = now_ledState.front_state;
            this.end_led = now_ledState.end_state;
        }
        ui.post(update_show);
    },
    front_switch : function() {
        this.front_led = http.get(url + "?dir=1").body.json().led_state;
        ui.post(update_show);
    },
    end_switch : function() {
        this.end_led = http.get(url + "?dir=2").body.json().led_state;
        ui.post(update_show);
    },
    all_switch : function() {
        this.front_led = this.end_led = http.get(url + "?dir=3").body.json().led_state;
        ui.post(update_show);
    }
}



//自己的LED
var My_Led = {
    led_state : false,
    led_BR : 0,
    human_flag : true,
    led_outTime : 36000,
    getData : function() {
        var data = http.get(myLed_url + "getdata").body.json();
        this.led_state = data.led_state;
        this.led_BR = data.led_BR;
        this.human_flag = data.human_flag;
        this.led_outTime = data.human_outTime;
        ui.post(update_show);
    },

    //mode : 1 简单开关   2 自定调节亮度
    //BR : 值
    setData : function(mode, BR) {
        http.get(myLed_url + "setdata?mode=" + mode + "&BR=" + BR);
        if(mode != 2) this.getData();
    },
    setOutTime : function(timer) {
        http.get(myLed_url + "setOutTime?out_time=" + timer);
    }
}


//列表事件实时响应线程
var flag = -2;

threads.start(function () {
    while(1) {
        try {
            switch(flag) {
                case(-2):       //ui初始化
                try{
                    Led.update_led_state();
                } catch (e) {
                    toast("网络异常！请检查206_led是否断电或者是否和你在同一局域网！");
                }
                try {
                    My_Led.getData();
                } catch (e) {
                    toast("网络异常！请检查My_led是否断电或者是否和你在同一局域网！");
                }
                    ui.post(init);
                    flag = -1;
                    break;
                case(0):
                    Led.front_switch();flag = -1; break;
                case(1):
                    Led.end_switch();flag = -1;break;
                case(2):
                    Led.all_switch();flag = -1;break;
                case(3):
                    My_Led.setData(1, My_Led.led_state?0:255);flag = -1;break;
                case(4):
                    My_Led.setData(1, -1);flag = -1;break;
                default:;
            }     
        } catch (e) { 
            toast("网络异常！请检查设备是否断电或者是否和你在同一局域网！");
            flag = -1;
        }
    }
})

//更新控键函数
function update_show() {
    ui.list.setDataSource([
                            {text: Led.front_led?"关前灯":"开前灯", bg: "#20afef"},
                            {text: Led.end_led?"关后灯":"开后灯", bg: "#20afef"}, 
                            {text: (Led.front_led^Led.end_led||Led.front_led)?"全关":"全开", bg: "#20afef"},
                            {text: My_Led.led_state?"关灯":"开灯", bg : "#1469e1"},
                            {text: My_Led.human_flag?"关闭人体感应":"开启人体感应", bg : "#1469e1"}
                        ]);
    init();
}

//ui初始化函数
function init() {
    let num = parseInt(My_Led.led_BR / 255 * 100);
    ui.BR_text.setText(num + " %");
    ui.BR_SK.setProgress(My_Led.led_BR);
    num = My_Led.led_outTime / 60000;
    ui.human_outTime_text.setText(num + " min");
    ui.human_outTime_SK.setProgress(num);
}





//ui事件：
var last_time = 0;

ui.list.on("item_click", function(item, i) {
    let now_time = new Date().getTime();
    if((now_time - last_time) < 1000) {
        toast("请不要频繁点击！");
        return;
    }
    last_time = now_time;
    flag = i;
})

var next_BR;            //用户设置的亮度
ui.BR_SK.on("touch", ()=>{
    next_BR = ui.BR_SK.getProgress();
    SK_flag = true;
    ui.BR_text.setText(parseInt(next_BR / 255 * 100) + " %");
})

// ui.BR_SK.on("bulr")

var next_human_outTime;      //用户设置的人体感应超时时间
ui.human_outTime_SK.on("touch", ()=>{
    next_human_outTime = ui.human_outTime_SK.getProgress();
    outTime_flag = true;
    ui.human_outTime_text.setText(next_human_outTime + " min");
});




var SK_flag = false;
var outTime_flag = false
threads.start(function() {
    while(1) {
        if(SK_flag) {
            My_Led.setData(2, parseInt(next_BR));
            My_Led.led_BR = next_BR;
            My_Led.human_flag = false;
            SK_flag = false;
        }
        if(outTime_flag) {
            My_Led.setOutTime(next_human_outTime * 60);
            My_Led.led_outTime = next_human_outTime * 60;
            outTime_flag = false;
        }
        sleep(2);
    }
})