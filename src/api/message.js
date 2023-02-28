import Request from '../utils/Request';

// 消息至已读
export function messageRead(data) {
    return Request({
        url: '/api/message/read',
        method: 'POST',
        data,
        load: false,
        close: false
    });
}

// 获取聊天记录
export function GetMessageList(param) {
    return Request({
        url: '/api/message/list',
        method: 'GET',
        param,
        title: '正在加载,请稍后...',
    });
}