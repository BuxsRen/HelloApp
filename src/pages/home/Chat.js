import React, {useRef} from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, Dimensions, TextInput, FlatList, ScrollView, Animated,
} from 'react-native';

import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window');
import {getIcon, icon} from '../../static/icon';
import {useFocusEffect} from '@react-navigation/native';
import EmojiBox, {getAllEmoji} from '../../utils/Emoji';
import {set,get} from '../../utils/Storage';
import {GetMessageList, messageRead} from '../../api/message';
import {openLoad} from '../../store/modules/dialog';
import {timeToStr} from '../../utils/Utils';

let inputHeight = 40 // 输入框默认高度
let faceHeight = 0 // 表情面板默认高度
let faceStatus = false // 表情面板打开状态
let sendBg = '#e5e5e5' // 发送按钮默认颜色
let last = null // 上一条消息
let _textinput = null // 输入框组件
let messages = "" // 需要发送的消息
let chatTop= 0 // 聊天框减少高度

const msgTip = (msg) => {
    return (<View style={{alignItems: 'center',flex: 1,margin: 5}}>
        <Text style={styles.tipText}>
            {msg}
        </Text>
    </View>)
}

// 聊天页
const Chat = store => {
    let {navigation} = store
    let { params:{info} } = store.route

    faceHeight = useRef(new Animated.Value(0)).current  // 表情面板高度初始值
    chatTop = useRef(new Animated.Value(0)).current

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'Chat'

            global._chat_id = info.id // 绑定他人聊天的id
            info.spot = 0
            info.text = info.text == null ? "" : info.text
            messages = info.text
            if (info.page === 0 && info.loadmore) { // 只保证打开当前页面只会有一次初始加载
                info.page++
                setTimeout(()=>{
                    store.dispatch(openLoad("正在加载..."))
                    get("message_"+global._user.id+"_"+info.id).then(res=>{
                        info.message = res == null ? [] : JSON.parse(res) // 加载本地数据
                        if (info.message.length === 0) { // 没有本地数据
                            setTimeout(()=>{
                                loadMessage() // 加载服务器聊天记录
                                info.loadmore = false
                            },100)
                        } else {
                            setTimeout(()=>{
                                loadMessage(true) // 加载服务器新的聊天记录
                                info.loadmore = false
                                info.page = parseInt(info.message.length/30)
                            },100)
                        }
                    }).catch((e)=>{ // 没有本地数据
                        console.log(e)
                    })
                },300)
            }
            messageRead({id: info.id}) // 更新所有未读消息为已读
            // 页面卸载事件
            return () => {
                info.text = messages
                info.spot = 0
                global._chat_id = 0 // 移除他人聊天的id
            };
        }, [faceHeight]),
    );

    // 捕获输入框内容
    const onChange = (text) => {
        messages = text
        if (messages.indexOf("\n") !== -1) { // 寻址回车键
            if (global._setting.enter) { // 开启回车键发送
                messages = messages.replace(/^(\s|\n)+|(\s|\n)+$/g, "");
                onSubmit()
            } else {
                inputHeight = 80
            }
        } else {
            inputHeight = 40
        }
        sendBg = messages.length > 0 ? '#fda645' : '#e5e5e5'
        store.dispatch({type: 'null'})
    }

    // 发送
    const onSubmit = () => {
        if (messages === "") { return }
        if (messages.replace(/\n/g,'') === "") { return }
        global._socket.send({type: 'send',toId: info.id,data: encodeURIComponent(messages)})
        messages = ""
        sendBg ='#e5e5e5'
        inputHeight = 40
        setTimeout(()=>{
            if(_textinput){ _textinput.blur() }
            if(faceStatus){
                faceStatus = !faceStatus
                closeEmojiBox()
            }
        },100)
    }

    // 加载聊天记录
    const loadMessage = (newMsg = false) => {
        GetMessageList("?id="+info.id+"&page="+info.page+'&limit=30').then(res => {
            if (res.code === 200) {
                let list = res.data.items
                if (list.length === 0) { info.loadmore = true }
                let ids = []
                if (newMsg) {list = list.reverse()}
                for(let i=0;i<info.message.length;i++) {
                    ids.push(info.message[i].id)
                }
                for(let i=0;i<list.length;i++) {
                    if (ids.indexOf(list[i].id) === -1) {
                        if (newMsg) {
                            info.message.unshift(list[i])
                        } else {
                            info.message.push(list[i])
                        }
                    }
                }
                set("message_"+global._user.id+"_"+info.id,JSON.stringify(info.message))
            }
            store.dispatch({type: 'null'})
        }).catch(e=>{
            console.log(e)
            store.dispatch({type: 'null'})
        })
    }

    // 列表单个组件
    const renderItem = ({ item }) => {
        let html,tip = null
        if (last != null) {
            if (last.create_at - item.create_at > 300) { // 消息时隔提示
                tip = msgTip(timeToStr(last.create_at,'mm-dd hh:ii'))
            }
        }
        if (item.from_id === global._user.id) { // 自己的消息
            html = (
                <View style={[styles.chatItem,{flexDirection: 'row-reverse'}]}>
                    <Image style={[styles.avatar,{marginLeft: 10}]} source={{uri: global._user.avatar}}/>
                    <View>
                        <View style={[styles.chatContent,{backgroundColor: '#458ffd'}]}>
                            <Text selectable={true} style={{color: '#fff'}}>{decodeURIComponent(item.content)}</Text>
                        </View>
                    </View>
                </View>
            )
        } else { // 别人的消息
            html = (
                <View style={styles.chatItem}>
                    <Image style={[styles.avatar,{marginRight: 10}]} source={{uri: info.avatar}}/>
                    <View>
                        <View style={[styles.chatContent,{backgroundColor: '#fff'}]}>
                            <Text selectable={true} style={{color: '#000'}}>{decodeURIComponent(item.content)}</Text>
                        </View>
                    </View>
                </View>
            )
        }
        last = item
        return (<View>{html}{tip}</View>)
    }

    // 打开表情面板
    const openEmojiBox = () => {
        if(_textinput){ _textinput.blur() }
        if (faceStatus) {
            closeEmojiBox()
        } else {
            // 移动聊天框
            Animated.timing(
                chatTop,
                {
                    toValue: -200,
                    duration: 300,
                    useNativeDriver: false,
                }
            ).start()
            // 移动表情面板
            Animated.timing(
                faceHeight,
                {
                    toValue: 200,
                    duration: 300,
                    useNativeDriver: false,
                }
            ).start();
        }
        faceStatus = !faceStatus
    }

    // 关闭表情面板
    const closeEmojiBox = () => {
        // 移动聊天框
        Animated.timing(
            chatTop,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }
        ).start()
        // 移动表情面板
        Animated.timing(
            faceHeight,
            {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }
        ).start()
    }

    // 加载更多聊天记录
    const loadMore = () => {
        if (info.loadmore) { return }
        info.page++
        loadMessage()
    }

    // 表情面板
    const EmojiBox = () => {
        let list = []
        let face = getAllEmoji()
        face.forEach((item,index)=>{
            list.push(
                <TouchableOpacity onPress={()=>{ messages += item;sendBg = '#fda645';store.dispatch({type: 'null'}) }} key={index} style={{margin: 2}}>
                    <Text style={{color: '#fff',fontSize: 22}}>{item}</Text>
                </TouchableOpacity>
            )
        })

        return (
            <View style={{flexDirection: 'row', flexWrap: 'wrap',padding: 5}}>
                {list}
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
            <View style={{zIndex: 1}}>
                <View style={styles.bar}>
                    <View style={styles.barLeft}>
                        <TouchableOpacity style={{width: 60}} onPress={()=>{navigation.goBack()}}>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.back) }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>{info.nickname}</Text>
                        <TouchableOpacity onPress={()=>{navigation.goBack()}} style={{width: 60,flexDirection: 'row-reverse'}}>
                            {/*<Image style={{width: 20,height: 20}} resizeMethod={'scale'} source={{ uri: getIcon(icon.more) }} />*/}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{flexDirection: 'column-reverse',position: 'absolute',bottom: 60,height: height-120}}>
                <Animated.FlatList
                    data={info.message}
                    renderItem={renderItem}
                    style={[styles.chat,{maxHeight: height-120,top: chatTop}]}
                    inverted={true}
                    keyExtractor={item => item.id}
                    onEndReached={loadMore}
                />
            </View>
            <View style={styles.footer}>
                <View style={styles.sendContent}>
                    <TouchableOpacity activeOpacity={0.8} onPress={openEmojiBox}><Text style={{fontSize: 26,marginRight: 5,color: '#fff'}}>😁</Text></TouchableOpacity>
                    <TextInput ref={that=>{_textinput = that}} value={messages} onFocus={closeEmojiBox} multiline={true} textAlignVertical={"top"} style={[styles.input,{height: inputHeight}]} onChangeText={onChange} selectionColor={"#fda645"} />
                    <TouchableOpacity style={[styles.submit,{backgroundColor: sendBg}]} onPress={onSubmit}><Text style={{color: '#fff',width: 60,textAlign: 'center'}}>发送</Text></TouchableOpacity>
                </View>
                <Animated.View style={{height: faceHeight}}>
                    <ScrollView>
                        <EmojiBox/>
                    </ScrollView >
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        marginTop: global._statusBarHeight
    },
    bar: {
        backgroundColor: '#fff',
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        width: '100%',
    },
    barLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    back: {
        width: 18,
        height: 18,
    },
    chat:{
        width: width,
        paddingRight: 10,
        paddingLeft: 10,
        position: 'absolute',
        top: 0,
    },
    chatItem: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        marginRight: 86,
    },
    chatContent: {
        padding: 8,
        marginTop: 5,
        borderRadius: 5,
    },
    avatar: {
        borderRadius: 50,
        width: 38,
        height: 38,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
    },
    footer: {
        borderTopColor: '#e7e7e7',
        borderTopWidth: 1,
        width: width,
        padding: 10,
        backgroundColor: '#f6f6f6',
        position: 'absolute',
        bottom: 0,
    },
    sendContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input:{
        flex: 1,
        marginRight:10,
        borderRadius: 5,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor: '#ffffff',
        color: '#000',
    },
    submit: {
        borderRadius: 5,
        justifyContent: 'center',
        height: 36,
    },
    tipText: {
        fontSize: 12,
        color: '#9d9d9d',
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        paddingTop: 2,
        borderRadius: 100,
    },
});

export default connect(store => store)(Chat);
