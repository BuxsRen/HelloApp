package com.buxsren.hello.utils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

public class Udp extends ReactContextBaseJavaModule {

    private static int       remotePort;  // 服务器地址
    private static InetAddress remoteIP;  // 服务器ip
    public static DatagramSocket socket; // udp 服务
    private static boolean status = false; //服务状态
    public static boolean ConnectStatus = false; //播放状态

    public Udp(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Udp";
    }

    // 连接udp服务，传入服务器ip和端口，用户token，发送登录，开启接收线程，并推送到js
    @ReactMethod
    public void open(String ip,String port,String token) throws UnknownHostException, SocketException {
        Udp.remotePort = Integer.parseInt(port);
        Udp.remoteIP = InetAddress.getByName(ip);
        Udp that = this;
        Udp.socket = new DatagramSocket(null);
        Map<String,Object> param=new HashMap<>();
        param.put("type","login");
        param.put("token",token);
        Udp.send(JSON.toJSONString(param));
        Udp.status = true;
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    that.receive();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    //定义一个数据的发送方法。
    @ReactMethod
    public static void send(String msg){
        try {
            //先准备一个待发送的数据报
            byte[] outputData=msg.getBytes(StandardCharsets.UTF_8);
            //构建一个数据报文。
            DatagramPacket outputPacket=new DatagramPacket(outputData, outputData.length,Udp.remoteIP,Udp.remotePort);
            // 发送数据
            Udp.socket.send(outputPacket);
        } catch (IOException ex) {
            System.out.println("send error");
            System.out.println(ex.getMessage());
        }
    }

    // 关闭udp
    @ReactMethod
    public void close() {
        if (Udp.socket != null) {
            Udp.socket.close();
        }
        Udp.ConnectStatus = false;
        Udp.status = false;
    }

    //定义一个数据的接收方法。
    public void receive(){
        while (Udp.status) {
            try {
                String message;
                //先准备一个空数据报文
                DatagramPacket inputPacket = new DatagramPacket(new byte[10240],10240);
                //阻塞语句，有数据就装包，以装完或装满为此.
                Udp.socket.receive(inputPacket);
                //从报文中取出字节数据并装饰成字符。
                message = new String(inputPacket.getData(), 0,inputPacket.getLength(), StandardCharsets.UTF_8);
                JSONObject data = JSONObject.parseObject(message);
                if ("call".equals(data.getString("type"))) { // 通话中
                    if (!Udp.ConnectStatus) {
                        Udp.ConnectStatus = true;
                        Utils.sendEvent("onMessage", "{\"type\":\"call\",\"status\":\"ok\"}");
                    }
                    Audio.play(Objects.requireNonNull(data.get("data")).toString());
                }
            } catch (IOException ex) {
                System.out.println("------- error -------");
                System.out.println(ex.getMessage());
                //break;
            }
        }
    }

}
