/*
 * @Author: 毕帅
 * @Date: 2021-09-03 09:42:36
 * @Last Modified by: 毕帅
 * @Last Modified time: 2021-09-06 09:45:00
 */
import React, { Component } from "react";
import {Animated, Dimensions, PanResponder} from 'react-native';
const {width,height} = Dimensions.get('window');

class GJSuspendView extends Component {
    pan = new Animated.ValueXY();
    panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            this.pan.setOffset({
                x: this.pan.x._value,
                y: this.pan.y._value
            });
        },
        onPanResponderMove: Animated.event([
            null,
            { dx: this.pan.x, dy: this.pan.y }
        ]),
        onPanResponderRelease: (e, gestureState) => {
            // 距边界的距离
            let space = 10;
            // 屏幕宽高
            let screenW = width;
            let screenH = height;
            let { locationX, locationY, pageX, pageY } = e.nativeEvent;
            let { dx, dy } = gestureState;
            // locationX locationY 触摸点相对于组件的位置
            // pageX pageY 触摸点相对于根元素也就是屏幕的位置
            // dx dy 拖动了多远

            // 1.计算出最后位置是应该吸附左侧还是右侧
            // 手势结束时组件的x坐标
            let finalX = pageX - locationX;
            let finalY = pageY - locationY;

            let isLeft = screenW / 2 > (finalX + this.viewW / 2);

            // 2.计算最终偏移量
            // 最终x轴偏移量
            let offsetX = 0;
            // 判断应该吸附在左边还是右边
            if (isLeft) {
                offsetX = dx - finalX + space;
            } else {
                offsetX = dx - (finalX + this.viewW + space - screenW);
            }

            let offsetY = dy;
            // 判断view是否超出顶部
            if (finalY < space) {
                offsetY -= (finalY - space);
            }
            // 判断view是否超出底部
            if (finalY + this.viewH + space > screenH) {
                offsetY -= (finalY + this.viewH + space - screenH);
            }
            Animated.spring(
                this.pan, // Auto-multiplexed
                {
                    toValue: { x: offsetX, y: offsetY },
                    speed: 150,
                    bounciness: 0
                }
            ).start(() => {
                this.pan.flattenOffset();
            });
        }
    });

    render() {

        return (
            <Animated.View
                onLayout={(event) => {
                    this.viewW = event.nativeEvent.layout.width;
                    this.viewH = event.nativeEvent.layout.height;
                    this.viewX = event.nativeEvent.layout.x;
                    this.viewY = event.nativeEvent.layout.y;
                }}
                style={{
                    transform: [{ translateX: this.pan.x }, { translateY: this.pan.y }]
                }}
                {...this.panResponder.panHandlers}
            >

            </Animated.View>
        );
    }
}

export default GJSuspendView;
