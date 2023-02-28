# Hello App For Android

> 服务端
>
> https://github.com/BuxsRen/Hello

#### 介绍

- 安卓app
- 语音通话、聊天
- 使用react native && java开发

#### 待开发
- 圈子，评论，点赞

#### 配置
```shell script
./src/config.js
```

#### 本地调试地址设定
> ./android/app/src/main/java/com/buxsren/hello/MainApplication.java
```text
// 重新指向debug服务器地址
SharedPreferences mPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
mPreferences.edit().putString("debug_http_host", "192.168.30.186:8081").commit();
```

#### 调试
```shell script
yarn android
```

#### 打包发布
```shell script
cd android
./gradlew assembleRelease
```

![首页](./src/static/home.jpg)
![信息](./src/static/info.jpg)
![资料](./src/static/edit.jpg)
![通话](./src/static/call.jpg)
