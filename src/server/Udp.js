import {NativeModules} from "react-native"

import React from "react";
import config from "../config";

const socket = NativeModules.Udp
export const audio = NativeModules.Audio;

 // 建立连接
export const open = () => {
    socket.open(config.server.udp.host, config.server.udp.port.toString(), global._token) // 连接服务，并登录
}

// 关闭服务
export const close = () => {
    socket.close()
}

// 播放或暂停播放来自对方的音频，传入一个布尔值
export const play = (res) => {
    socket.play(res)
}
