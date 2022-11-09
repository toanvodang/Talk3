import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKey } from './Constants';

export const setStore = async (value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(storageKey, jsonValue)
    } catch (e) {
        // saving error
    }
}

export const getStore = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(storageKey)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}