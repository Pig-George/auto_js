//显示坐标位置工具


var window = floaty.rawWindow(
    <vertical id="front" bg="#7fffffff">
        <img id="target" w="50px" h="50px" radius="25px" borderColor="#ff0000" borderWidth="7px" src="file://./img/test.png" />
    </vertical>
);
window.setSize(-1, -1);
window.setTouchable(false); 

/**************x,y输入：单位px****************/
x = 100;             //x坐标
y = 1900;             //y坐标

t = 5000;               //显示时间 ms
x = x - 25 + "px";
y = y - 25 + "px";
display(x, y);
/********************************************/

function display(x, y) {
    ui.run(()=>{    
        window.front.attr("paddingLeft", x);
        window.front.attr("paddingTop", y);
    });
}



setInterval(()=> {
    exit();
}, t);