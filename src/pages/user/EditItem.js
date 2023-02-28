import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity, Dimensions, ScrollView, TextInput
} from 'react-native';

import {connect} from 'react-redux';
const {width,height} = Dimensions.get('window');
import {getIcon, icon} from '../../static/icon';
import {updateUser, uploadImages} from '../../api/user';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'
import { AlphabetList } from "react-native-section-alphabet-list";
import {City} from '../../utils/City';
let text = null

// 修改资料
const EditItem = store => {
    let {navigation} = store
    let { params:{title,info,value,type} } = store.route

    useFocusEffect(
        React.useCallback(() => {// 页面挂载事件
            global._page_name = 'EditItem'
            text = info[value]
            return () => {
                info[value] = text
                store.dispatch({type: 'null'})
            };
        }, []),
    );

    // 更新资料，需要更新的字段,需要更新的值
    const update = () => {
        let obj = {}
        obj[value] = info[value]
        if (text !== info[value]) {
            updateUser(obj).then(res=>{
                text = info[value]
                setTimeout(()=>{
                    navigation.goBack()
                },600)
            })
        } else {
            navigation.goBack()
        }
    }

    // 输入框改变
    const onChange = (text) =>{
        info[value] = text
        store.dispatch({type: 'null'})
    }

    // 性别选择
    const sex = () => {
        const sexList = ['保密','男生','女生'];
        return (
            <ScrollView style={{backgroundColor: '#fff'}}>
                {
                    sexList.map((item,index)=>{
                        const active = info[value] === index ? (<Image style={styles.selectActive} resizeMethod={'scale'} source={{ uri: getIcon(icon.active) }} />) : null
                        return (
                            <TouchableOpacity style={styles.select} key={index} onPress={()=>{ info[value] = index;store.dispatch({type: 'null'}) }}>
                                <Text style={styles.selectText}>{item}</Text>
                                {active}
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>)
    }

    // 身份选择
    const identity = () => {
        const identityList = ['CEO/创始人/资本家','IT/互联网/程序员/运维/发烧友','作家/画家/艺术','公务员/党员/律师/法务/工农','医生/护士/制药','服务/商业/个体/广告/传媒','模特/艺人/音乐/表演/二次元','老师/教育/培训','学生','自由职业','其他'];
        return (
        <ScrollView style={{backgroundColor: '#fff'}}>
            {
                identityList.map((item,index)=>{
                    const active = info[value] === item ? (<Image style={styles.selectActive} resizeMethod={'scale'} source={{ uri: getIcon(icon.active) }} />) : null
                    return (
                        <TouchableOpacity style={styles.select} key={index} onPress={()=>{ info[value] = item;store.dispatch({type: 'null'}) }}>
                            <Text style={styles.selectText}>{item}</Text>
                            {active}
                        </TouchableOpacity>
                        )
                    })
            }
        </ScrollView>)
    }

    // 时间选择
    const time = () => {
        return (<DatePicker
            mode={"date"}
            style={{width: width, backgroundColor: '#fff'}}
            textColor={'#000'}
            maximumDate={new Date()}
            minimumDate={new Date(0)}
            androidVariant={"nativeAndroid"}
            date={new Date(info[value]*1000)}
            onDateChange={(date)=>{
                info[value] = parseInt(date.getTime()/1000)
            }}
        />)
    }

    const addressAvactive = (item) => {
        return info[value] === item ? (<Image style={styles.selectActive} resizeMethod={'scale'} source={{ uri: getIcon(icon.active) }} />) : null
    }

    const address = () => {
        return (
            <AlphabetList
                style={{height: height-70}}
                data={City}
                indexLetterStyle={{color: '#000', fontSize: 14}}
                indexContainerStyle={{width: 24}}
                indexLetterContainerStyle={{width: 24, height: 20}}
                renderCustomSectionHeader={(section) => (
                    <Text style={{color: '#666',marginLeft: 10}}>{section.title}</Text>
                )}
                renderCustomItem={(item) => ( // 列表单个组件
                    <TouchableOpacity onPress={()=>{ info[value] = item.city;store.dispatch({type: 'null'}) }} style={styles.city}>
                        <View>
                            <Text style={{color: '#000',fontSize: 0}}>{item.value}</Text>
                            <Text style={{color: '#000'}}>{item.city}</Text>
                        </View>
                        {addressAvactive(item.city)}
                    </TouchableOpacity>
                )}
            />
        )
    }


    // 上传图片
    const updateAvatar = (response) => {
        if (response.assets.length > 0) {
            const file = response.assets[0]
            let fromData = new FormData()
            fromData.append("file",{uri:file.uri, type: 'multipart/form-data', name: file.fileName});
            fromData.append("format", 'images')
            uploadImages(fromData).then(res=>{
                if (res.code === 200) {
                    info[value] = res.data
                }
            })
        }
    }

    // 打开相册
    const openImageLibrary = () => {
        launchImageLibrary({mediaType: 'photo'}).then((response) => {
            updateAvatar(response)
        });
    }

    // 打开相机
    const openCamera = () => {
        launchCamera({mediaType: 'photo'}).then((response) => {
            updateAvatar(response)
        });
    }

    // 图片更换
    const images = () => {
        return (
            <ScrollView style={{marginTop: -10}}>
                <Image style={styles.avatar} resizeMethod={'scale'} source={{ uri: info[value] }} />
                <View style={{alignItems: 'center',marginBottom: 100}}>
                    <TouchableOpacity style={styles.btn} onPress={openImageLibrary}>
                        <Text style={styles.title}>相册选择</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={openCamera}>
                        <Text style={styles.title}>拍摄</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            )
    }

    let html = (<Text>none</Text>)
    switch (type) {
        case 'text':
            html = (<TextInput autoFocus={true} value={info[value]} onChangeText={text => { onChange(text) }} clearButtonMode={"always"} selectionColor={"#fda645"} maxLength={10}  style={styles.input} />);break;
        case 'textarea':
            html = (<TextInput multiline={true} autoFocus={true} value={info[value]} onChangeText={text => { onChange(text) }} textAlignVertical={"top"} clearButtonMode={"always"} selectionColor={"#fda645"} maxLength={180}  style={[styles.input,{height: 180}]} />);break;
        case 'select':
            if (value === "sex") {
                html = sex();break;
            } else {
                html = identity();break;
            }
        case 'time':html = time();break;
        case 'address':html = address();break;
        case 'images':html = images();break;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
            <View style={styles.bar}>
                <View style={styles.barLeft}>
                    <TouchableOpacity style={{width: 60}} onPress={()=>{navigation.goBack()}}>
                        <Image style={styles.back} resizeMethod={'scale'} source={{ uri: getIcon(icon.back) }} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity style={{width: 60,flexDirection: 'row-reverse'}} onPress={update}>
                        <Text style={styles.title}>完成</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{marginTop: 10}}>
                {html}
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
    },
    barLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
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
    input: {
        width: width,
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor: '#FFF',
        color: '#000',
    },
    select: {
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectText:{
        color: '#000',
        marginTop: 5,
        marginBottom: 5,
        fontSize: 14,
    },
    selectActive: {
        width: 24,
        height: 24,
    },
    avatar:{
        width: '100%',
        height: 360,
    },
    btn:{
        width: '80%',
        height: 40,
        backgroundColor: '#fff',
        borderColor: '#d0d0d0',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        borderRadius: 2,
    },
    city: {
        backgroundColor: '#fff',
        padding: 10,
        borderBottomColor: '#f1f1f1',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

export default connect(store => store)(EditItem);
