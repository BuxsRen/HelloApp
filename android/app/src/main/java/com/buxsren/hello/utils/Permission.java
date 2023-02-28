package com.buxsren.hello.utils;

import android.Manifest;
import android.app.Application;
import android.content.pm.PackageManager;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.buxsren.hello.MainActivity;

// 申请权限
public class Permission extends AppCompatActivity {

    public Permission(){}

    // 开始申请录音权限
    public static void requestPermission(){
        ActivityCompat.requestPermissions(Global.activity, new String[]{Manifest.permission.RECORD_AUDIO}, 0);
    }

    // 查看是否有权限
    public static boolean hasPermission(){
        int hasPermission= ContextCompat.checkSelfPermission(Global.app, Manifest.permission.RECORD_AUDIO); // 音频权限
        return hasPermission == PackageManager.PERMISSION_GRANTED;
    }

}
