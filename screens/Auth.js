import { useEffect } from 'react';
import { View, Image } from 'react-native';
import Constants from '../utilities/Constants';
import { getData, LocalStore } from '../services/LocalStorageService';
import bgLogin from '../assets/bgLogin.png';
import { Size } from '../utilities/Styles';

export default function AuthScreen({ navigation }) {

    useEffect(() => {
        (async () => {
            const getStore = await getData(Constants.AUTH_STORAGE);

            if (getStore) {

                LocalStore.setStore(getStore.userName, getStore.token)

                navigation.navigate('Home');
            }
            else {
                navigation.navigate('Login');
            }
        })()

    }, [])

    return (<View style={{ flex: 1 }}>
        <Image source={bgLogin} style={{ flex: 1, width: Size.deviceWidth }} resizeMode='contain' />
    </View>)
}