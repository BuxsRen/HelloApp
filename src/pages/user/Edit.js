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
import {getAge} from '../../utils/Utils';
import {useFocusEffect} from "@react-navigation/native";

// 编辑资料
const Edit = store => {
    let {navigation} = store
    let { params:{info} } = store.route

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'Edit'
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
                    <Text style={styles.title}>修改资料</Text>
                </View>
            </View>
            <ScrollView style={{height: height-60,paddingTop: 10}}>
                <View style={styles.itemContent}>
                    <View style={[styles.item,{justifyContent: 'center',rlignItems: 'center',backgroundColor: '#f1f1f1'}]}>
                        <TouchableOpacity  onPress={()=>navigation.navigate("EditItem",{title: '更换头像',info: info,value: 'avatar',type: 'images'})}>
                            <Image style={styles.avatar} resizeMethod={'scale'} source={{ uri: info.avatar }} />
                            <View style={styles.edit}>
                                <Image style={{width:12,height: 12}} resizeMethod={'scale'} source={{ uri: getIcon(icon.edit) }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate("EditItem",{title: '重设昵称',info: info,value: 'nickname',type: 'text'})}>
                        <Text style={styles.itemText}>昵称</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={[styles.itemInfo,{maxWidth:200}]} numberOfLines={1}>{info.nickname}</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.item,{alignItems: 'center'}]} onPress={()=>navigation.navigate("EditItem",{title: '更新封面',info: info,value: 'cover',type: 'images'})}>
                        <Text style={styles.itemText}>封面</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Image style={styles.cover} resizeMethod={'scale'} source={{ uri: info.cover }} />
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate("EditItem",{title: '选择身份',info: info,value: 'identity',type: 'select'})}>
                        <Text style={styles.itemText}>身份</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={[styles.itemInfo,{maxWidth:200}]} numberOfLines={1}>{info.identity??"无"}</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate("EditItem",{title: '选择性别',info: info,value: 'sex',type: 'select'})}>
                        <Text style={styles.itemText}>性别</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={styles.itemInfo}>{info.sex === 0 ? '保密' : info.sex === 1 ? '男' : "女"}</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate("EditItem",{title: '更新生日',info: info,value: 'birthday',type: 'time'})}>
                        <Text style={styles.itemText}>年龄</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={styles.itemInfo}>{getAge(info.birthday)} 岁</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.item} onPress={()=>navigation.navigate("EditItem",{title: '选择地区',info: info,value: 'address',type: 'address'})}>
                        <Text style={styles.itemText}>地区</Text>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <Text style={styles.itemInfo}>{info.address??'未设置'}</Text>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor: '#fff',marginBottom: 10,paddingTop: 10}}>
                    <View style={styles.itemContent}>
                        <TouchableOpacity style={styles.itemTextArea} onPress={()=>navigation.navigate("EditItem",{title: '修改个人简介',info: info,value: 'info',type: 'textarea'})}>
                            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                                <Text style={{color: "#000", fontSize: 16,fontWeight: 'bold'}}>个人简介</Text>
                                <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.right) }} />
                            </View>
                            <Text style={[styles.itemInfo,{marginTop: 10}]} numberOfLines={4}>{info.info??'这个人很懒，什么都没有写'}</Text>
                        </TouchableOpacity>
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
    avatar:{
        width: 80,
        height: 80,
        borderRadius: 50,
    },
    edit:{
        backgroundColor: '#fff',
        borderRadius: 50,
        height: 22,
        width: 22,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    cover: {
        width: 60,
        height: 38,
    },
    right: {
        marginLeft: 5,
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

export default connect(store => store)(Edit);
