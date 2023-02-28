import React from "react";
import {
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  ToastAndroid
} from "react-native";
import { connect } from "react-redux";
import {set} from "../../utils/Storage";
import {login} from '../../api/user'
import {openAlert, openLoad} from "../../store/modules/dialog";
import config from '../../config';
import {useFocusEffect} from "@react-navigation/native";

let name,pwd

// 登录页
const Login = (store) => {

  useFocusEffect(
      // 页面挂载事件
      React.useCallback(() => {
        global._page_name = 'Login'
        // 页面卸载事件
        return () => {};
      }, []),
  );

  const { navigation } = store;

  const submit = () => {
    if (name == null || pwd == null) {
      return
    }
    let {manufacturer,product,release} = config.app
    const data = { username: name, password: pwd, manufacturer, product, release}
    login(data).then(res=>{
      if (res.code === 200) {
        let {token} = res.data
        set("token", token);
        set("user", JSON.stringify(res.data));
        global._token = token
        res.data.active = false;
        global._user = res.data
        global._isLogin = true
        navigation.navigate('Home');
      } else {
        ToastAndroid.show(res.msg, ToastAndroid.SHORT);
      }
    })
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View>
        <Text style={styles.title}>Hello,登录</Text>
        <TextInput maxLength={18} keyboardType={"email-address"}  style={styles.input} placeholder={"用户名"} onChangeText={text => { name = text }} selectionColor={"#fda645"} />
        <TextInput maxLength={18} style={styles.input} placeholder={"密码"} onChangeText={text => pwd = text } selectionColor={"#fda645"} secureTextEntry={true} />
        <TouchableOpacity activeOpacity={0.5} style={styles.submit} onPress={submit}>
          <Text style={styles.text}>登 录</Text>
        </TouchableOpacity>
      </View>
      <View style={{paddingBottom: 10}}>
        <Text style={{color: '#000',fontSize: 12}}>
          <TouchableOpacity onPress={()=>{navigation.navigate('Register');}}><Text>注册账号</Text></TouchableOpacity>
          <TouchableOpacity><Text>  |  </Text></TouchableOpacity>
          <TouchableOpacity onPress={()=>{
            store.dispatch(openAlert("找回密码",'该功能待开发...',[{title: '知道了',onClick: ()=>{
                store.dispatch({type: 'dialog_off'})
              }}]))
          }}><Text>找回密码</Text></TouchableOpacity>
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
    color: '#000',
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
  }
});

export default connect(store => store)(Login);
