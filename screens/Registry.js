import { useState, useRef, useEffect } from 'react';
import {
    KeyboardAvoidingView, View, Text, Image,
    TextInput, TouchableOpacity, StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import bgLogin from '..//assets/bgLogin.png';
import { Size } from '../utilities/Styles';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-root-toast';
import HttpService from '../services/HttpService';
import { storeData, LocalStore } from '../services/LocalStorageService';
import Constants from '../utilities/Constants';

export default function RegistryScreen({ navigation }) {
    const refPass = useRef()
    const refRePass = useRef()
    const [hidePass, setHidePass] = useState(true)
    const [hideRePass, setHideRePass] = useState(true)
    const [offsetKeyboard, setOffsetKeyboard] = useState(0);
    const [InfoLogin, setInfoLogin] = useState({
        userName: null,
        passWord: null,
        rePassWord: null
    })

    // useEffect(() => {
    //     // console.log(Keyboard, 'kbn');
    //     Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    //     Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    //     // cleanup function
    //     return () => {
    //         Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
    //         Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    //     };
    // }, [])

    // const _keyboardDidShow = () => {
    //     setOffsetKeyboard(250);
    // }

    // const _keyboardDidHide = () => {
    //     setOffsetKeyboard(0);
    // }

    const { topLogin, sizeBgLogin, botLogin, leftIcon, fromInput,
        text, inputStyle, control, formControl,
        styViewRegister, styTextRegister, styTextRegisterNow, container,
        styTextLogin, styViewLogin, inner } = styles;

    const handleRegistry = () => {
        Keyboard.dismiss()

        const { userName, passWord, rePassWord } = InfoLogin;

        if (!userName || userName === '') {
            Toast.show('Tên đăng nhập không hợp lệ', { position: Toast.positions.CENTER });
        }
        else if (userName.length < 7) {
            Toast.show('Tên đăng nhập không được nhỏ hơn 6 kí tự', { position: Toast.positions.CENTER });
        }
        else if (!passWord || (passWord && passWord.length < 8)) {
            Toast.show('Mật khẩu cần có ít nhất 8 kí tự', { position: Toast.positions.CENTER });
        }
        else if (rePassWord !== passWord) {
            Toast.show('Mật khẩu không khớp', { position: Toast.positions.CENTER });
        }
        else {
            // Toast.show('Hi ' + InfoLogin.userName, { position: Toast.positions.CENTER });

            // navigation.navigate('Login');

            HttpService.Post('api/auth/signup', { password: passWord, username: userName })
                .then(res => {
                    if (res) {
                        const { data, success, error } = res;

                        if (success == 1) {
                            storeData({ storeKey: Constants.AUTH_STORAGE, value: { userName: userName, token: data } });
                            LocalStore.setStore(userName, data)
                            navigation.navigate('Home');
                        }
                        else {
                            Toast.show(error, { position: Toast.positions.CENTER });
                        }
                    }
                })
        }
    }

    return (<KeyboardAvoidingView
        // extraScrollHeight={700}
        keyboardVerticalOffset={0}
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
                            navigation.navigate('Login');
                        }}>
                            <Text style={styTextRegister}>Nếu chưa có tài khoản hãy</Text>
                            <Text style={styTextRegisterNow}>Đăng nhập</Text>
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
                                    onSubmitEditing={() => refRePass.current.focus()}
                                    returnKeyType={'next'}
                                />
                                <TouchableOpacity style={leftIcon} onPress={() => setHidePass(!hidePass)}>
                                    {hidePass ? <Ionicons name="eye-outline" size={Size.iconSize + 3} color="#9e9e9e" /> :
                                        <Ionicons name="eye-off-outline" size={Size.iconSize + 3} color="#9e9e9e" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[formControl, { marginTop: 15 }]}>
                            <View style={control}>
                                <TextInput
                                    placeholder='Nhập lại mật khẩu'
                                    style={[text, inputStyle]}
                                    value={InfoLogin.rePassWord}
                                    autoCapitalize={"none"}
                                    ref={refRePass}
                                    onChangeText={rePassWord => setInfoLogin({ ...InfoLogin, rePassWord })}
                                    secureTextEntry={hideRePass}
                                    onSubmitEditing={handleRegistry}
                                    returnKeyType={'done'}
                                />
                                <TouchableOpacity style={leftIcon} onPress={() => setHideRePass(!hideRePass)}>
                                    {hideRePass ? <Ionicons name="eye-outline" size={Size.iconSize + 3} color="#9e9e9e" /> :
                                        <Ionicons name="eye-off-outline" size={Size.iconSize + 3} color="#9e9e9e" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styViewLogin}>
                            <TouchableOpacity onPress={() => handleRegistry()}>
                                <Text style={styTextLogin}>Tạo tài khoản</Text>
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
            width: '100%'
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
            // maxHeight: 350 * 1.21,
            // maxWidth: 350
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