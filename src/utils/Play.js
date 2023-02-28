import Sound from 'react-native-sound'

let playStatus = false
let whoosh = null

// 播放内置声音 文件名，是否重复播放
export const Play = (music = "notif.ogg",loop = false) => {
    if (!playStatus) {
        Stop()
        whoosh = new Sound(music, '', (err) => {
            if(err) { playStatus = true }
            playStatus = true
            loop ? whoosh.setNumberOfLoops(-1) : null
            whoosh.play(success => {
                playStatus = false
            })
        })
    }
}

// 播放通话铃声
export const PlayCall = () => {
    if (global._setting.callSound) {
        Play("call.ogg",true)
    }
}

// 消息提示音
export const PlayNotif = () => {
    if (global._setting.tipsSound) {
        Play("notif.ogg")
    }
}

// 播放呼叫失败音
export const PlayCallFailed = () => {
    Play("call_failed.mp3")
}

// 播放呼叫超时
export const PlayCallTimeOut = () => {
    Play("call_time_out.mp3")
}

// 播放挂断音
export const PlayHangUp = () => {
    Play("hang_up.mp3")
}

// 停止播放
export const Stop = () => {
    if (whoosh != null) {
        whoosh.stop()
        whoosh.release();
    }
    whoosh = null
    playStatus = false
}
