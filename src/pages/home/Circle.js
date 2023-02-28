import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, Dimensions,
} from 'react-native';

import {connect} from 'react-redux';
const {width} = Dimensions.get('window');
import {getIcon, icon} from '../../static/icon';
import {useFocusEffect} from '@react-navigation/native';
let statusBarColor = 'light-content'
let statusBarBackground = '#00000000'

const statusBarHeight = StatusBar.currentHeight;

// 圈子
const Circle = store => {
    let {navigation} = store
    //let { params:{info} } = store.route

    useFocusEffect(
        React.useCallback(() => {// 页面挂载事件
            global._page_name = 'Circle'
            statusBarColor = 'light-content'
            statusBarBackground = '#00000000'
            store.dispatch({type: 'null'});
            return () => {
                statusBarColor = 'dark-content'
                statusBarBackground = '#ffffff'
                store.dispatch({type: 'null'});
            };
        }, []),
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={statusBarColor} backgroundColor={statusBarBackground} />
            <View>
                <View style={styles.bar}>
                    <View style={styles.barLeft}>
                        <Text style={styles.title}>圈子</Text>
                        <TouchableOpacity onPress={()=>{navigation.navigate("Release")}}>
                            <Image style={{width: 20,height: 20}} resizeMethod={'scale'} source={{ uri: getIcon(icon.release_on) }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Image resizeMode={'cover'} style={{width: '100%',height: 240}} resizeMethod={'scale'} source={{ uri: global._user.cover }} />
                    <View style={{backgroundColor: 'rgba(0,0,0,0.2)',width: '100%',height:240,position: 'absolute',left: 0,top: 0}}/>
                    <View style={styles.info}>
                        <View style={{flexDirection:'row'}}>
                            <Image style={styles.avatar} resizeMethod={'scale'} source={{uri: global._user.avatar}}/>
                            <View style={{justifyContent: 'space-around',height: 60,marginTop: -5}}>
                                <Text style={{ color: '#FFF',fontSize: 18,fontWeight: 'bold'}}>{global._user.nickname}</Text>
                            </View>
                        </View>
                        <TouchableOpacity activeOpacity={0.5} style={{alignItems: 'center',flexDirection: 'row',marginTop: -30}}>
                            <Image style={{width: 30,height: 30,marginRight: 5}} resizeMethod={'scale'} source={{ uri: getIcon(icon.see) }}/>
                            <Text style={{color: '#fff',fontWeight: 'bold',fontSize: 14}}>10</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    bar: {
        // backgroundColor: '#fff',
        // borderBottomColor: '#dedede',
        // borderBottomWidth: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
        paddingTop: statusBarHeight,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 10,
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60+statusBarHeight,
        width: width,
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
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
        maxHeight: 120,
    },
    info: {
        marginTop: -60,
        paddingLeft: 20,
        paddingTop: 20,
        paddingRight: 20,
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
});

export default connect(store => store)(Circle);
