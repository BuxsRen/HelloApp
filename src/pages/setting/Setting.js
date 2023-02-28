import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Switch, ScrollView, Dimensions, NativeModules, PanResponder,
} from 'react-native';

import {connect} from 'react-redux';
import {set} from "../../utils/Storage";
import {closeDialog, openAlert, openLoad} from '../../store/modules/dialog';
const {width,height} = Dimensions.get('window');
import {getIcon, icon} from '../../static/icon';
import {useFocusEffect} from "@react-navigation/native";

// 设置页
const Setting = store => {
    let {navigation} = store

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'Setting'
            // 页面卸载事件
            return () => {};
        }, []),
    );

    const about = () => {
        navigation.navigate("About")
    }

    // 通知音效设置
    const SwitchTipsSound = () => {
        global._setting.tipsSound = !global._setting.tipsSound
        set("setting_tipsSoun",JSON.stringify(global._setting.tipsSound))
        store.dispatch({type:'null'})
    }

    // 通话铃声设置
    const SwitchCallSound = () => {
        global._setting.callSound = !global._setting.callSound
        set("setting_callSound",JSON.stringify(global._setting.callSound))
        store.dispatch({type:'null'})
    }

    // 回车键发送消息设置
    const SwitchEnter = () => {
        global._setting.enter = !global._setting.enter
        set("setting_enter",JSON.stringify(global._setting.enter))
        store.dispatch({type:'null'})
    }

    // 注销登录
    const logout = () => {
        store.dispatch(openAlert("注销登录","你确定要退出登录吗？",[{
            title: "取消",
            onClick: ()=> { store.dispatch({type: 'dialog_off'}) }
        },{
            title:"确定",
            onClick: () => {
                set('token', '')
                global._socket.close()
                store.dispatch({type: 'dialog_off'})
                navigation.navigate("Login")
                setTimeout(function () {
                    store.dispatch({ // 清空用户列表
                        type: 'list',
                        list: [],
                    });
                },10)
            }
        }]))
    }

    const clear = () => {
        store.dispatch(openAlert("清除聊天记录","你确定要清除本地所有聊天记录吗？",[{
            title: "取消",
            onClick: ()=> { store.dispatch({type: 'dialog_off'}) }
        },{
            title:"确定",
            onClick: () => {
                store.dispatch(openLoad("正在清理..."))
                const list = store.ws.list
                for (let i=0;i<list.length;i++) {
                    list[i].message = []
                    list[i].page = 0
                    list[i].loadmore = true
                    set("message_"+global._user.id+"_"+list[i].id, '[]')
                }
                setTimeout(()=>{
                    store.dispatch(openAlert("清除成功","已清除本地的所有聊天记录信息",[{
                        title: '好的',
                        onClick: () => { store.dispatch(closeDialog()) }
                    }]))
                },500)
            }
        }]))
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
            <View>
                <View style={styles.bar}>
                    <View style={styles.barLeft}>
                        <TouchableOpacity onPress={()=>{navigation.navigate("Home")}}>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.back) }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>设置</Text>
                    </View>
                </View>
                <ScrollView style={{height: height-70}}>
                    <View style={styles.itemContent}>
                        <TouchableOpacity style={styles.item} onPress={about}>
                            <Text style={styles.itemText}>关于</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemContent}>
                        <View style={styles.item}>
                            <Text style={styles.itemText}>回车键发送消息</Text>
                            <Switch
                                trackColor={{false: "#8d8d8d", true: "#32d53a"}}
                                thumbColor={global._setting.enter ? "#ffffff" : "#ffffff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={SwitchEnter}
                                value={global._setting.enter}
                                style={styles.onoff}
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.itemText}>消息音效</Text>
                            <Switch
                                trackColor={{false: "#8d8d8d", true: "#32d53a"}}
                                thumbColor={global._setting.tipsSound ? "#ffffff" : "#ffffff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={SwitchTipsSound}
                                value={global._setting.tipsSound}
                                style={styles.onoff}
                            />
                        </View>
                        <View style={styles.item}>
                            <Text style={styles.itemText}>通话铃声</Text>
                            <Switch
                                trackColor={{false: "#8d8d8d", true: "#32d53a"}}
                                thumbColor={global._setting.callSound ? "#ffffff" : "#ffffff"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={SwitchCallSound}
                                value={global._setting.callSound}
                                style={styles.onoff}
                            />
                        </View>
                    </View>
                    <View style={styles.itemContent}>
                        <TouchableOpacity style={styles.item} onPress={clear}>
                            <Text style={styles.itemText}>清除本地聊天记录</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.itemContent}>
                        <TouchableOpacity style={styles.item} onPress={logout}>
                            <Text style={styles.itemText}>注销登录</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
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
        paddingBottom: 10,
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        marginBottom: 10
    },
    barLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    back: {
        width: 18,
        height: 18,
        marginRight: 10,
    },
    itemContent: {
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    item: {
        paddingBottom: 15,
        paddingTop: 15,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: {
        color: "#000",
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10
    },
    onoff:{
        marginRight: 10,
    }
});

export default connect(store => store)(Setting);
