package com.buxsren.hello.utils;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.media.MediaRecorder;

import com.alibaba.fastjson.JSON;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;


import java.util.HashMap;
import java.util.Map;

public class Audio extends ReactContextBaseJavaModule {

    public static boolean isRecording = true;// 录制&播放状态

    public static boolean muteStatus = false; // 静音状态

    private static AudioRecord audioRecord;// 录音对象

    public static AudioTrack track;// 播放对象

    private final int bufferSize = 1024;// 缓冲大小

    public Audio(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Audio";
    }

    // 检查权限
    @ReactMethod
    public void checkPermission(Promise promise) {
        if (!Permission.hasPermission()) { // 是否有权限
            promise.resolve(0); // 没有权限
        } else { //
            promise.resolve(1); // 有权限
        }
    }

    // 申请权限
    @ReactMethod
    public void requestPermissions() {
        Permission.requestPermission();
    }

    // 录取音频
    @ReactMethod
    public void record(String token,int toId) {
        int frequence = 16000; // 采样率
        int channelInConfig = AudioFormat.CHANNEL_IN_DEFAULT; // 定义采样通道
        int audioEncoding = AudioFormat.ENCODING_PCM_16BIT; // 定义音频编码（16位）

        // 初始化
        Audio.muteStatus = false;
        Audio.audioRecord = null;
        Audio.track = null;
        Audio.audioRecord = new AudioRecord(MediaRecorder.AudioSource.MIC, frequence, channelInConfig, audioEncoding, bufferSize);
        Audio.track = new AudioTrack(AudioManager.STREAM_MUSIC, frequence, channelInConfig, audioEncoding, bufferSize, AudioTrack.MODE_STREAM);

        Audio.isRecording = true;
        Audio.track.play();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {

                    byte[] buffer = new byte[bufferSize];
                    Audio.audioRecord.startRecording();// 开始录制
                    String sign = "";
                    while (Audio.isRecording) {
                        Audio.audioRecord.read(buffer, 0, buffer.length);
                        if (!Audio.muteStatus) {
                            String data = Utils.bytes2Hex(buffer);
                            if(!sign.equals(Utils.Md5(data))) {
                                Map<String,Object> param = new HashMap<>();
                                param.put("type","call");
                                param.put("toId",toId);
                                param.put("data",data);
                                Udp.send(JSON.toJSONString(param));
                            }
                        }
                    }
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
            }
        }).start();
    }

    // 播放音频
    public static void play(String data) {
        byte[] music = Utils.hex2Bytes(data);
        Audio.track.write(music, 0, music.length);
    }

    // 静音
    @ReactMethod
    public void mute() {
        Audio.muteStatus = !Audio.muteStatus;
    }

    // 关闭音频录制
    @ReactMethod
    public void close(){
        try {
            if (Audio.audioRecord != null) {
                Audio.audioRecord.stop();
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        try{
            if (Audio.track != null) {
                Audio.track.stop();
            }
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
        Audio.isRecording = false;
    }
}
