import * as React from "react";
import {BackHandler, DeviceEventEmitter, NativeModules, StatusBar, ToastAndroid, View} from 'react-native';
import WS from "./WebSocket";
import {PlayCall, PlayCallFailed, PlayCallTimeOut, PlayHangUp, PlayNotif, Stop} from '../utils/Play';
import {audio, close, open, play} from "./Udp";
import {useFocusEffect} from "@react-navigation/native";
import {get} from "../utils/Storage";
import {connect} from 'react-redux';
import {openAlert, openCall} from '../store/modules/dialog';
import config from '../config';
import RNExitApp from "react-native-exit-app";
const Utils = NativeModules.Utils
let Store,Timeout
global._statusBarHeight = StatusBar.currentHeight; // 状态栏高度

// 全局配置初始化
const Global = () => {
    global._socket = new WS(); // WebSocket
    global._play_notif = PlayNotif; // 消息提示音
    global._play_call = PlayCall; // 来电/呼叫音
    global._play_call_failed = PlayCallFailed; // 呼叫失败音
    global._play_call_timeout = PlayCallTimeOut; // 呼叫超时音
    global._play_hang_up = PlayHangUp; // 呼叫挂断音
    global._stop = Stop; // 停止声音
    global._isLogin = false // 是否重新登录
    global._audio = audio; //  udp 连接
    global._udp_play = play; // udp 关闭
    global._udp_open = open; //  udp 连接
    global._udp_close = close; // udp 关闭
    global._dialog_show = false // 窗口展示
    global._dialog_type = '' // 窗口展示
    global._permission = permission // 权限检查
    global._token = "" // 用户token
    global._user = {} // 用户信息
    global._chat_id = 0 // 聊天用户id，当前在和谁聊天
    global._setting = {
        tipsSound: true,// 消息提示音
        callSound: true, // 通话铃声
        enter: false, // 回车键发送消息
    }
    global._callConnect = callConnect // 建立通话连接
    global._callDisConnect = callDisConnect // 断开通话连接
    global._callTimeOut = callTimeOut // 呼叫超时
    global._callInTimeOut = callInTimeOut // 来电超时
    global._call_status = false // 通话状态，是否在通话
    global._call_toId = 0 // 我呼叫的对方id
    global._call_connect_status = false // 通话联通状态
    global._call_time = 0 // 通话时长,记录通话接通的开始时间戳
    global._page_name = "" // 当前页面名称
}

const GetAppInfo = () => {
    Utils.getVersionName().then(value=>{
        config.app.version = value
    })
    Utils.getVersionNumber().then(value=>{
        config.app.number = value
    })
    Utils.getAppName().then(value=>{
        config.app.title = value
    })
    Utils.getDeviceInfo().then(value=>{
        value = JSON.parse(value)
        config.app.manufacturer = value.manufacturer // 产商
        config.app.product = value.product // 机型
        config.app.release = value.release // 安卓版本
    })
}

// 读取设置
const GetSetting = () => {
    // 通知音
    get('setting_tipsSoun').then(val=>{
        global._setting.tipsSound = val == null ? true : JSON.parse(val)
    })

    // 通话铃声
    get('setting_callSound').then(val=>{
        global._setting.callSound = val == null ? true : JSON.parse(val)
    })

    // 回车键发送消息
    get('setting_enter').then(val=>{
        global._setting.enter = val == null ? false : JSON.parse(val)
    })
}

// 权限检查 ，成功事件，失败事件
const permission = async (success, failed) => {
    // 检查是否有录音权限
    if (await global._audio.checkPermission() !== 0) {
        setTimeout(()=>{
            success()
        },100)
        return
    }
    Store.dispatch(
        openAlert(
            '权限申请',
            '需要获得麦克风权限才能使用语音通话功能哦，请授予麦克风权限！',
            [{
                title: '我已知晓',
                onClick: () => {
                    global._audio.requestPermissions(); // 申请权限
                    setTimeout(() => {
                        failed()
                    },100)
                },
            }]
        )
    );
}

// 通话呼叫连接超时
const callTimeOut = () => {
    clearInterval(Timeout)
    global._call_time = parseInt(new Date().getTime()/1000)
    Timeout = setInterval(()=>{
        if (!global._call_status) { // 通话取消
            clearInterval(Timeout)
        }
        const now = parseInt(new Date().getTime()/1000)
        if (!global._call_connect_status) {
            if (now - global._call_time > 30) { // 通话长时间未响应
                clearInterval(Timeout)
                global._callDisConnect(0,false,'对方无应答')
                setTimeout(()=>{
                    global._play_call_failed()
                },100)
            }
        } else {
            clearInterval(Timeout)
        }
    },1000)
}

// 通话来电连接超时
const callInTimeOut = () => {
    clearInterval(Timeout)
    global._call_time = parseInt(new Date().getTime()/1000)
    Timeout = setInterval(()=>{
        if (!global._call_status) { // 通话取消
            clearInterval(Timeout)
        }
        const now = parseInt(new Date().getTime()/1000)
        if (global._call_connect_status) { // 已接听
            clearInterval(Timeout)
        } else {
            if (now - global._call_time > 30) { // 通话长时间未响应
                clearInterval(Timeout)
                global._callDisConnect(0,false,'长时间未接听')
                setTimeout(()=>{
                    global._play_call_timeout()
                },100)
            }
        }
    },1000)
}

//  通话连接,传入对方ID，是否是来电接听，否则就是拨号，来电需要传入对方昵称和头像
const callConnect = (toId,Dial = false,title,avatar) => {
    global._call_toId = toId
    global._call_status = true; //锁定通话
    global._stop() // 停止播放通话音
    clearInterval(global.callTime) // 清除通话超时计时
    if (Dial) { // 如果是来电方式
        global._socket.send({type: 'answer', toId: toId}); // 发送接听通知
        Store.dispatch(openCall(title, avatar, toId)); // 打开通话页面
    }
    Store.dispatch({type: 'dialog_text',text: "连接中..."})
    global._udp_open(); // 建立连接，并开始播放对方的音频
    global._audio.record(global._token, toId); // 录制音频 传入 token，和对方id
}

// 断开连通话接 对方id,是否我挂断
const callDisConnect = (toId=0,isMe = false,msg = '对方已取消') => {
    setTimeout(()=>{
        global._stop(); // 停止播放通话音
        global._call_toId = 0 // 呼叫或来电对方的id
        global._call_status = false; // 解除通话锁定
        global._call_connect_status = false // 通话接听状态关闭
        Store.dispatch({type: 'dialog_off'}) // 关闭窗口
        global._play_hang_up() // 播放挂断音
        global._udp_close() // 关闭连接
        global._audio.close() // 关闭连接
        if (isMe) {
            if (toId !== 0) {
                global._socket.send({type: 'hangUp',toId: toId}) // 发送挂断通知
            }
        } else {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        }
    },100)
}

// 初始化
const Init = (store) => {
    Store = store
    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            GetAppInfo()
            Global()
            GetSetting()
            DeviceEventEmitter.addListener('onMessage', onMessage);
            // 页面卸载事件
            return () => {};
        }, []),
    );

    return (<View />)
}

// 挂载udp消息异步通知
const onMessage = (message) => {
    try {
        const data = JSON.parse(message)
        if (data.type === "call" && data.status === "ok") {
            Store.dispatch({type: "dialog_mute", muteStatus: false}) // 取消静音(图标)
            global._call_connect_status = true // 通话接听状态成功
            global._call_time = (new Date().getTime())/1000
            global.callTime = setInterval(()=>{
                Store.dispatch({type: "dialog_time", text: '已接通'}) // 通话计时
            },1000)
        }
    } catch (e) {
        console.log(e)
    }
}

export default connect(store=>store)(Init);
