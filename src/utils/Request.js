import config from '../config';
import {get} from './Storage';
import {ToastAndroid} from "react-native";
import store from "../store/store";
import {openLoad} from "../store/modules/dialog";

// 网络请求
const Request = async obj => {
    obj.method = obj.method || 'GET';
    obj.param = obj.param || '';
    if (obj.method === 'POST') {
        obj.data = obj.data || {};
    }
    obj.header = obj.header || {};
    obj.header.id = await get('token');
    obj.header['Content-Type'] = obj.header['Content-Type'] ?? 'application/json';
    if (obj.header['Content-Type'] === 'application/json') {
        obj.data = JSON.stringify(obj.data)
    }
    obj.url = config.server.url + obj.url + obj.param;
    obj.load = obj.load ?? true
    obj.close = obj.close ?? true
    if (obj.load) { store.dispatch(openLoad(obj.title || "正在请求，请稍后...")) }
    return new Promise((resolve, reject) => {
        fetch(obj.url, {
            method: obj.method,
            headers: obj.header,
            body: obj.data,
        }).then(response => response.json()).then(res => {
            if (res.code === -99) {
                store.dispatch({
                    type: 'user_notif',
                    notif: {
                        type: "logout", msg: "登录身份过期了，请重新登录"
                    }
                })
            }
            if (obj.close) {
                setTimeout(()=>{
                    store.dispatch({type: 'dialog_off'})
                },500)
            }
            resolve(res);
        }).catch(e => {
            setTimeout(()=>{
                store.dispatch({type: 'dialog_off'})
                ToastAndroid.show("服务器开小差了", ToastAndroid.SHORT);
            },500)
            reject(e);
        });
    });
};

export default Request;
