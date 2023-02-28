import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, Dimensions, ScrollView,
} from 'react-native';

import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window');
import {getIcon, icon} from '../../static/icon';
import {timeToStr, ToTime} from '../../utils/Utils';
import {getAge} from '../../utils/Utils';
import {useFocusEffect} from "@react-navigation/native";

// 更多
const More = store => {
    let {navigation} = store
    let { params:{info} } = store.route

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'More'
            // 页面卸载事件
            return () => {};
        }, []),
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
            <View style={styles.bar}>
                <View style={styles.barLeft}>
                    <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                        <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.back) }} />
                    </TouchableOpacity>
                    <Text style={styles.title}>个人资料</Text>
                </View>
            </View>
            <ScrollView style={{height: height-60,paddingTop: 10}}>
                <View style={styles.itemContent}>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>邮箱</Text>
                        <Text style={styles.itemInfo}>{info.username}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>昵称</Text>
                        <Text style={[styles.itemInfo,{maxWidth:200}]} numberOfLines={1}>{info.nickname}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>身份</Text>
                        <Text style={[styles.itemInfo,{maxWidth:200}]} numberOfLines={1}>{info.identity??"无"}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>地区</Text>
                        <Text style={styles.itemInfo}>{info.address ?? '未设置'}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>性别</Text>
                        <Text style={styles.itemInfo}>{info.sex === 0 ? '保密' : info.sex === 1 ? '男' : "女"}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>年龄</Text>
                        <Text style={styles.itemInfo}>{getAge(info.birthday)} 岁</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>H龄</Text>
                        <Text style={styles.itemInfo}>{ToTime(info.create_at*1000)}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>星星</Text>
                        <Text style={styles.itemInfo}>{info.star} 颗</Text>
                    </View>
                </View>
                <View style={styles.itemContent}>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>账号状态</Text>
                        <Text style={styles.itemInfo}>{info.is_ban === 0 ? '正常' : "封禁"}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>在线状态</Text>
                        <Text style={styles.itemInfo}>{info.active === true ? '在线' : '离线'}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>注册时间</Text>
                        <Text style={styles.itemInfo}>{timeToStr(info.create_at,'yyyy-mm-dd')}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>登录设备</Text>
                        <Text style={styles.itemInfo}>{info.device ?? "Android"}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.itemText}>上次登录</Text>
                        <Text style={styles.itemInfo}>{ToTime(info.last_login*1000) + '前'}</Text>
                    </View>
                </View>
                <View style={{backgroundColor: '#fff',marginBottom: 10,paddingTop: 10}}>
                    <View style={styles.itemContent}>
                        <View style={styles.itemTextArea}>
                            <Text style={{color: "#000", fontSize: 16,fontWeight: 'bold'}}>个人简介</Text>
                            <Text style={[styles.itemInfo,{marginTop: 10}]} numberOfLines={4}>{info.info??'这个人很懒，什么都没有写'}</Text>
                        </View>
                    </View>
                </View>
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
    back: {
        width: 18,
        height: 18,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
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
        paddingLeft: 10,
        paddingRight: 10,
        maxHeight: 120,
    },
});

export default connect(store => store)(More);
