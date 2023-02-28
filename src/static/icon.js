import config from '../config';

// 图标配置
export const icon = {
    // 选择
    active: "active.png",
    // 返回图标
    back: "back.png",
    // 通讯录
    contacts_on: 'contacts_on.png',
    // 通讯录
    contacts_off: 'contacts_off.png',
    // 圈子
    circle_on: 'circle_on.png',
    // 圈子
    circle_off: 'circle_off.png',
    // 列表右边标志
    right: "right.png",
    // 编辑
    edit: "edit.png",
    // 完成
    done: "done.png",
    // 点赞
    star: "star.png",
    // 信息
    msg: "msg.png",
    // 通知
    notif: "notif.png",
    // 更多
    more: "more.png",
    // 加载
    loading: "loading.gif",
    // 静音关
    micro_off: "micro_off.png",
    // 静音开
    micro_on: "micro_on.png",
    // 挂断
    hang_up: "hang_up.png",
    // 最小化
    minimize: "minimize.png",
    // 接听
    answer: 'answer.png',
    // 通话中
    answering: 'answering.png',
    // 发布
    release: 'release.png',
    // 发布
    release_on: 'release_on.png',
    // 访客
    see: 'see.png',
}

// 获取图标
export const getIcon = (name) => {
    return config.server.host+'/hello/drawable/'+name
}
