package com.buxsren.hello;

import android.app.ActivityManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.Window;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.buxsren.hello.utils.Global;
import com.facebook.react.ReactActivity;

import java.util.List;

public class MainActivity extends ReactActivity {

  @Override
  protected String getMainComponentName() {
    return "Hello";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Global.packageManager = getPackageManager();
    Global.activity = this;
    Global.app = getApplication();
    Global.PackageName = getPackageName();

  }

  // 权限申请结果回调
  @Override
  public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) { //获取权限结果
    if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED){ //用户同意了权限申请
      System.out.println("获取录音权限成功");
    } else { //用户拒绝了权限申请
      Toast.makeText(this,"无法使用通话功能，请先允许录音权限",Toast.LENGTH_LONG).show();
    }
  }

}
