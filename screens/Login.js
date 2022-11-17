import { useState, useEffect, useRef } from 'react';
import {
    KeyboardAvoidingView, View, Text, Image,
    TextInput, TouchableOpacity, StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import bgLogin from '../assets/bgLogin.png';
import { Size } from '../utilities/Styles';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import { storeData, LocalStore } from '../services/LocalStorageService';
import Constants from '../utilities/Constants';

export default function LoginScreen({ navigation }) {
    const [hidePass, setHidePass] = useState(true)

    const [InfoLogin, setInfoLogin] = useState({
        userName: null,
        passWord: null
    })

    const refPass = useRef()

    const { topLogin, sizeBgLogin, botLogin, leftIcon, fromInput,
        text, inputStyle, control, formControl, styTextForgotPass,
        styViewRegister, styTextRegister, styTextRegisterNow, container,
        styViewForgotPass, styTextLogin, styViewLogin, inner } = styles;

    const handleLogin = () => {
        Keyboard.dismiss()

        const { userName, passWord } = InfoLogin;

        if (!userName || userName === '' || !passWord || passWord === '') {
            Toast.show('Tài khoản và mật khẩu không được để trống', { position: Toast.positions.CENTER });
        }
        else {
            const obj = { password: passWord, username: userName };
            fetch('https://chat.cybercode88.com/api/auth/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            }).then(res => res.json())
                .then(res => {
                    if (res) {
                        const { success, data, error } = res;
                        if (success === 1 && data) {
                            storeData({ storeKey: Constants.AUTH_STORAGE, value: { userName: userName, token: data } });
                            LocalStore.setStore(userName, data)
                            navigation.navigate('Home');
                        }
                        else if (success === 0 && error) {
                            Toast.show(error, { position: Toast.positions.CENTER });
                        }
                    }
                    else {
                        Toast.show('Tài khoản và mật khẩu không được để trống', { position: Toast.positions.CENTER });
                    }
                })
                .catch((error) => console.error(error))
            // .finally(() => setLoading(false));
        }


        // ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
        // let toast = Toast.show('This is a message', {
        //     duration: Toast.durations.SHORT,
        //     position: Toast.positions.CENTER,
        //     shadow: true,
        //     animation: true,
        //     hideOnPress: true,
        //     delay: 0,
        //     onShow: () => {
        //         // calls on toast\`s appear animation start
        //     },
        //     onShown: () => {
        //         // calls on toast\`s appear animation end.
        //     },
        //     onHide: () => {
        //         // calls on toast\`s hide animation start.
        //     },
        //     onHidden: () => {
        //         // calls on toast\`s hide animation end.
        //     }
        // });

        // setTimeout(function () {
        //     Toast.hide(toast);
        // }, 500);
        //alert('Hi ' + InfoLogin.userName)
    }

    return (<KeyboardAvoidingView
        extraScrollHeight={150}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={inner}>
                <View style={topLogin}>
                    <Image source={bgLogin} style={sizeBgLogin} resizeMode='contain' />
                </View>
                <View style={botLogin}>
                    <View style={styViewRegister}>
                        <TouchableOpacity activeOpacity={.8} onPress={() => {
                            Keyboard.dismiss();
                            navigation.navigate('Registry');
                        }}>
                            <Text style={styTextRegister}>Nếu chưa có tài khoản hãy</Text>
                            <Text style={styTextRegisterNow}>Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={fromInput}>
                        <View style={formControl}>
                            <View style={control}>
                                <TextInput
                                    onChangeText={userName => setInfoLogin({ ...InfoLogin, userName })}
                                    value={InfoLogin?.userName}
                                    returnKeyType={'next'}
                                    autoCapitalize={"none"}
                                    placeholder='Tên đăng nhập'
                                    onSubmitEditing={() => refPass.current.focus()}
                                    style={[text, inputStyle]} />
                                <TouchableOpacity style={leftIcon} onPress={() => setInfoLogin({ ...InfoLogin, userName: null })}>
                                    <Feather name="x-circle" size={Size.iconSize} color="#9e9e9e" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[formControl, { marginTop: 15 }]}>
                            <View style={control}>
                                <TextInput
                                    placeholder='Mật khẩu'
                                    style={[text, inputStyle]}
                                    value={InfoLogin.passWord}
                                    autoCapitalize={"none"}
                                    ref={refPass}
                                    onChangeText={passWord => setInfoLogin({ ...InfoLogin, passWord })}
                                    secureTextEntry={hidePass}
                                    onSubmitEditing={handleLogin}
                                    returnKeyType={'done'}
                                />
                                <TouchableOpacity style={leftIcon} onPress={() => setHidePass(!hidePass)}>
                                    {hidePass ? <Ionicons name="eye-outline" size={Size.iconSize + 3} color="#9e9e9e" /> :
                                        <Ionicons name="eye-off-outline" size={Size.iconSize + 3} color="#9e9e9e" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styViewForgotPass}>
                            <TouchableOpacity onPress={() => {
                                Keyboard.dismiss();
                            }}>
                                <Text style={styTextForgotPass}>Quên mật khẩu ?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styViewLogin}>
                            <TouchableOpacity onPress={() => handleLogin()}>
                                <Text style={styTextLogin}>Đăng nhập</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView >)
}

const HEIGHT_HEADER = Size.deviceheight,
    styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 30,
            maxWidth: 420,
            width: '100%',
            // backgroundColor: 'red'
        },
        inner: {
            flex: 1,
            justifyContent: 'center'
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
            // maxHeight: Size.deviceWidth * 1.21,
            // maxWidth: Size.deviceWidth
            flex: 1
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
            backgroundColor: '#EAF0F7'
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