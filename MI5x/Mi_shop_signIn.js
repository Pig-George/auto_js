threads.start(function() {
    shell('am force-stop com.xiaomi.shop', true);
    sleep(500);
    app.launch("com.xiaomi.shop");
    var target = className('android.widget.FrameLayout').drawingOrder(5).depth(8).findOne().bounds();
    click(target.centerX(), target.centerY());

    id('com.xiaomi.shop.plugin.homepage:id/top_ad_cell_subtitle').findOne().parent().parent().parent().click();
    target = text('每日签到').id('com.xiaomi.shop.plugin.planet:id/mi_gold_desc_tv').findOne(5000);
    if (target) target.parent().parent().click();
    gesture(400, [device.width / 2, device.height - 300], [device.width / 2, device.height / 2 - 300]);
    target = className('android.view.ViewGroup').clickable(false).enabled(true).depth(10).drawingOrder(1).findOne().child(5);
    var i = 1;
    while (target.text() != '明天再来') {
        let tmp = target.parent().child(1).text();
        target.click();
        sleep(2000);
        if(tmp == '米圈点赞奖励') {
            id('com.xiaomi.shop.plugin.discovery:id/mi_circle_like_view').findOne(10000).click();

        }
        
        //循环返回
        do {
            try {
                target = className('android.view.ViewGroup').clickable(false).enabled(true).depth(10).drawingOrder(1).findOne(2000).child(5);
            } catch (err) {
                target = 0;
                back();
                sleep(1000);
            }
        } while (!target);
    }
    var str = '当前米币数量为：' + id('com.xiaomi.shop.plugin.planet:id/total_mi_gold_num_tv').findOne().text() + '个';
    shell('am force-stop com.xiaomi.shop', true);

    home();
    events.broadcast.emit("sendLog", 'Common', str, false);
});