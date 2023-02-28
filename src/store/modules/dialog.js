
// 初始数据
export const dialog = {
    show: false, // 显示弹窗
    type: '', // 打开方式
    touch: false, // 触摸透明处退出
    thumb: '', // 人机验证 图形码
    Verif: null, // 人机验证，获取验证码方法
    onPress: null, // 人机验证，验证按钮事件
    title:'', // 标题
    msg:'', // 对话框信息
    btn:[], //对话框按钮组
    avatar: '', // 头像
    muteStatus: false, // 静音状态
    time: 0, // 通话时长
    toId: 0, // 通话对方id
    fromId: 0, // 呼叫者的的id
    callText: '' // 通话状态文本
};

// reducers
const reducers = (state = dialog, action) => {
    switch (action.type) {
        case 'dialog_on':
            global._dialog_show = true
            global.muteStatus = false
            global._dialog_type = action.dialog.type
            state.show = true
            state.type = action.dialog.type
            state.touch = action.dialog.touch
            state.thumb = action.dialog.thumb
            state.Verif = action.dialog.Verif
            state.onPress = action.dialog.onPress
            state.title = action.dialog.title
            state.msg = action.dialog.msg
            state.btn = action.dialog.btn
            state.avatar = action.dialog.avatar
            state.toId = action.dialog.toId
            state.fromId = action.dialog.fromId
            state.callText = action.dialog.callText
            state.time = 0
            return {
                ...state,
            };
        case 'dialog_off':
            global._dialog_show = false
            state.show = false
            return {
                ...state,
            };
        case 'dialog_mute':
            state.muteStatus = action.muteStatus
            return {
                ...state,
            };
        case 'dialog_time':
            state.time = (new Date().getTime())/1000 - global._call_time
            state.callText = action.text
            return {
                ...state
            }
        case 'dialog_text':
            state.callText = action.text
            return {
                ...state
            }
        default:
            return {
                ...state,
            };
    }
};


// action 配置

// 关闭
export const closeDialog = () => {
    return {type: 'dialog_off'}
}

// 打开加载
export const openLoad = (title = '稍等一下，马上就好',touch = false) => {
    return {
        type: 'dialog_on',
        dialog: {
            type: 'load', title, touch
        }
    }
}

// 打开人机验证 验证码，获取验证码方法，确认按钮事件
export const openVerif = (thumb='',Verif,onPress,touch = true) => {
    return {
        type: 'dialog_on',
        dialog: {
            type: 'verif', touch, thumb, Verif, onPress
        }
    }
}

// 打开对话框 标题，信息，按钮组[{title: '标题', onClick: ()=>{}}]
export const openAlert = (title='',msg='',btn = [],touch = false) => {
    return {
        type: 'dialog_on',
        dialog: {
            type: 'alert', touch, title, msg, btn
        }
    }
}

// 打开通话界面 用户名，头像，对方Id
export const openCall = (title='',avatar='',toId=0,callText = '呼叫中...',touch = false) => {
    return {
        type: 'dialog_on',
        dialog: {
            type: 'call', touch, title, avatar,toId,callText
        }
    }
}

// 打开来电页面 用户名，头像，接听事件，挂断事件
export const openDial = (title='',avatar='',fromId=0,touch = false) => {
    return {
        type: 'dialog_on',
        dialog: {
            type: 'dial', touch, title, avatar,fromId
        }
    }
}

// 打开选择框
export const openSelect = (title,btn=[],touch = false) => {
    return {
        type: 'dialog_on',
        dialog: {
            type: 'select',title,btn,touch
        }
    }
}

// 打开最小化通话框，输入通话中的昵称和头像
export const openMini = (title,avatar) => {
    return {
        type: 'dialog_on',
        dialog: {
            type: 'mini',title,avatar
        }
    }
}


export default reducers;
