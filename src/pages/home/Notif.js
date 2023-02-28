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
import {useFocusEffect} from "@react-navigation/native";

// 我的消息
const Notif = store => {
    let {navigation} = store

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'Notif'
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
                        <Text style={styles.title}>我的消息</Text>
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
});

export default connect(store => store)(Notif);
