import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, Dimensions, Switch, ScrollView, Linking, ToastAndroid,
} from 'react-native';

import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window');
import {getIcon, icon} from '../../static/icon';
import config from '../../config';
import {update2} from '../../api/app';
import {closeDialog, openAlert} from '../../store/modules/dialog';
import {useFocusEffect} from "@react-navigation/native";

// 关于
const About = store => {
    let {navigation} = store

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'About'
            // 页面卸载事件
            return () => {};
        }, []),
    );

    const checkUpdate = () => {
        update2("?version="+config.app.number).then(res=>{
            if (res.code === 200) {
                store.dispatch(openAlert("检查到新版本",res.data,[{
                    title: '前往更新',
                    onClick: ()=>{
                        Linking.openURL(config.server.host+"/hello/").catch(err => alert(err)).done(()=>{store.dispatch(closeDialog())});
                        init()
                    }
                }]))
            } else {
                ToastAndroid.show('已是最新版本', ToastAndroid.SHORT)
            }
        })
    }

    const openUrl = () => {
        Linking.openURL(config.server.host+"/hello/").catch(err => alert(err))
    }

    const openGit = () => {
        Linking.openURL("https://github.com/BuxsRen/HelloApp").catch(err => alert(err))
    }

    const openBreak = () => {
        Linking.openURL("https://qm.qq.com/cgi-bin/qm/qr?k=hEGXfitAh2M7PPIYqUqTnFXrMJRnyR7D&noverify=0").catch(err => alert(err))
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
            <View>
                <View style={styles.bar}>
                    <View style={styles.barLeft}>
                        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.back) }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>关于</Text>
                    </View>
                </View>
                <ScrollView style={{height: height-100}}>
                    <View style={{justifyContent: 'center',alignItems: 'center',marginTop: 50,marginBottom: 50}}>
                        <Text style={{color: '#000',fontSize: 30,fontWeight: 'bold'}}>Hello</Text>
                        <Text style={{color: '#000'}}>Version {config.app.version}</Text>
                    </View>
                    <View style={styles.itemContent}>
                        <TouchableOpacity style={styles.item} onPress={checkUpdate}>
                            <Text style={styles.itemText}>检查更新</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} onPress={openUrl}>
                            <Text style={styles.itemText}>访问官网</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} onPress={openGit}>
                            <Text style={styles.itemText}>项目源码</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item} onPress={openBreak}>
                            <Text style={styles.itemText}>联系Break</Text>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={[styles.itemInfo,{maxWidth:200}]} numberOfLines={1}>QQ:441479573</Text>
                                <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <View style={{position: 'absolute',bottom: -25,width: '100%'}}>
                    <Text style={{textAlign:'center',fontSize: 12}}>Copyright 2022-{new Date().getFullYear()} Break All Right Reserved.</Text>
                </View>
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
});

export default connect(store => store)(About);
