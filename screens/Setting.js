import { useState, useEffect, useRef } from 'react';
import {
    View, Text, LayoutAnimation,
    TextInput, TouchableOpacity, StyleSheet,
    ScrollView, Switch,
    Keyboard, Image, Modal
} from 'react-native';
import { Size } from '../utilities/Styles';
import Toast from 'react-native-root-toast';
import * as DocumentPicker1 from 'expo-document-picker';
import * as Notifications from 'expo-notifications';
import Svg, { Path } from 'react-native-svg';
// import avatarDefault from '../assets/default.8a7fd05f.png';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { LocalStore } from '../services/LocalStorageService';
import * as ImagePicker from 'expo-image-picker';
// import { DocumentPicker, ImagePicker } from 'expo';
import { Camera, CameraType } from 'expo-camera';
import HttpService from '../services/HttpService';
//https://upload.wikimedia.org/wikipedia/vi/thumb/b/b0/Avatar-Teaser-Poster.jpg/220px-Avatar-Teaser-Poster.jpg
export default function SettingScreen({ setUserInfoProp, userInfoProp }) {

    const [showCamera, setShowCamera] = useState(false)
    const [showPickerAvatar, setShowPickerAvatar] = useState(false);
    const { me } = userInfoProp;
    const [data, setData] = useState({
        fullName: me.fullname,
        email: me.email,
        status: me.bio,
        avatar: me.avatar,
        sound: me.settings ? me.settings.enabledSound == 1 ? true : false : false
    })
    const [image, setImage] = useState(me.avatar)
    const [focus, setFocus] = useState()
    const [hasCameraPermission, setHasCameraPermission] = useState()
    // const profile = LocalStore.getStore();

    // const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState(false);
    const refFullName = useRef()
    const refEmail = useRef()
    const refStatus = useRef()
    const cameraRef = useRef()
    // const [type, setType] = useState(CameraType.front);
    useEffect(() => {

        (async () => {
            const camerePermission = await Camera.requestCameraPermissionsAsync()
            setHasCameraPermission(camerePermission.status === 'granted')
        })();
    }, [])

    if (hasCameraPermission === undefined) {
        // Toast.show('Waiting permission...', { position: Toast.positions.CENTER });
    }
    else if (!hasCameraPermission) {
        Toast.show('Please wait setting permission...', { position: Toast.positions.CENTER });
    }

    const handleUpdate = () => {
        Keyboard.dismiss();



        const { fullName, email, status, sound } = data;
        const obj = {
            // avatar: 
            fullname: fullName,
            email: email,
            bio: status,
            enabledSound: sound
        };

        HttpService.Post('/api/me/update', obj)
            .then(res => {

                if (res) {
                    const { success, data, error } = res;

                    if (success === 1 && data) {
                        setUserInfoProp({
                            ...userInfoProp,
                            me: {
                                ...userInfoProp.me,
                                fullname: fullName,
                                email: email,
                                status: status,
                                sound: sound,
                                // avatar: ,
                            }
                        });

                        Toast.show('Cập nhật thành công', { position: Toast.positions.CENTER });
                    }
                    else if (success === 0 && error) {
                        Toast.show(error, { position: Toast.positions.CENTER });
                    }
                }
            });
    }

    const takePic = async () => {
        const options = {
            quality: 1,
            base64: true,
            exif: false
        }

        const newImg = await cameraRef.current.takePictureAsync(options)

        setImage(newImg.uri)

        setShowCamera(false)

        toggleShowPickerAvatar()
    }

    // function toggleCameraType() {
    //     setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    // }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        // console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            toggleShowPickerAvatar()
        }
    };

    const schedulePushNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { data: 'goes here' },
            },
            trigger: { seconds: 2 },
        });
    }

    const toggleShowPickerAvatar = () => {
        setShowPickerAvatar(!showPickerAvatar)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    return (<View>
        <ScrollView style={styles.container}>
            <View style={styles.fromInput}>
                {/* <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}>
                <Text>Your expo push token: {'ExponentPushToken[H56nliEuVpkl3Fq6Nq2Cli]'}</Text>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Title: {notification && notification.request.content.title} </Text>
                    <Text>Body: {notification && notification.request.content.body}</Text>
                    <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
                </View>
                <Button
                    title="Press to schedule a notification"
                    onPress={async () => {
                        await schedulePushNotification();
                    }}
                />
            </View> */}
                {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button title="Pick an image from camera roll" onPress={pickImage} />
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                </View> */}



                {/* <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={takePic}>
                    <Text style={styles.text}>Picture</Text>
                </TouchableOpacity>
                <Button
                    title="Select Document"
                    onPress={() => _pickDocument()}
                />

                <View style={{ 'marginTop': 20, backgroundColor: 'red' }}>

                    <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                </View>
            </View> */}

                <View style={styles.formControl}>
                    <Text style={styles.label}>Tên đầy đủ</Text>
                    <View style={[styles.control, focus == 'fullName' && styles.controlFocus]}>
                        <TextInput
                            onChangeText={fullName => setData({ ...data, fullName })}
                            value={data.fullName}
                            onFocus={() => setFocus('fullName')}
                            onBlur={() => setFocus()}
                            returnKeyType={'done'}
                            ref={refFullName}
                            // onSubmitEditing={() => refPass.current.focus()}
                            style={[styles.text, styles.inputStyle]} />
                    </View>
                </View>

                <View style={styles.formControl}>
                    <Text style={styles.label}>Email</Text>
                    <View style={[styles.control, focus == 'email' && styles.controlFocus]}>
                        <TextInput
                            onChangeText={email => setData({ ...data, email })}
                            onFocus={() => setFocus('email')}
                            onBlur={() => setFocus()}
                            value={data.email}
                            ref={refEmail}
                            // placeholder='sss'
                            returnKeyType={'done'}
                            // onSubmitEditing={() => refPass.current.focus()}
                            style={[styles.text, styles.inputStyle]} />
                    </View>
                </View>

                <View style={styles.formControl}>
                    <Text style={styles.label}>Trạng thái</Text>
                    <View style={[styles.control, { height: 100 }, focus == 'status' && styles.controlFocus]}>
                        <TextInput
                            multiline={true}
                            textAlignVertical={'top'}
                            onFocus={() => setFocus('status')}
                            ref={refStatus}
                            onBlur={() => setFocus()}
                            placeholder={'Hôm nay bạn cảm thấy thế nào...'}
                            onChangeText={status => setData({ ...data, status })}
                            value={data.status}
                            // returnKeyType={'done'}
                            // onSubmitEditing={() => refPass.current.focus()}
                            style={styles.inputStyle} />
                    </View>
                </View>

                <View style={styles.formControl}>
                    <Text style={styles.label}>Ảnh đại diện</Text>

                    <TouchableOpacity style={[styles.control,
                    {
                        flexDirection: 'column',
                        borderStyle: 'dashed',
                        alignItems: 'center',
                        height: 160,
                        justifyContent: 'center'
                    }]} onPress={toggleShowPickerAvatar}>
                        {showPickerAvatar ? (<View style={
                            {
                                flexDirection: 'row',
                                alignItems: 'center',
                                height: 160,
                                width: '100%'
                            }}>
                            <TouchableOpacity onPress={toggleShowPickerAvatar} style={{
                                paddingBottom: 20,
                                paddingLeft: 20,
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                zIndex: 1
                            }}>
                                <Ionicons name="close-circle-outline" size={Size.iconSize + 3} color="gray" />
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                height: 160,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1
                            }} onPress={() => setShowCamera(true)}>
                                <Ionicons name="camera-outline" size={Size.iconSize + 3} color="rgb(17, 24, 39)" />
                                <Text style={{ color: 'rgb(17, 24, 39)', fontSize: Size.text, fontWeight: '500' }}>Chụp ảnh</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                height: 160,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flex: 1
                            }} onPress={pickImage}>
                                <Ionicons name="images-outline" size={Size.iconSize + 1} color="rgb(17, 24, 39)" />
                                <Text style={{ color: 'rgb(17, 24, 39)', fontSize: Size.text, fontWeight: '500' }}>Thư viện ảnh</Text>
                            </TouchableOpacity>
                        </View>) : image ? (<View style={{ width: '100%', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setImage(null)} style={{
                                paddingBottom: 20,
                                paddingLeft: 20,
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                zIndex: 1
                            }}><Ionicons name="close-circle-outline" size={Size.iconSize + 3} color="gray" /></TouchableOpacity>
                            <Image source={{ uri: image }} style={{ width: 160, height: 160 }} />
                        </View>)
                            : (<View style={{ alignItems: 'center', paddingBottom: 15 }}>
                                <Svg width={40} height={40} aria-hidden="true" fill="none" stroke="rgb(156, 163, 175)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class=""><Path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></Path></Svg>
                                <Text style={{ fontSize: Size.text - 2, color: 'rgb(107, 114, 128)', marginBottom: 8 }}><Text style={{ fontWeight: '600' }}>Nhấn</Text> vào để upload</Text>
                                <Text style={{ fontSize: Size.text - 4, color: 'rgb(107, 114, 128)' }}>SVG, PNG, JPG or GIF (Dung lượng tối đa 2MB)</Text>
                            </View>)}
                    </TouchableOpacity>
                </View>

                <View style={styles.formControl}>
                    <View style={[styles.control, { borderWidth: 0 }]}>
                        <Switch
                            trackColor={{ true: '#e5e7eb', true: '#4461f2' }}
                            thumbColor={true ? '#fff' : '#fff'}
                            // ios_backgroundColor="#3e3e3e"
                            onValueChange={() => setData({ ...data, sound: !data.sound })}
                            value={data.sound}
                        />

                        <Text style={[styles.label, { marginLeft: 20 }]}>Âm thanh tin nhắn</Text>

                    </View>
                </View>

                <View style={styles.styViewLogin}>
                    <TouchableOpacity onPress={() => handleUpdate()}>
                        {/* <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-5 h-5 mr-3 -ml-1 text-white animatespin" style={{anima }}><Circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></Circle><Path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></Path></Svg> */}
                        <Text style={styles.styTextLogin}>Cập nhật</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>

        <Modal animationType="slide" transparent={true} visible={showCamera}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={styles.modalView}>
                    <Camera style={{ flex: 1, width: '100%', height: '100%' }} type={CameraType.front} ref={cameraRef}></Camera>
                    <View style={{
                        position: 'absolute',
                        flexDirection: 'row',
                        backgroundColor: 'gray',
                        opacity: '.85',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                        height: 100,
                        width: '100%',
                        bottom: 0
                    }}>
                        <TouchableOpacity style={{
                            height: 100,
                            position: 'absolute',
                            bottom: 0,
                            zIndex: 1,
                            justifyContent: 'center',
                            paddingHorizontal: 30
                        }} onPress={() => setShowCamera(false)}>
                            <AntDesign name="back" size={Size.iconSize + 30} color="rgb(17, 24, 39)" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 100
                        }} onPress={takePic}>
                            <AntDesign name="checkcircleo" size={Size.iconSize + 30} color="#1455fe" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 420,
        width: '100%',
        marginBottom: 5
    },
    styViewLogin: {
        width: '100%',
        height: 40,
        marginTop: 15,
        backgroundColor: '#4461f2',
        borderRadius: 8
    },
    styTextLogin: {
        fontSize: Size.text - 2,
        color: '#fff',
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 40
    },
    fromInput: {
        alignItems: 'center',
        paddingHorizontal: 15
    },
    formControl: {
        width: '100%',
        marginTop: 30
    },
    control: {
        flexDirection: 'row',
        height: 56,
        borderRadius: 7,
        backgroundColor: 'rgb(249, 250, 251)',
        borderWidth: 1,
        borderColor: 'rgb(209, 213, 219)'
    },
    controlFocus: {
        borderColor: 'rgb(59, 130, 246)'
    },
    inputStyle: {
        flex: 1,
        paddingLeft: 10,
        color: 'rgb(17, 24, 39)',
        fontSize: Size.text
    },
    leftIcon: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: Size.text,
        marginBottom: 8,
        color: 'rgb(17, 24, 39)'
    },
    modalView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
})