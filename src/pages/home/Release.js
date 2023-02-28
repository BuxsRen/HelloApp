import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, Dimensions, Switch, ScrollView, Linking, ToastAndroid, TextInput,
} from 'react-native';

import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window');
import {getIcon, icon} from '../../static/icon';
import {useFocusEffect} from "@react-navigation/native";

// 发布圈子
const Release = store => {
    let {navigation} = store

    useFocusEffect(
        // 页面挂载事件
        React.useCallback(() => {
            global._page_name = 'Release'
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
                        <TouchableOpacity style={{width: 60}} onPress={()=>{navigation.goBack()}}>
                            <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.back) }} />
                        </TouchableOpacity>
                        <Text style={styles.title}>发布圈子</Text>
                        <TouchableOpacity style={{width: 60,flexDirection: 'row-reverse'}} >
                            <Text style={styles.title}>发布</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TextInput placeholder={"想到什么就说什么吧..."} multiline={true} autoFocus={true} textAlignVertical={"top"} clearButtonMode={"always"} selectionColor={"#fda645"} maxLength={180} style={[styles.input,{height: 180}]} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        marginTop: global._statusBarHeight,
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
        justifyContent: 'space-between',
        flex: 1,
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
    input: {
        width: width,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor: '#FFF',
    },
});

export default connect(store => store)(Release);
