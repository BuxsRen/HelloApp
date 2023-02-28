import React from "react";
import {
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TextInput,
    ToastAndroid,
} from "react-native";
import { connect } from "react-redux";
import {getCode,getEmaliCode,register} from '../../api/user'

import {openVerif} from '../../store/modules/dialog'
import {useFocusEffect} from "@react-navigation/native";

let id,username,code,password,repeat

// 注册页
const Register = (store) => {

    const { navigation } = store;

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'Register'
            // 页面卸载事件
            return () => {};
        }, []),
    );

    // 提交注册
    const submit = () => {
        if (username == null || password == null || repeat == null || code == null) {
            return
        }
        const data = { username, password, repeat, code }
        register(data).then(res=>{
            if (res.code === 200) {
                ToastAndroid.show(res.msg, ToastAndroid.SHORT);
                setTimeout(()=>{
                    navigation.navigate('Login');
                },1000)
            } else {
                ToastAndroid.show(res.msg, ToastAndroid.SHORT);
            }
        })
    };

    //获取邮箱验证码
    const getEmali = (verif) => {
        if (verif == null || verif ==='') {
            return
        }
        getEmaliCode({username,code:verif,id}).then(res=>{
            if (res.code === 200) {
                ToastAndroid.show('邮箱验证码发送成功', ToastAndroid.SHORT);
                store.dispatch({type: 'dialog_off'})
            }
            ToastAndroid.show(res.msg, ToastAndroid.SHORT);
        })
    }

    // 打开人机验证
    const Verif = () => {
        if (username == null) {
            return
        }
        getCode().then(res=>{
            if (res.code === 200) {
                const {thumb} = res.data
                id = res.data.id
                setTimeout(()=>{
                    store.dispatch(openVerif(thumb,Verif,getEmali))
                },500)
            } else {
                ToastAndroid.show(res.msg, ToastAndroid.SHORT);
            }
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <View>
                <Text style={styles.title}>Hello,注册</Text>
                <TextInput maxLength={30} style={styles.input} placeholder={"邮箱"} keyboardType={"email-address"} onChangeText={text => {username = text}} selectionColor={"#fda645"} />
                <View style={styles.code}>
                    <TextInput maxLength={6} style={[styles.input,{width:220}]} placeholder={"邮箱验证码"} onChangeText={text => {code = text}} selectionColor={"#fda645"} />
                    <TouchableOpacity style={{width:75}} onPress={Verif}>
                        <Text style={{textAlign: 'center',fontSize:15}}>获取</Text>
                    </TouchableOpacity>
                </View>
                <TextInput maxLength={18} style={styles.input} placeholder={"密码"} onChangeText={text => password = text} selectionColor={"#fda645"} secureTextEntry={true} />
                <TextInput keyboardType={"visible-password"} maxLength={18} style={styles.input} placeholder={"确认密码"} onChangeText={text => repeat = text} selectionColor={"#fda645"} secureTextEntry={true} />
                <TouchableOpacity activeOpacity={0.5} style={styles.submit} onPress={submit}>
                    <Text style={styles.text}>注 册</Text>
                </TouchableOpacity>
            </View>
            <View style={{paddingBottom: 10}}>
                <Text style={{color: '#000',fontSize: 12}}>
                    <TouchableOpacity onPress={()=>{navigation.navigate('Login');}}><Text>返回登录</Text></TouchableOpacity>
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingTop: 100,
        alignItems: "center",
        backgroundColor: "#FFF",
        marginTop: global._statusBarHeight
    },
    title: {
        fontSize: 28,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        width: 300,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor: '#F6F6F6',
    },
    submit: {
        borderRadius: 10,
        alignItems: "center",
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
    code:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default connect(store => store)(Register);
