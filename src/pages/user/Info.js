import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, Dimensions, Switch, ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {star, userInfo} from "../../api/user";
import {closeDialog, openAlert, openCall} from "../../store/modules/dialog";
const {width,height} = Dimensions.get('window');
import {set} from '../../utils/Storage';
import {getIcon, icon} from '../../static/icon';
import {getAge} from '../../utils/Utils';

// 个人资料页
const Info = store => {
    let {navigation} = store
    let { params:{info} } = store.route

    // 拨打语音电话
    const onCall = () => {
        if (info.id === global._user.id || global._call_status) { return } // 忽略自己
        store.dispatch(openAlert("呼叫","确定要呼叫"+info.nickname+'?',
            [{ title: "不",
                onClick:()=>{
                    store.dispatch(closeDialog());
                }
            },{ title: "是的",
                onClick:async ()=>{
                    global._permission(()=>{
                        if (!info.active) { // 对方不在线
                            store.dispatch(openAlert("呼叫失败","呼叫失败，对方不在线",
                                [{ title: "知道了",
                                    onClick:()=>{
                                        store.dispatch(closeDialog())
                                    }
                                }]
                            ))
                        } else {
                            store.dispatch(openCall(info.nickname,info.avatar,info.id));
                        }
                    },()=>{
                        store.dispatch(closeDialog())
                    })
                }
            }]
        ))
    }

    let edit = (<View/>)
    let tool = (<View/>)

    if (info.id === global._user.id) {
        global._user = info
        edit = (
            <TouchableOpacity onPress={()=>{navigation.navigate("Edit",{info: info})}}>
                <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.edit) }} />
            </TouchableOpacity>
        )
    } else {
        tool = (<View style={styles.itemTool}>
            <>
                <TouchableOpacity style={styles.item} onPress={()=>{navigation.navigate("Chat",{info: info})}}>
                    <Text style={[styles.itemText,{color: "#054c86",width: width}]}>发消息</Text>
                </TouchableOpacity>
            </>
            <>
                <TouchableOpacity style={styles.item} onPress={onCall}>
                    <Text style={[styles.itemText,{color: "#054c86",width: width}]}>语音通话</Text>
                </TouchableOpacity>
            </>
        </View>)
    }

    useFocusEffect(
        React.useCallback(() => {
            global._page_name = 'Info'
            // 页面挂载事件，获取用户信息
            info.inputHeight = 40
            userInfo("?id="+info.id).then(res=>{
                if (res.code === 200) {
                    info.username = res.data.username
                    info.avatar = res.data.avatar
                    info.birthday = res.data.birthday
                    info.cover = res.data.cover
                    info.identity = res.data.identity
                    info.info = res.data.info
                    info.is_ban = res.data.is_ban
                    info.nickname = res.data.nickname
                    info.create_at = res.data.create_at
                    info.sex = res.data.sex
                    info.star = res.data.star
                    info.device = res.data.device
                    info.last_login = res.data.last_login
                    info.address = res.data.address
                    if (info.id === global._user.id) {
                        global._user = info
                        set("user", JSON.stringify(info));
                    }
                    store.dispatch({type: 'null'})
                }
            })
            return () => {};
        }, []),
    );

    // 点赞
    const onStar = () => {
        if (info.id === global._user.id) {
            global._user.star++
        } else {
            info.star++
        }
        star({id: info.id})
        store.dispatch({type: 'null'})
    }

    let tag = null
    switch (info.active) {
        case true:tag = styles.online;break;
        case false:tag = styles.offline;break;
    }
    if (info.is_ban) {
        tag = styles.black;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
            <View style={styles.bar}>
                <View style={styles.barLeft}>
                    <TouchableOpacity onPress={()=>{navigation.navigate("Home")}}>
                        <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.back) }} />
                    </TouchableOpacity>
                    <Text style={styles.title}>个人资料</Text>
                </View>
                {edit}
            </View>
            <ScrollView style={{height: height-60}}>
                <View style={{backgroundColor: '#fff'}}>
                    <Image source={{ uri: info.cover }} style={styles.bg} resizeMethod={'scale'} />
                    <View style={{backgroundColor: 'rgba(0,0,0,0.2)',width: '100%',height:150,position: 'absolute',left: 0,top: 0}}/>
                    <View style={styles.info}>
                        <View style={{flexDirection:'row'}}>
                            <Image style={styles.avatar} resizeMethod={'scale'} source={{uri: info.avatar}}/>
                            <View style={{justifyContent: 'space-around',height: 70}}>
                                <Text style={{ color: '#FFF',fontSize: 18,fontWeight: 'bold'}}>{info.nickname}</Text>
                                <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                    <View style={[styles.tag, tag]}/>
                                    <Text style={{color: '#666',fontSize:14}}>年龄 {getAge(info.birthday)}岁 <Text style={info.sex !== 0 ? info.sex === 1 ? {color: '#2fbce7'} : {color: '#fa76c8'} : {fontWeight: "normal"}}>{info.sex === 0 ? '保密' : info.sex === 1 ? '♂': '♀'}</Text></Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.5} onPress={onStar} style={{marginTop: -50,alignItems: 'center'}}>
                            <Image style={{width: 30,height: 30,marginBottom:-3}} resizeMethod={'scale'} source={{ uri: getIcon(icon.star) }}/>
                            <Text style={{color: '#fff',fontWeight: 'bold',fontSize: 12}}>{info.star}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemContent}>
                        <View style={styles.item}>
                            <Text style={styles.itemText}>邮箱</Text>
                            <Text style={styles.itemInfo}>{info.username}</Text>
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.itemText}>身份</Text>
                            <Text style={[styles.itemInfo,,{maxWidth:200}]} numberOfLines={1}>{info.identity??"无"}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.itemContent}>
                    <TouchableOpacity style={styles.item} onPress={()=>{navigation.navigate("UserCircle",{info: info})}}>
                        <Text style={styles.itemText}>圈子</Text>
                        <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={()=>{navigation.navigate("More",{info: info})}}>
                        <Text style={styles.itemText}>更多信息</Text>
                        <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                    </TouchableOpacity>
                </View>
                {tool}
            </ScrollView>
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
    },
    barLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
    },
    back: {
        width: 18,
        height: 18,
    },
    info: {
        marginTop: -60,
        paddingLeft: 20,
        paddingTop: 20,
        paddingRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avatar: {
        borderRadius: 50,
        width: 80,
        height: 80,
        borderWidth: 3,
        borderColor: '#fff',
        marginRight: 10,
    },
    tag: {
        width: 14,
        height: 14,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#fff',
        marginRight: 5,
    },
    online: {
        backgroundColor: '#21e31b',
    },
    offline: {
        backgroundColor: '#f00',
    },
    black: {
        backgroundColor: '#3e3e3e',
    },
    bg: {
        height: 150,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    itemContent: {
        backgroundColor: '#fff',
        marginTop: 10,
    },
    item: {
        paddingBottom: 15,
        paddingTop: 15,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
    },
    itemText: {
        color: "#000",
        fontSize: 16,
        textAlign: 'center',
    },
    itemInfo: {
        color: "#666",
        fontSize: 14,
    },
    itemTextArea:{
        paddingBottom: 15,
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
        maxHeight: 120
    },
    itemTool:{
        backgroundColor: '#fff',
        marginTop: 10,
        alignItems: 'center',
    }
});

export default connect(store => store)(Info);
