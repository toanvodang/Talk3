import AsyncStorage from '@react-native-async-storage/async-storage';

const LocalStore = {
    userName: null,
    token: null,
    getStore: () => {
        return { userName: this.userName, token: this.token }
    },
    setStore: (u, t) => {
        userName = u;
        token = t;
    }
}

const storeData = async ({ storeKey, value }) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(storeKey, jsonValue)
    } catch (e) {
        // saving error
    }
}


const getData = async (storeKey) => {
    try {
        const jsonValue = await AsyncStorage.getItem(storeKey)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
    }
}

export { storeData, getData, LocalStore }