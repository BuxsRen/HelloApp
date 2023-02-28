import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    ToastAndroid, Dimensions,
} from 'react-native';

// 通讯录页
import {list} from '../../api/user';
import {connect} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {get, set} from "../../utils/Storage";
import {BackHandler} from "react-native";
import RNExitApp from 'react-native-exit-app';
import config from '../../config';
import {getIcon, icon} from '../../static/icon';
const {height} = Dimensions.get('window');

let page = 1 // 通讯录分页起始页
let listRefresh = false // 下拉刷新状态
let listText = '正在加载...' // 上拉加载文本
let loadStatus = false // 上拉刷新状态

// 通讯录
const Contacts = store => {
    const {ws} = store;
    const {navigation} = store

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'Contacts'
            // 页面卸载事件
            return () => {};
        }, []),
    );

    // 获取用户列表
    const getList = async () => {
        try {
            const res = await list("?page="+page)
            if (res.code === 200) {
                let userList = ws.list;
                let listId = []
                let listIndex = {}
                for (let i=0;i<userList.length;i++) {
                    listId.push(userList[i].id)
                }
                for (let i=0;i<res.data.items.length;i++) {
                    let item = res.data.items[i]
                    if (listId.indexOf(item.id) === -1) {
                        item.active = false;
                        item.spot = item.un_read_count
                        item.info = ''
                        item.message = []
                        item.page = 0
                        item.loadmore = true
                        userList.push(item);
                        listIndex[item.id] = userList.length-1
                    }
                }
                await set("list", JSON.stringify(userList))
                await set("listIndex", JSON.stringify(listIndex))
                store.dispatch({
                    type: 'list',
                    list: userList,
                    listIndex: listIndex,
                });
                // 连接websocket
                setTimeout(()=>{ global._socket.connect(store); },100)
                loadStatus = true // 释放上拉加载
                listText = "没有更多了"
            }
        } catch (e) {
            get('list').then(value => { // 加载本地数据
                get('listIndex').then(index => { // 加载本地数据
                    listText = "加载失败"
                    store.dispatch({
                        type: 'list',
                        list: JSON.parse(value),
                        listIndex: JSON.parse(index),
                    });
                    // 连接websocket
                    setTimeout(()=>{ global._socket.connect(store); },100)
                })
            });
            loadStatus = true // 释放上拉加载
        }
    };

    // info
    const toInfo = (item) => {
        navigation.navigate("Info",{info: item})
    }

    // 列表单个组件
    const renderItem = ({ item }) => (
        <TouchableOpacity key={item.id} onPress={()=>toInfo(item)}>
            <View style={styles.item}>
                <View style={{flexDirection: 'row'}}>
                    <View>
                        <Image style={styles.avatar} source={{uri: item.avatar}}/>
                        <View
                            style={[styles.tag, item.is_ban === 1 ? styles.black : item.active ? styles.online : styles.offline]}
                        />
                    </View>
                    <Text style={styles.name}>
                        { item.nickname == null ? item.username : item.nickname }
                    </Text>
                </View>
                <View style={[styles.spot, item.spot > 0 ? styles.spotActive : styles.spotDefault]}>
                    <Text style={{color: '#fff',fontSize: 12}}>{item.spot > 99 ? '99+' : item.spot}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    // 下拉刷新
    const _onRefresh = () => {
        if (!listRefresh) {
            listRefresh = true
            store.dispatch({type: 'null'});
            setTimeout(()=>{
                listRefresh = false
                global._socket.send({type: "list"})
            },2000)
        }
    }

    // 上拉加载
    const _onLoadMore = () => {
        if (listText !== "没有更多了" && loadStatus) {
            loadStatus = false // 锁定上拉加载
            page++
            getList()
        }
    }

    // 底部组件
    const _createListFooter = () => {
        return (
            <View style={{backgroundColor: '#fff', padding: 10}}>
                <Text style={{textAlign: 'center',color: '#000'}}>{listText}</Text>
            </View>
        )
    }

    // 重新登录重新加载通讯录列表
    if (global._isLogin) {
        global._isLogin = false
        page = 1
        getList()
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
            <View>
                <View style={styles.bar}>
                    <TouchableOpacity onPress={()=>{navigation.navigate("Setting")}}>
                        <Text style={styles.title}>{config.app.title}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row',alignItems: 'center'}}>
                        <TouchableOpacity onPress={()=>{navigation.navigate('Notif')}}>
                            <Image style={{ width: 26, height: 26,marginRight: 10}} source={{uri: getIcon(icon.notif)}}/>
                            <View style={[styles.tag,styles.offline,{width: 24,height: 16,left: -6,top: 12}]}>
                                <Text style={{color: '#FFF',textAlign: 'center',lineHeight: 15,fontSize: 12}}>10</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{navigation.navigate("Info",{info: global._user})}}>
                            <Image style={styles.avatar} resizeMethod={'scale'} source={{uri: global._user.avatar}}/>
                            <View style={[styles.tag, ws.online ? styles.online : styles.offline]}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <Text style={styles.listName}>通讯录({ws.list.length})</Text>
                    <FlatList
                        data={ws.list}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        style={{height: height-160}}
                        onRefresh={() => _onRefresh()}
                        refreshing={listRefresh}
                        onEndReached={() => _onLoadMore()}
                        onEndReachedThreshold={0.1}
                        ListFooterComponent={_createListFooter()}
                        getItemLayout={(data, index) => (
                            {length: 50, offset: 50 * index, index}
                        )}
                    />
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
        height: 60
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    avatar: {
        borderRadius: 50,
        width: 30,
        height: 30,
        marginRight: 15,
    },
    tag: {
        width: 9,
        height: 9,
        borderRadius: 50,
        position: 'absolute',
        left: 0,
        bottom: 0,
        borderWidth: 1,
        borderColor: '#fff',
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
    listName: {
        color: '#000',
        margin: 10,
    },
    item: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        justifyContent: "space-between",
        padding: 10,
        height: 50
    },
    spot: {
        borderRadius: 50,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 2,
        textAlign: 'center',
    },
    spotActive: {
        backgroundColor: '#f00'
    },
    spotDefault: {
        backgroundColor: '#fff'
    },
    name: {
        color: '#000',
        fontSize: 18,
    },
});

export default connect(store => store)(Contacts);
