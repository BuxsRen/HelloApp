package com.buxsren.hello.utils;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;

import com.alibaba.fastjson.JSON;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class Utils extends ReactContextBaseJavaModule {

    public static ReactApplicationContext reactContext;

    public Utils(ReactApplicationContext reactContext) {
        super(reactContext);
        Utils.reactContext = getReactApplicationContext();
    }

    @Override
    public String getName() {
        return "Utils";
    }

    private static final char[] HEXES = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};

    // 取应用版本号
    @ReactMethod
    public void getVersionNumber(Promise promise) throws PackageManager.NameNotFoundException {
        PackageManager packageManager = Global.packageManager;
        PackageInfo packInfo = packageManager.getPackageInfo("com.buxsren.hello",0); // 0代表是获取版本信息
        promise.resolve(packInfo.versionCode);
    }

    // 取应用版本号
    @ReactMethod
    public void getVersionName(Promise promise) throws PackageManager.NameNotFoundException {
        PackageManager packageManager = Global.packageManager;
        PackageInfo packInfo = packageManager.getPackageInfo("com.buxsren.hello",0); // 0代表是获取版本信息
        promise.resolve(packInfo.versionName);
    }

    // 取应用名称
    @ReactMethod
    public static void getAppName(Promise promise) {
        String Name ;
        try {
            Name=Global.packageManager.getApplicationLabel(Global.packageManager.getApplicationInfo("com.buxsren.hello",PackageManager.GET_META_DATA)).toString();
        } catch (PackageManager.NameNotFoundException e) {
            Name = "" ;
        }
        promise.resolve(Name);
    }

    // 获取设备信息
    @ReactMethod
    public static void getDeviceInfo(Promise promise) {
        Map<String,Object> param = new HashMap<>();
        param.put("device",android.os.Build.DEVICE); // 设备名
        param.put("board",android.os.Build.BOARD); // 主板名
        param.put("model",android.os.Build.MODEL); // 手机型号
        param.put("manufacturer",android.os.Build.MANUFACTURER); // 获取厂商名
        param.put("product",android.os.Build.PRODUCT); // 产品名
        param.put("brand",android.os.Build.BRAND); // 手机品牌
        param.put("hardware",android.os.Build.HARDWARE); // 硬件名
        param.put("host",android.os.Build.HOST); // 主机
        param.put("display",android.os.Build.DISPLAY); // 显示id
        param.put("id",android.os.Build.ID); // id
        param.put("user",android.os.Build.USER); // 用户名
        param.put("sdk_int",android.os.Build.VERSION.SDK_INT); // sdk
        param.put("release",android.os.Build.VERSION.RELEASE); // 安卓版本
        promise.resolve(JSON.toJSONString(param));
    }

    /**
     * byte数组 转换成 16进制小写字符串
     */
    public static String bytes2Hex(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            return null;
        }
        bytes = Utils.gZip(bytes);
        StringBuilder hex = new StringBuilder();
        for (byte b : bytes) {
            hex.append(HEXES[(b >> 4) & 0x0F]);
            hex.append(HEXES[b & 0x0F]);
        }
        return hex.toString();
    }

    /**
     * 16进制字符串 转换为对应的 byte数组
     */
    public static byte[] hex2Bytes(String hex) {
        if (hex == null || hex.length() == 0) {
            return null;
        }
        char[] hexChars = hex.toCharArray();
        byte[] bytes = new byte[hexChars.length / 2];   // 如果 hex 中的字符不是偶数个, 则忽略最后一个
        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = (byte) Integer.parseInt("" + hexChars[i * 2] + hexChars[i * 2 + 1], 16);
        }
        return Utils.unGZip(bytes);
    }

    /***
     * 压缩GZip
     *
     * @param data
     * @return
     */
    public static byte[] gZip(byte[] data) {
        byte[] b = null;
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            GZIPOutputStream gzip = new GZIPOutputStream(bos);
            gzip.write(data);
            gzip.finish();
            gzip.close();
            b = bos.toByteArray();
            bos.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return b;
    }

    /***
     * 解压GZip
     *
     * @param data
     * @return
     */
    public static byte[] unGZip(byte[] data) {
        byte[] b = null;
        try {
            ByteArrayInputStream bis = new ByteArrayInputStream(data);
            GZIPInputStream gzip = new GZIPInputStream(bis);
            byte[] buf = new byte[1024];
            int num = -1;
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            while ((num = gzip.read(buf, 0, buf.length)) != -1) {
                baos.write(buf, 0, num);
            }
            b = baos.toByteArray();
            baos.flush();
            baos.close();
            gzip.close();
            bis.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return b;
    }

    public static String Md5(String input){
        try{
            //拿到一个MD5转换器（如果想要SHA1加密参数换成"SHA1"）
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            //输入的字符串转换成字节数组
            byte[] inputByteArray = input.getBytes();
            //inputByteArray是输入字符串转换得到的字节数组
            messageDigest.update(inputByteArray);
            //转换并返回结果，也是字节数组，包含16个元素
            byte[] resultByteArray = messageDigest.digest();
            //字符数组转换成字符串返回
            return Utils.byteArrayToHex(resultByteArray);
        }catch(NoSuchAlgorithmException e){
            return null;
        }
    }

    public static String byteArrayToHex(byte[] byteArray){
        //new一个字符数组，这个就是用来组成结果字符串的（解释一下：一个byte是八位二进制，也就是2位十六进制字符）
        char[] resultCharArray = new char[byteArray.length*2];
        //遍历字节数组，通过位运算（位运算效率高），转换成字符放到字符数组中去
        int index = 0;
        for(byte b : byteArray){
            resultCharArray[index++] = HEXES[b>>> 4 & 0xf];
            resultCharArray[index++] = HEXES[b& 0xf];
        }
        //字符数组组合成字符串返回
        return new String(resultCharArray);
    }

    // 推送信息到js  sendEvent(getReactApplicationContext(),message);
    public static void sendEvent(String eventName,String msg){
        Utils.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, msg);
    }

}
