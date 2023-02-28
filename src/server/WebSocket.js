/*
 * WebSocket类
 * */
import config from '../config';
import {closeDialog, openAlert, openDial, openMini} from '../store/modules/dialog';
import {set} from "../utils/Storage";
import {ToastAndroid} from "react-native";

var status = false // WebSocket 在线状态
var again = false // 重连机制
var againInterval = null // 重连时钟

// WebSocket 组件
class WS {
  constructor() {
    this.socket = null
  }

  connect(store) {

    let {navigation} = store

    // 连接websocket
    if (!status) {
      again = false
      this.socket = new WebSocket(config.server.ws + '?token=' + global._token);
    } else {
      return
    }

    // 连接成功
    this.socket.onopen = () => {
      global._user.active = true
      store.dispatch({type: 'online_login'});
      status = true
      again = false
      clearInterval(againInterval)
    };

    // 收到消息
    this.socket.onmessage = e => {
      let data = null;
      try {
        data = JSON.parse(e.data);
        //console.log(data)
        if (data.type === "ping") { return }
        if (data.type === "logout" && data.from === global._user.id) { // 本人掉线
          this.close()
          clearInterval(againInterval)
          status = false
          setTimeout(()=>{
            store.dispatch(openAlert("下线通知","您在另一处登录了，该设备被迫下线",
                [{
                  title:"确定",
                  onClick: ()=> {
                    set('token', '')
                    navigation.navigate("Login")
                    store.dispatch({type: 'dialog_off'})
                    setTimeout(()=>{
                      store.dispatch({type: 'list', list: []});// 清空用户列表
                    },100)
                  }
                }]
            ))
          },300)
        } else if (data.type === 'call' && data.from !== global._user.id) { // 对方来电
          let {ws} = store
          for (let i=0;i<ws.list.length;i++) {
              if (ws.list[i].id === data.from) {
                if (!global._call_status) { // 未在通话
                  global._call_status = true // 通话状态锁定
                  global._play_call()
                  global._callInTimeOut()
                  store.dispatch(openDial(ws.list[i].nickname,ws.list[i].avatar,data.from)) // 打开来电页面
                } else { // 在通话中
                  this.send({type: 'busy', toId: data.from}) // 发送通话忙碌
                }
                break
              }
          }
        } else if (data.type === "busy") {
          global._callDisConnect(0,false,'对方忙')
        } else if (data.type === "refuse") { // 拨号对方拒接
          if (data.from === global._call_toId) {
            global._stop()
            global._call_toId = 0 // 呼叫或来电对方的id
            global._call_status = false // 解除通话锁定
            setTimeout(()=>{
              global._play_hang_up()
              store.dispatch(openAlert("对方拒绝","对方拒绝了你的呼叫邀请",[{
                title: "好吧",
                onClick:()=>{
                  store.dispatch(closeDialog())
                }
              }]))
            },100)
          }
        } else if (data.type === "hangUp") { // 对方挂断电话
            store.dispatch(closeDialog()) // 关闭窗口
            global._stop()
            if (!global._call_connect_status) { // 还未接听，对方挂断
              ToastAndroid.show("对方已取消", ToastAndroid.SHORT);
              global._play_hang_up()
              global._call_status = false // 通话状态解除锁定
            } else { // 已接听，对方挂断
              global._callDisConnect(data.from,false,"对方已挂断")
            }
            clearInterval(global.callTime) // 清除通话超时计时
        } else if(data.type === "answer") { // 拨号对方确认接听
          if (data.from === global._call_toId && global._call_status) { // 确认身份和通话状态
            global._callConnect(data.from) // 建立通话连接
          }
        } else {
          store.dispatch({type: 'on_message', message: data});
        }
      } catch (e) {
        data = null;
      }
    };

    // 连接错误
    this.socket.onerror = e => {
      //store.dispatch({type: 'online_logout'});
    };

    // 断开连接
    this.socket.onclose = e => {
      if (global._call_status) { // 通话状态,挂断
        global._callDisConnect(0,false,'通话断开')
        clearInterval(global.callTime) // 清除通话超时计时
      }
      status = false
      if (!again) {
        again = true
        clearInterval(againInterval)
        againInterval = setInterval(()=>{
          this.socket = null
          this.connect(store)
        },10000)
      }
      store.dispatch({type: 'online_logout'});
    };
  }
  send(msg) {
    if (status && typeof this.socket.send != null) {
      try{this.socket.send(JSON.stringify(msg))}catch (e){}
    }
  }
  close(){
    if (status) {
      try{this.socket.close()}catch (e){}
    }
    again = true
    status = false
    clearInterval(againInterval)
  }
}

export default WS;
