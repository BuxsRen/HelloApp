import React from 'react';
import {
    Linking,
    NativeModules,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    ToastAndroid
} from 'react-native';
import {get, set} from '../utils/Storage';
import {connect} from "react-redux";
import {useFocusEffect} from '@react-navigation/native';
import {userInfo} from '../api/user';
import config from '../config';
import {closeDialog, openAlert} from '../store/modules/dialog';
import {update} from '../api/app';
const Utils = NativeModules.Utils

// 欢迎页
const Welcome = (store) => {

    let {navigation} = store

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'Welcome'
            // 页面卸载事件
            return () => {};
        }, []),
    );

    const init = () => {
        get('token').then(token => {
            if (token != null && token !== "") {
                global._token = token
                get("user").then(value => {
                    global._user = JSON.parse(value)
                    // 获取用户信息
                    let {manufacturer,product,release} = config.app
                    userInfo("?id="+global._user.id+"&manufacturer="+manufacturer+"&product="+product+"&release="+release).then(res=>{
                        if (res.code === 200) {
                            res.data.active = false;
                            global._user = res.data
                            set("user", JSON.stringify(global._user));
                        } else {
                            set("token","")
                            set("user","")
                            global._user = null
                            const msg = res.code === -38 ? "该账号已被禁止登录" : "用户登录信息失效，请重新登录";
                            ToastAndroid.show(msg, ToastAndroid.SHORT)
                        }
                        global._isLogin = true
                        if (global._user != null) {
                            setTimeout(()=>{
                                navigation.navigate('Home');
                            },500)
                        } else {
                            navigation.navigate('Login');
                        }
                    }).catch(()=>{
                        ToastAndroid.show("无法连接到服务器，账号离线", ToastAndroid.SHORT)
                        setTimeout(() => {
                            global._isLogin = true
                            navigation.navigate('Home');
                            //navigation.navigate('Login');
                        }, 500);
                    })
                });
            } else {
                setTimeout(() => {
                    navigation.navigate('Login');
                }, 500);
            }
        });
    }

    useFocusEffect(React.useCallback(() => { // 页面挂载事件
        global._page_name = 'Welcome'

        Utils.getVersionNumber().then(version=>{
            update("?version="+version).then(res=>{
                if (res.code === 200) {
                    store.dispatch(openAlert("检查到新版本",res.data,[{
                        title: '前往更新',
                        onClick: ()=>{
                            Linking.openURL(config.server.host+"/hello/").catch(err => alert(err)).done(()=>{store.dispatch(closeDialog())});
                            init()
                        }
                    }]))
                } else {
                    init()
                }
            }).catch(e => {
                init()
            })
        })
        // 页面卸载事件
        return () => {};
    }, []));



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar translucent={true} barStyle="dark-content" backgroundColor="#FFF"/>
            <Text style={styles.title}>Hello</Text>
            <Text style={styles.desc}>Hello For Android</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    title: {
        color: '#000',
        fontSize: 48,
        fontWeight: 'bold',
    },
    desc: {
        color: '#555',
        fontSize: 12,
    },
});

export default connect(store => store)(Welcome);
