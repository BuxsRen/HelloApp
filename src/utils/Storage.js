import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

// 存储 取
const get = (key) => {
    return new Promise(callback=>{
      try {
      AsyncStorage.getItem(config.app.env+"_"+key).then(value=>{
        if (value !== null && value !== '') {
          callback(value)
        } else {
          callback(null);
        }
      })
      } catch (error) {
        callback(null);
      }
    });
};

// 存储 存
const set = async (key,value) => {
  try {
     return await AsyncStorage.setItem(config.app.env+"_"+key, value);
  } catch (error) {
    console.log(error)
    // Error saving data
  }
};

export {get,set};
