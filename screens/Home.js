import { useState, useEffect } from 'react';
import {
    KeyboardAvoidingView, View, Text,
    TouchableOpacity, StyleSheet,
    Platform, SafeAreaView, LayoutAnimation
} from 'react-native';
import { Size } from '../utilities/Styles';
import { Ionicons, } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import MessageScreen from './Message';
import SettingScreen from './Setting';
import FriendScreen from './Friend';
import Constants from '../utilities/Constants';
import { storeData, LocalStore } from '../services/LocalStorageService';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
    const objScreen = { Message: 'Message', Friend: 'Friend', Setting: 'Setting' }
    const [screen, setScreen] = useState(objScreen.Message);
    const [receiveFriend, setReceiveFriend] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        //navigation.addListener("didFocus", receiveFriend);
        // console.log(isFocused);
        if (isFocused) {
            HttpService.Get('api/friend/receive/')
                .then(res => {
                    if (res) {
                        const { success, data, error } = res

                        if (success === 1 && data && data.items) {
                            const { items } = data;
                            setReceiveFriend([...items]);
                        }
                        else if (success === 0 && error) {
                            //Toast.show(error, { position: Toast.positions.CENTER });
                        }
                    }
                })
        }
    }, [isFocused])

    const handleSetScreen = (item) => {
        setScreen(item)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    const handleLogOut = () => {
        storeData({ storeKey: Constants.AUTH_STORAGE, value: null });
        LocalStore.setStore(null, null);
        navigation.navigate('Login');
    }

    const sizeIcon = Size.iconSize + 6;
    return (<SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <View style={styles.inner}>
                <View style={styles.leftButton}>
                    <TouchableOpacity activeOpacity={.8} style={[styles.leftButtonItem, screen == objScreen.Message && styles.leftButtonItemActive]} onPress={() => handleSetScreen(objScreen.Message)}>
                        <MaterialCommunityIcons name="chat-processing" size={sizeIcon + 1} color={screen == objScreen.Message ? '#2854f6' : '#A8AAAF'} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} style={[styles.leftButtonItem,
                    screen == objScreen.Friend && styles.leftButtonItemActive]}
                        onPress={() => handleSetScreen(objScreen.Friend)}>
                        {receiveFriend.length > 0 && <View style={{
                            backgroundColor: 'rgb(220, 38, 38)', color: '#fff', fontSize: Size.text,
                            width: 20, height: 20, borderRadius: 20, borderColor: 'transparent', borderWidth: 1,
                            position: 'absolute', top: 10, right: 10, alignItems: 'center', justifyContent: 'center'
                        }}><Text style={{ color: '#fff', fontSize: Size.text }}>{receiveFriend.length}</Text></View>}
                        <MaterialIcons name="people" size={sizeIcon} color={screen == objScreen.Friend ? '#2854f6' : '#A8AAAF'} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} style={[styles.leftButtonItem, screen == objScreen.Setting && styles.leftButtonItemActive]} onPress={() => handleSetScreen(objScreen.Setting)}>
                        <Ionicons name="settings" size={sizeIcon} color={screen == objScreen.Setting ? '#2854f6' : '#A8AAAF'} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={.8} style={styles.leftButtonLogOut} onPress={handleLogOut}>
                        <MaterialCommunityIcons name="logout" size={sizeIcon} color="#31363E" />
                    </TouchableOpacity>
                </View>

                <View style={styles.rightView}>
                    {screen == objScreen.Message ? <MessageScreen navigation={navigation} /> : screen == objScreen.Friend
                        ? <FriendScreen navigation={navigation} receiveFriend={receiveFriend} setReceiveFriend={setReceiveFriend} /> : <SettingScreen navigation={navigation} />}
                </View>
            </View>
        </KeyboardAvoidingView></SafeAreaView>)
}

const HEIGHT_HEADER = Size.deviceheight,
    styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        inner: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
        },
        leftButton: {
            width: 68,
            paddingTop: 30,
            backgroundColor: '#fff',
            alignItems: 'center',

        },
        leftButtonItem: {
            width: 68,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
            height: 68,
            borderLeftWidth: 4,
            borderLeftColor: 'transparent',
            borderRadius: 1
        },
        leftButtonItemActive: {
            borderLeftColor: '#1455fe',
        },
        leftButtonLogOut: {
            // backgroundColor: 'red',
            width: 68,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 50,
            flex: 1
        },
        rightView: {
            width: Size.deviceWidth - 68,
            backgroundColor: 'rgba(249, 247, 249, .6)'
        },
        topLogin: {
            height: HEIGHT_HEADER * 0.4,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'blue'
        },
        botLogin: {
            height: HEIGHT_HEADER * 0.6,
            // backgroundColor: 'red'
        },
        styViewRegister: {
            marginTop: 15,
            marginBottom: 15,
            borderRadius: 5
        },
        styTextRegister: {
            fontSize: Size.text,
            color: '#262626'
        },
        styTextRegisterNow: {
            fontSize: Size.text,
            color: '#4478f5'
        },
        sizeBgLogin: {
            maxHeight: 350 * 1.21,
            maxWidth: 350
        },
        styViewForgotPass: {
            marginTop: 15,
            alignSelf: 'flex-end'
        },
        styTextForgotPass: {
            fontSize: Size.text + 1,
            color: '#cdcdcd',
            textAlign: 'right'
        },
        styViewLogin: {
            width: '100%',
            height: 56,
            marginTop: 15,
            backgroundColor: '#4461f2',
            borderRadius: 5
        },
        styTextLogin: {
            fontSize: Size.text + 5,
            color: '#fff',
            fontWeight: Platform.OS == 'ios' ? '500' : '600',
            textAlign: 'center',
            lineHeight: 56
        },
        fromInput: {
            alignItems: 'center'
        },
        formControl: {
            width: '100%'
        },
        control: {
            flexDirection: 'row',
            height: 56,
            borderRadius: 5,
            backgroundColor: '#e8f0fe'
        },
        inputStyle: {
            flex: 1,
            paddingLeft: 10,
            color: '#262626'
        },
        leftIcon: {
            width: 40,
            justifyContent: 'center',
            alignItems: 'center'
        },
        text: {
            fontSize: Size.text,
            fontWeight: '400'
        }
    })