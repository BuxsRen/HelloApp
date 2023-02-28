import {set} from "../../utils/Storage"
import {messageRead} from '../../api/message';
import {userInfo} from '../../api/user';

// 初始数据
export const ws = {
    online: false, // ws在线状态
    list: [], // 通讯录列表
    listIndex: {}, // 通讯录列表索引
};

// reducers
const reducers = (state = ws, action) => {
    switch (action.type) {
        case 'online_login': // websocket服务上线
            state.online = true
            return {
                ...state,
            };
        case 'online_logout':// websocket服务掉线
            for (let i=0;i<state.list.length;i++) {
                state.list[i].active = false
            }
            state.online = false
            return {
                ...state,
            };
        case 'on_message': // 收到消息
            const data = action.message;
            if (data.type === 'list') {
                data.data.forEach(item => {
                    const index = state.listIndex[item]
                    if (index >= 0) {
                        state.list[index].active = true
                    }
                    for (let i=0;i<state.list.length;i++) {
                        for (let j=0;j<state.list.length;j++) {
                            if (state.list[i].active > state.list[j].active) {
                                state.listIndex[state.list[i].id] = j;
                                state.listIndex[state.list[j].id] = i;
                                const temp = state.list[i];
                                state.list[i] = state.list[j]
                                state.list[j] = temp;
                            }
                        }
                    }

                })
            } else if (data.type === 'login') { // 有人登录
                const index = state.listIndex[data.from]
                if (index >= 0) {
                    state.list[index].active = true
                } else { // 刚注册的新用户
                    userInfo("?id="+data.from).then(res=>{
                        if (res.code === 200) {
                            state.list.push(res.data);
                            state.listIndex[data.from] = state.list.length-1
                        }
                    })
                }
            } else if (data.type === 'logout') { // 有人离线
                const index = state.listIndex[data.from]
                state.list[index].active = false
                if (global._call_toId === data.from) { // 在通话中，且通话的人是掉线的人
                    global._callDisConnect(0,false,'通话断线')
                    clearInterval(global.callTime) // 清除通话超时计时
                }
            } else  if (data.type === "all") { // 群发消息
                global._setting.tipsSound ? global._play_notif() : null
            } else if (data.type === "send") { // 私发消息
                if (data.from === global._user.id && global._chat_id !== 0) { // 来自自己的消息，且正在他人聊天界面
                    const index = state.listIndex[global._chat_id]
                    state.list[index].message.unshift({
                        id: data.id,
                        content: data.data,
                        from_id: data.from,
                        users_id: global._user.id,
                        create_at: data.time,
                        is_read: 1
                    });
                    set("message_"+global._user.id+global._chat_id,JSON.stringify(state.list[index].message))
                } else {
                    const index = state.listIndex[data.from]
                    if (global._chat_id === 0) {
                        state.list[index].spot += 1;
                    } else { // 正在和他聊天
                        messageRead({id: global._chat_id}) // 更新所有未读消息为已读
                    }
                    state.list[index].message.unshift({
                        id: data.id,
                        content: data.data,
                        from_id: data.from,
                        users_id: global._user.id,
                        create_at: data.time,
                        is_read: global._chat_id === 0 ? 0 : 1
                    });
                    set("message_"+global._user.id+data.from,JSON.stringify(state.list[index].message))
                    global._setting.tipsSound ? global._play_notif() : null
                }
            }
            return {
                ...state,
            };
        case 'list': // 更新通讯录列表
            state.list = action.list;
            state.listIndex = action.listIndex;
            return {
                ...state,
            };
        default:
            return {
                ...state,
            };
    }
};

export default reducers;
