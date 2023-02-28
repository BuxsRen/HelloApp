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
import {useFocusEffect} from "@react-navigation/native";

// 个人圈子
const UserCircle = store => {
    let {navigation} = store
    let { params:{info} } = store.route

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'UserCircle'
            // 页面卸载事件
            return () => {};
        }, []),
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
            <View>
                <View style={styles.bar}>
                    <View style={styles.barLeft}>
                        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.back) }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>{info.nickname}的圈子</Text>
                    </View>
                </View>
                <View>

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
        paddingRight: 15,
        paddingBottom: 10,
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        width: width,
    },
    barLeft: {
        flex: 1,
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
});

export default connect(store => store)(UserCircle);
