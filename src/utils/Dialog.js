import {
    Dimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    TextInput,
    StatusBar, Animated, PanResponder, ToastAndroid,
} from 'react-native';
import * as React from 'react';
import {connect} from 'react-redux';
import {openCall, openDial, openMini} from '../store/modules/dialog';
import {getIcon, icon} from '../static/icon';
import {useRef} from 'react';
const {width, height} = Dimensions.get('window');

let mimiPos = new Animated.ValueXY()

let verif = '',title,avatar;

// 关闭弹窗
const close = (store) => {
    store.dispatch({type: 'dialog_off'});
};

// 打开加载
const OpenLoad = (store) => {
    let {dialog} = store;
    return (
        <>
            <View style={styles.load}>
                <Image resizeMode={'stretch'} style={{width: 80, height: 80, marginBottom: 20}}
                       source={{uri: getIcon(icon.loading) }}/>
                <Text style={{color: '#666', fontWeight: 'bold'}}>{dialog.title}</Text>
            </View>
        </>
    );
};

// 打开人机验证对话框
const OpenVerif = (store) => {
    let {dialog} = store;
    return (
        <>
            <View style={styles.bgContent}>
                <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>人机验证</Text>
                <View style={styles.code}>
                    <TextInput autoFocus={true} maxLength={6} style={[styles.input, {width: 160}]}
                               placeholder={'图形验证码'} onChangeText={text => {
                        verif = text;
                    }} selectionColor={'#fda645'}/>
                    <TouchableOpacity style={{width: 80, marginLeft: 10}} onPress={dialog.Verif}>
                        <Image resizeMethod={'scale'} resizeMode={'stretch'}
                               style={{width: 80, height: 50, backgroundColor: '#fff'}}
                               source={{uri: dialog.thumb}}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.5} style={styles.submit} onPress={() => {
                    dialog.onPress(verif);
                }}>
                    <Text style={styles.text}>验 证</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

// 打开对话框
const OpenAlert = (store) => {
    let {dialog} = store;
    return (
        <>
            <View style={[styles.bgContent, {width: 280}]}>
                <Text style={{
                    color: '#000',
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 10,
                }}>{dialog.title}</Text>
                <Text
                    style={{color: '#999', fontSize: 12, fontWeight: 'bold', marginBottom: 10}}>{dialog.msg}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10}}>
                    {
                        dialog.btn.map((item,index)=>{
                            return (
                                <TouchableOpacity onPress={item.onClick} style={{marginLeft: 16}} key={index}>
                                    <Text style={{color: '#000', fontSize: 15}}>{item.title}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        </>
    );
};

// 通话界面  静音按钮开
const muteOn = (store) => {
    return (
        <TouchableOpacity onPress={()=>{mute(store)}} activeOpacity={0.8} style={[styles.callBtn, {backgroundColor: '#666'}]}>
            <Image resizeMethod={'scale'} resizeMode={'stretch'} style={{width: 40, height: 35}}
                   source={{uri: getIcon(icon.micro_off) }}/>
        </TouchableOpacity>
    );
};

// 通话界面 静音按钮关
const muteOff = (store) => {
    return (
        <TouchableOpacity onPress={()=>{mute(store)}} activeOpacity={0.8} style={[styles.callBtn, {backgroundColor: '#fff'}]}>
            <Image resizeMethod={'scale'} resizeMode={'stretch'} style={{width: 40, height: 35}}
                   source={{ uri: getIcon(icon.micro_on) }}/>
        </TouchableOpacity>
    );
};

// 通话界面 静音按钮点击事件
const mute = (store) => {
    let {dialog} = store;
    if (global._call_connect_status) { // 通话状态连接成功
        store.dispatch({type: 'dialog_mute', muteStatus: !dialog.muteStatus});
        global._audio.mute(); // 静音或取消静音
    }
};

// 通话界面 挂断按钮
const hangUp = (store) => {
    clearInterval(global.callTime) // 清除通话超时计时
    global._callDisConnect(global._call_toId,true)
};

// 打开最小化通话界面
const OpenMini = (store) => {
    let {dialog} = store;
    title = dialog.title
    avatar = dialog.avatar
    let watcher = PanResponder.create({  //建立监视器
        onStartShouldSetPanResponder:()=>true, // 监听触摸移动事件
        onResponderGrant:(e,t)=>{ // 开始拖拽

        },
        onPanResponderMove:(e,t) => { // 拖拽中
            Animated.spring(mimiPos, {
                toValue: { x: t.moveX, y: t.moveY },
                useNativeDriver: false,
            }).start();
        },
        onPanResponderEnd:(e,t) => { // 结束拖拽
            t.moveX = t.moveX < 10 ? -10 : t.moveX
            t.moveY = t.moveY < 10 ? -10 : t.moveY
            t.moveX = t.moveX > width-70 ? width-70 : t.moveX
            t.moveY = t.moveY > height-70 ? height-70 : t.moveY
            t.moveX = t.moveX > width/2 ? width-70 : -10
            Animated.spring(mimiPos, {
                toValue: { x: t.moveX, y: t.moveY },
                useNativeDriver: false,
            }).start();
        },
    });

    return (
        <Animated.View style={{padding: 20,position: 'absolute',transform: [{ translateX: mimiPos.x }, { translateY: mimiPos.y }]}} {...watcher.panHandlers}>
            <View style={{borderRadius: 10,elevation: 20,overflow: 'hidden'}}>
                <Image pointerEvents={'none'} resizeMethod={'scale'} resizeMode={'stretch'} style={{backgroundColor: '#fff',width: 40, height: 40}}
                       source={{ uri: getIcon(icon.answering) }}>
                </Image>
                <TouchableOpacity style={{padding: 10,position: 'absolute',top: 10,left: 10}} onPress={()=>{store.dispatch(openCall(dialog.title,dialog.avatar,0,'呼叫中...'))}} />
            </View>
        </Animated.View>
    );
};

// 通话时长
const time = (store) => {
    let {dialog} = store;
    let str = '';
    if (dialog.time > 0) {
        let d = parseInt(dialog.time / 3600 % 24);
        let m = parseInt(dialog.time / 60 % 60);
        let s = parseInt(dialog.time % 60);
        d = d < 10 ? '0'+ d : d
        m = m < 10 ? '0'+ m : m
        s = s < 10 ? '0'+ s : s
        str = `${d}:${m}:${s}`;
    }
    return (
        <Text style={{color: '#fff', fontSize: 15}}>{str}</Text>
    );
};

// 打开通话界面
const OpenCall = (store) => {
    let {dialog} = store;
    if (!global._call_status && global._call_toId === 0) { // 通话状态为解锁的状态，且我呼叫的对方id为空
        global._play_call();
        global._call_status = true; // 通话状态锁定
        connectCall(store);
    }
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#000"/>
            <Image blurRadius={15} source={{uri: dialog.avatar}} style={styles.bg} resizeMethod={'scale'}/>
            <View style={[styles.bg, styles.call]}>
                <View style={{marginTop: 40}}>
                    <Text style={{color: '#fff', fontSize: 18}}>{dialog.callText}</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={{
                        overflow: 'hidden',
                        borderRadius: 10,
                        borderWidth: 3,
                        borderColor: 'rgba(255,255,255,0.5)',
                    }}>
                        <Image resizeMethod={'scale'} resizeMode={'stretch'} style={{width: 80, height: 80}}
                               source={{uri: dialog.avatar}}/>
                    </View>
                    <Text style={{
                        color: '#FFF',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 20,
                    }}>{dialog.title}</Text>
                </View>
                <View/><View/>
                <View>
                    <View style={{alignItems: 'center', marginBottom: 30}}>
                        {time(store)}
                    </View>
                    <View style={{
                        marginBottom: 40,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        width: width,
                    }}>
                        {dialog.muteStatus ? muteOn(store) : muteOff(store)}
                        <TouchableOpacity onPress={()=>{hangUp(store)}} style={[styles.callBtn, {backgroundColor: '#e72323'}]}>
                            <Image resizeMethod={'scale'} resizeMode={'stretch'} style={{width: 50, height: 50}}
                                   source={{ uri: getIcon(icon.hang_up) }}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {store.dispatch(openMini(dialog.title,dialog.avatar))}} style={[styles.callBtn, {backgroundColor: '#fff'}]}>
                            <Image resizeMethod={'scale'} resizeMode={'stretch'} style={{width: 26, height: 26}} source={{ uri: getIcon(icon.minimize) }}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

// 发起通话连接
const connectCall = (store) => {
    let {dialog} = store;
    global._call_toId = dialog.toId; // 记录我呼叫的对方id
    global._socket.send({type: 'call', toId: dialog.toId}); // 发送呼叫邀请
    global._callTimeOut()
};

// 来电界面 拒绝 按钮
const refuse = (store) => {
    let {dialog} = store;
    global._call_status = false // 解除通话锁定
    global._socket.send({type: 'refuse', toId: dialog.fromId}); // 发送拒绝通知
    global._stop();  // 停止来电音
    close(store);
    setTimeout(() => {
        global._play_hang_up();
    }, 100);
};

// 来电界面 接听 按钮
const answer = (store) => {
    let {dialog} = store;
    let toId = dialog.fromId;
    let {title,avatar} = dialog
    global._permission(()=>{
        global._callConnect(toId,true,title,avatar)  // 建立通话连接
    },()=>{
        store.dispatch(openDial(title,avatar,toId))
    })
}

// 打开来电界面
const OpenDial = (store) => {
    let {dialog} = store;
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#000"/>
            <Image blurRadius={15} source={{uri: dialog.avatar}} style={styles.bg} resizeMethod={'scale'}/>
            <View style={[styles.bg, styles.call]}>
                <View/>
                <View style={{alignItems: 'center'}}>
                    <View style={{
                        overflow: 'hidden',
                        borderRadius: 10,
                        borderWidth: 3,
                        borderColor: 'rgba(255,255,255,0.5)',
                    }}>
                        <Image resizeMethod={'scale'} resizeMode={'stretch'} style={{width: 80, height: 80}}
                               source={{uri: dialog.avatar}}/>
                    </View>
                    <Text style={{
                        color: '#FFF',
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 10,
                    }}>{dialog.title}</Text>
                </View>
                <View/><View/>
                <View>
                    <View style={{
                        marginBottom: 40,
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        width: width,
                    }}>
                        <TouchableOpacity onPress={()=>{refuse(store)}}
                                          style={[styles.callBtn, {backgroundColor: '#e72323'}]}>
                            <Image resizeMethod={'scale'} resizeMode={'stretch'} style={{width: 50, height: 50}}
                                   source={{ uri: getIcon(icon.hang_up) }}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{answer(store)}}
                                          style={[styles.callBtn, {backgroundColor: '#36cd24'}]}>
                            <Image resizeMethod={'scale'} resizeMode={'stretch'} style={{width: 50, height: 50}}
                                   source={ {uri: getIcon(icon.answer) }}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

// 选择框
const OpenSelect = (store) => {

    let {dialog} = store;

    const selectBottom = useRef(new Animated.Value(-200)).current  // 透明度初始值设为0
    Animated.timing(
        selectBottom,
        {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }
    ).start();

    const closeSelect = () => {
        Animated.timing(
            selectBottom,
            {
                toValue: -200,
                duration: 200,
                useNativeDriver: false,
            }
        ).start(()=>{
            close(store)
        });
    }

    const onClick = (fn) => {
        closeSelect()
        fn()
    }

    return (
        <>
            <Animated.View style={{position: 'absolute',bottom: selectBottom,width: width,backgroundColor: '#fff',padding: 10}}>
                <Text>{dialog.title}</Text>
                {
                    dialog.btn.map((item,index)=>{
                        return (
                            <TouchableOpacity key={index} style={styles.selectItem} onPress={()=>onClick(item.onClick)}>
                                <Text style={{color: '#000'}}>{item.title}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
                <TouchableOpacity style={styles.selectCancel} onPress={closeSelect}>
                    <Text style={{color: '#666'}}>取消</Text>
                </TouchableOpacity>
            </Animated.View>
        </>
    )
}

// 对话框组件
const Dialog = (store) => {
    let {dialog} = store;
    if (dialog.show) {
        let html = null
        switch (dialog.type) {
            case 'load':
                html = OpenLoad(store);break;
            case 'verif':
                html = OpenVerif(store);break;
            case 'alert':
                html = OpenAlert(store);break;
            case 'call':
                html = OpenCall(store);break;
            case 'dial':
                html = OpenDial(store);break;
            case "select":
                html = OpenSelect(store);break;
            case 'mini':
                return OpenMini(store);
            default:
                html = <View/>
        }
        return (
            <TouchableOpacity style={styles.bg} activeOpacity={1} onPress={() => {dialog.touch === true ? close(store) : null;}}>
            {html}
            </TouchableOpacity>
        )
    } else {
        setTimeout(()=>{
            if (global._call_status) { // 通话状态还在保持，别的因素关闭了窗口
                store.dispatch(openMini(title,avatar))
            }
        },100)
        return (<View/>);
    }
};

const styles = StyleSheet.create({
    bg: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
        height: '100%',
        zIndex: 1,
    },
    call: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        padding: 12,
    },
    bgContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 5,
        zIndex: 2,
    },
    input: {
        width: 300,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#F6F6F6',
    },
    submit: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fda645',
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 20,
    },
    text: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
    },
    code: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    load: {
        backgroundColor: '#fff',
        width: 240,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    callBtn: {
        borderRadius: 200,
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectItem:{
        borderBottomColor: '#f1f1f1',
        borderBottomWidth: 1,
        height: 50,
        padding: 5,
        justifyContent:'center',
    },
    selectCancel: {
        paddingTop: 10,
        height: 50,
        justifyContent:'center',
        alignItems: 'center',
    },
});

export default connect(store => store)(Dialog);
