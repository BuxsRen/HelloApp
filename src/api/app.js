import Request from '../utils/Request';

// 检查更新
export function update(param) {
    return Request({
        url: '/api/check/update',
        method: 'GET',
        param,
        load: false,
        close: false
    });
}

// 检查更新
export function update2(param) {
    return Request({
        url: '/api/check/update',
        method: 'GET',
        param,
        title: '正在检查更新...'
    });
}