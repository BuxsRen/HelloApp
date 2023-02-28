import {
    findNodeHandle,
    UIManager
} from 'react-native';

// 获取组件高度
export const layout = (ref) => {
    const handle = findNodeHandle(ref);
    return new Promise((resolve) => {
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
            resolve({
                width,
                height,
            });
        });
    });
}

// 计算年龄
export const getAge = (birthday) => {
    var birthDayTime = new Date(birthday*1000).getTime();
    var nowTime = new Date().getTime();
    return Math.ceil((nowTime-birthDayTime)/31536000000);
}

//** 距今时间 时间或时间戳 type 0 13位时间戳 1 时间 toTime('2018-12-18 15:18:34',1) toTime('1545117514000')
export const ToTime = (dateTimeStamp,type=0) => {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24;
    let month = day * 30;
    let result='',sTime;
    if(type === 1){//把时间转为时间戳
        dateTimeStamp = dateTimeStamp.replace(/\-/g, "/");
        sTime = new Date(dateTimeStamp).getTime();
    }else
        sTime = dateTimeStamp;
    let now = new Date().getTime();//获取当前时间的时间戳
    let diffValue = now - sTime;
    if(diffValue < 0){
        result = "结束日期不能小于开始日期！";
    }
    let monthC = diffValue/month;
    let weekC = diffValue/(7*day);
    let dayC = diffValue/day;
    let hourC = diffValue/hour;
    let minC = diffValue/minute;
    if(monthC>=1){
        result = parseInt(monthC) + " 个月"
    }
    else if(weekC>=1){
        result = parseInt(weekC) + " 周"
    }
    else if(dayC>=1){
        result = parseInt(dayC) +" 天"
    }
    else if(hourC>=1){
        result = parseInt(hourC) +" 小时"
    }
    else if(minC>=1){
        result = parseInt(minC) +" 分钟"
    }else{
        result =  parseInt((now-dateTimeStamp)/1000%60)+' 秒'
    }
    return result
}

//** 时间戳格式化 (164xxxxx,fmt)
export const timeToStr = (time,fmt='yyyy-mm-dd hh:ii:ss') => {
    Date.prototype.format = function (fmt) {
        let o = {
            "m+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "i+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    time = new Date(time*1000);
    return time.format(fmt);//格式化时间
}