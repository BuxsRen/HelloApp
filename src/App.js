import * as React from 'react';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Provider} from 'react-redux';
import store from './store/store';

const Stack = createNativeStackNavigator();

import Init from './server/Init';
import Dialog from './utils/Dialog'
import Welcome from './pages/Welcome';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Contacts from './pages/home/Contacts';
import Circle from './pages/home/Circle';
import UserCircle from './pages/home/UserCircle';
import Notif from './pages/home/Notif';
import Release from './pages/home/Release';
import Chat from './pages/home/Chat';
import Info from './pages/user/Info';
import More from './pages/user/More';
import Edit from './pages/user/Edit';
import EditItem from './pages/user/EditItem';
import Setting from './pages/setting/Setting';
import About from './pages/setting/About';
import {BackHandler, Image, StyleSheet, Text, ToastAndroid} from 'react-native';
import {getIcon, icon} from './static/icon';
import RNExitApp from "react-native-exit-app";

const Tab = createBottomTabNavigator();

let lastBackPressed = 0;

// 监听返回键 true 表示阻止返回事件
const onBackAndroid = () => {
    // 全屏弹窗展示
    if (global._dialog_show) {
        // 关闭弹窗
        if (global._dialog_type === 'alert') {
            store.dispatch({type: 'dialog_off'})
            return true;
        }
        // 拦截返回键
        if (global._dialog_type === 'call') { // 通话页面
            return true;
        }
        // if (global._dialog_type === 'mini') { // 通话最小化状态
        //     return false;
        // }
    }
    // 退出应用
    if (global._page_name === 'Circle' || global._page_name === 'Contacts' || global._page_name === 'Login') {
        if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
            RNExitApp.exitApp();
            return false;
        }
        lastBackPressed = Date.now();
        ToastAndroid.show("再按一次退出应用", ToastAndroid.SHORT);
        return true;
    }
    return false;
}

function TabMenu() {
    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            BackHandler.addEventListener('hardwareBackPress', onBackAndroid); // 监听返回键
            // 页面卸载事件
            return () => {
                //BackHandler.removeEventListener('hardwareBackPress',onBackAndroid)
            };
        }, []),
    );

    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    if (route.name === 'Contacts') {
                        const iconName = focused ? icon.contacts_on : icon.contacts_off
                        return <Image style={styles.icon} resizeMethod={'scale'} source={{uri: getIcon(iconName)}}/>
                    } else {
                        const iconName = focused ? icon.circle_on : icon.circle_off
                        return <Image style={styles.icon} resizeMethod={'scale'} source={{uri: getIcon(iconName)}}/>
                    }
                },
                tabBarLabel: ({focused}) => {
                    if (route.name === 'Contacts') {
                        const color = focused ? '#fda645' : '#000'
                        return <Text style={{color: color}}>通讯录</Text>
                    } else {
                        const color = focused ? '#fda645' : '#000'
                        return <Text style={{color: color}}>圈子</Text>
                    }
                },
                tabBarActiveTintColor: '#FDA645FF',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {height: 60, borderTopWidth: 0},
                headerShown: false,
            })}
            initialRouteName="Contacts"
        >
            <Tab.Screen name="Circle" component={Circle}/>
            <Tab.Screen name="Contacts" tabBarLabel="通讯录" title="通讯录" component={Contacts}/>
        </Tab.Navigator>
    )
}

// 应用首页
const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{headerShown: false}}
                    initialRouteName="Welcome"
                >
                    <Stack.Screen
                        name="Welcome"
                        component={Welcome}
                        options={{title: '欢迎', animation: 'default'}}
                    />
                    <Stack.Screen
                        name="Login"
                        component={Login}
                        options={{title: '登录', animation: 'default'}}
                    />
                    <Stack.Screen
                        name="Register"
                        component={Register}
                        options={{title: '注册', animation: 'default'}}
                    />
                    <Stack.Screen
                        name="Home"
                        component={TabMenu}
                        options={{title: '首页', animation: 'default'}}
                    />
                    <Stack.Screen
                        name="Chat"
                        component={Chat}
                        options={{title: '聊天页', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="UserCircle"
                        component={UserCircle}
                        options={{title: '个人圈子', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="Notif"
                        component={Notif}
                        options={{title: '我的消息', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="Release"
                        component={Release}
                        options={{title: '发布圈子', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="Info"
                        component={Info}
                        options={{title: '个人中心', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="More"
                        component={More}
                        options={{title: '更多信息', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="Edit"
                        component={Edit}
                        options={{title: '编辑资料', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="EditItem"
                        component={EditItem}
                        options={{title: '编辑资料子项', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="Setting"
                        component={Setting}
                        options={{title: '设置', animation: 'slide_from_right'}}
                    />
                    <Stack.Screen
                        name="About"
                        component={About}
                        options={{title: '关于', animation: 'slide_from_right'}}
                    />
                </Stack.Navigator>

                <Init/>
                <Dialog/>
            </NavigationContainer>
        </Provider>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 26,
        height: 26,
    }
})

export default App;
