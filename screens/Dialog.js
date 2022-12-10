import { useState, useEffect, useRef, useCallback } from 'react';
import {
    KeyboardAvoidingView, View, Text, Image,
    TextInput, TouchableOpacity, StyleSheet,
    Platform, LayoutAnimation,
    TouchableWithoutFeedback, Keyboard, Modal
} from 'react-native';
import { Size } from '../utilities/Styles';
import avatarDefault from '../assets/default.8a7fd05f.png';
import Svg, { Path } from 'react-native-svg';
import arrEmoji from '../utilities/Emoji';
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera, CameraType } from 'expo-camera';
import Toast from 'react-native-root-toast';
import { AntDesign } from '@expo/vector-icons';
import { LocalStore } from '../services/LocalStorageService';
import SocketIOService from '../services/SocketIOService';
import * as FileSystem from 'expo-file-system';

export default function DialogScreen({ navigation, route }) {
    const { params } = route;
    const { userInfo, groupInfo } = params;
    const [showModalImg, setShowModalImg] = useState(false);
    const [image, setImage] = useState();
    const [showEmoji, setShowEmoji] = useState(false);
    const [message, setMessage] = useState();
    const cameraRef = useRef();
    const [hasCameraPermission, setHasCameraPermission] = useState();
    const [showCamera, setShowCamera] = useState(false);
    const [preloadData, setPreloadData] = useState();
    const messageRef = useRef();
    const [offsetPreload, setOffsetPreload] = useState(0);
    const [emoji, setEmoji] = useState(arrEmoji[1]);
    const [isLoadMore, setIsLoadMore] = useState(true);
    const localStore = LocalStore.getStore();
    const socket = SocketIOService(localStore);
    const refPreloadData = useRef();
    const [isBlockedFriend, setIsBlockedFriend] = useState(false)
    const [placeHolderMessage, setPlaceHolderMessage] = useState('Nhập tin nhắn');

    const _preloadMessage = (payload) => {
        // console.log(groupInfo, 'groupInfo dia');
        payload._groupID = groupInfo.to;

        const { offset, size, _groupID } = payload;

        socket.emit('preload', { offset, size, _groupID }, res => {
            const { data, success, error } = res;
            // console.log(data.infoGroup.members, 'members');
            if (success == 1) {
                // console.log(data.friendsBlock, 'data');
                if (refPreloadData.current) {
                    if (data.messages.length > 0) {
                        const { fromUsersList, media, lastMedia } = refPreloadData.current;
                        const _fromUsersList = data.fromUsersList;
                        const _media = data.media;
                        const _lastMedia = data.lastMedia;
                        let mergeFromUsersList = { ...fromUsersList };
                        let mergeMedia = { ...media };
                        let mergeLastMedia = { ...lastMedia };

                        for (let key in _fromUsersList) {
                            if (!fromUsersList.hasOwnProperty(key)) {
                                mergeFromUsersList = {
                                    ...mergeFromUsersList,
                                    [key]: { ..._fromUsersList[key] }
                                }
                            }
                        }

                        for (let key in _media) {
                            if (!media.hasOwnProperty(key)) {
                                mergeMedia = {
                                    ...mergeMedia,
                                    [key]: { ..._media[key] }
                                }
                            }
                        }

                        for (let key in _lastMedia) {
                            if (!lastMedia.hasOwnProperty(key)) {
                                mergeLastMedia = {
                                    ...mergeLastMedia,
                                    [key]: { ..._lastMedia[key] }
                                }
                            }
                        }

                        refPreloadData.current = {
                            ...refPreloadData.current,
                            media: { ...mergeMedia },
                            lastMedia: { ...mergeLastMedia },
                            fromUsersList: { ...mergeFromUsersList },
                            messages: [...data.messages, ...refPreloadData.current.messages]
                        };

                        setPreloadData({ ...refPreloadData.current });
                    }
                    else {
                        setIsLoadMore(false);
                    }
                }
                else {
                    refPreloadData.current = { ...data };
                    setPreloadData({ ...refPreloadData.current });
                }
            }
            else if (success == 0 && error) {
                Toast.show(error, { position: Toast.positions.CENTER });
            }
        });
    }

    const handleMessage = useCallback((data) => {
        const { fromUsersList, media, lastMedia } = refPreloadData.current;
        const _fromUsersList = data.from;
        const _media = data.media;

        let mergeFromUsersList = { ...fromUsersList };
        let mergeMedia = { ...media };
        let mergeLastMedia = { ...lastMedia };
        let mergeMessage = {
            ...data,
            from: _fromUsersList._id,
            media: _media ? _media._id : null
        };

        if (!fromUsersList.hasOwnProperty(_fromUsersList._id)) {
            mergeFromUsersList = {
                ...mergeFromUsersList,
                [_fromUsersList._id]: { ..._fromUsersList }
            }
        }

        if (_media && !media.hasOwnProperty(_media._id)) {
            mergeMedia = {
                ...mergeMedia,
                [_media._id]: { ..._media }
            }
        }

        if (_media && !lastMedia.hasOwnProperty(_media._id)) {
            mergeLastMedia = {
                ...mergeLastMedia,
                [_media._id]: { ..._media }
            }
        }

        refPreloadData.current = {
            ...refPreloadData.current,
            media: { ...mergeMedia },
            lastMedia: { ...mergeLastMedia },
            fromUsersList: { ...mergeFromUsersList },
            messages: [...refPreloadData.current.messages, { ...mergeMessage }]
        }

        setPreloadData({ ...refPreloadData.current });
    }, []);

    const _keyboardDidShow = () => {
        messageRef.current?.scrollToEnd({ animated: false });
    }

    useEffect(() => {
        isLoadMore && _preloadMessage({ offset: offsetPreload, size: 20 });
    }, [isLoadMore, offsetPreload])

    useEffect(() => {

        socket.on('message', (data) => { handleMessage(data) });

        socket.emit('chat_permission', { to: groupInfo.to }, (res) => {
            if (res) {
                const { success, error } = res;

                if (success == 0 && error) {
                    setIsBlockedFriend(true);
                    setPlaceHolderMessage(error);
                }
                else if (success == 1) {
                    setIsBlockedFriend(false);
                    setPlaceHolderMessage('Nhập tin nhắn');
                }
            }
            // console.log(res, 'chat_permission');
        });

        socket.emit('check_permission_member', { _idGroup: groupInfo.to, _idMembers: groupInfo.me._id }, (res) => {
            // console.log(res, 'check_permission_member');
        });

        (async () => {
            const camerePermission = await Camera.requestCameraPermissionsAsync()
            setHasCameraPermission(camerePermission.status === 'granted')
        })()

        Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
        // Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

        // cleanup function
        // return () => {
        //     Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
        //     // Keyboard.removeAllListeners('keyboardDidShow');
        //     // console.log(_keyboardDidShow, '_keyboardDidShow');
        // };
    }, [])

    if (hasCameraPermission === undefined) {
        // Toast.show('Waiting permission...', { position: Toast.positions.CENTER });
    }
    else if (!hasCameraPermission) {
        Toast.show('Please wait setting permission...', { position: Toast.positions.CENTER });
    }

    // <Camera style={{
    //     flex: 1, width: '100%', height: '100%',
    // }} type={CameraType.front} ref={cameraRef}>
    //     <View style={styles.buttonContainer}>
    //         <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
    //             <Text style={styles.text}>Flip Camera</Text>
    //         </TouchableOpacity>
    //     </View>
    // </Camera>

    const toggleShowEmoji = (isUnmount) => {
        // console.log((isUnmount));
        isUnmount ? setShowEmoji(false) : setShowEmoji(!showEmoji)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const handlePickEmoji = (icon) => {
        if (message) {
            setMessage(message + icon)
        }
        else {
            setMessage(icon)
        }

        toggleShowEmoji();
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
    }

    const toggleShowCamera = () => {
        setShowModalImg(false)
        setShowCamera(true)
    }

    // function toggleCameraType() {
    //     setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    // }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: .7,
            // exif: true,
            // base64: true
        });
        // console.log(result, 'img');
        if (!result.canceled) {
            const { assets } = result;
            setImage(assets[0].uri);
            setShowModalImg(false);

            // let formData = new FormData();

            // formData.append('file', assets[0]);
            // formData.append('_groupID', '63625e366cca054bf5858837');

            // fetch('https://chat.cybercode88.com/api/util/upload', {
            //     method: 'POST',
            //     headers: {
            //         Accept: 'application/json',
            //         'Content-Type': 'multipart/form-data',
            //         'Authorization': 'Bearer ' + localStore.token,
            //     },
            //     body: formData,
            // }).then(res => res.json())
            //     .then(res => {
            //         console.log(res, 'fgffg');
            //     })
            //     .catch((error) => console.error(error))
        }
    };

    const handelScroll = (e) => {
        if (offsetPreload < preloadData.messages.length && e.nativeEvent.contentOffset.y <= 0) {
            setOffsetPreload(offsetPreload + 20)
            setIsLoadMore(true)
        }
    }

    const renderHistoryMess = () => {
        const { me } = groupInfo,
            { messages, fromUsersList, media } = preloadData;

        if (messages.length > 0) {
            return (
                <FlashList
                    ref={messageRef}
                    horizontal={false}
                    estimatedItemSize={200}
                    keyExtractor={(item, i) => i}
                    data={messages}
                    renderItem={({ item, i }) => {
                        let fromName = '',
                            messageContent = '',
                            itemFrom = fromUsersList[item.from],
                            avatar = null,
                            isMeFrom = false;

                        if (itemFrom) {
                            if (me._id == itemFrom._id) {
                                fromName = 'Bạn';
                                isMeFrom = true;
                            }
                            else {
                                if (itemFrom) {
                                    fromName = itemFrom.fullname || itemFrom.username;
                                }
                            }

                            if (itemFrom.avatar) {
                                avatar = 'https://chat.cybercode88.com/' + itemFrom.avatar;
                            }
                        }

                        if (item.media) {
                            let itemMedia = media[item.media];

                            if (itemMedia) {
                                messageContent = 'https://chat.cybercode88.com/' + itemMedia.path;
                            }
                        }
                        else {
                            messageContent = item.message;
                        }

                        return (item.type == 4 ? <View></View> : isMeFrom ? (<TouchableOpacity style={[styles.messageItemReverse]} activeOpacity={1}>
                            {avatar ? <Image source={{ uri: avatar }} style={{ width: 32, height: 32, borderRadius: 32 }} />
                                : <Image source={avatarDefault} style={{ width: 32, height: 32, borderRadius: 32 }} />}

                            <View style={styles.messageItemRight}>
                                <Text style={styles.messageItemRightName}>{fromName}</Text>
                                {item.media ? (<View style={[styles.messageItemRightViewContent, styles.messageItemLeftViewContentImg]}>
                                    <Image source={{ uri: messageContent }} style={{ width: 100, height: 100, borderRadius: 12 }} />
                                </View>) : (<View style={styles.messageItemRightViewContent}>
                                    <Text style={styles.messageItemRightContent}>{messageContent}</Text>
                                </View>)}
                            </View>
                        </TouchableOpacity>) : (<TouchableOpacity style={[styles.messageItem]} activeOpacity={1}>
                            {avatar ? <Image source={{ uri: avatar }} style={{ width: 32, height: 32, borderRadius: 32 }} />
                                : <Image source={avatarDefault} style={{ width: 32, height: 32, borderRadius: 32 }} />}

                            <View style={styles.messageItemLeft}>
                                <Text style={styles.messageItemLeftName}>{fromName}</Text>
                                {item.media ? (<View style={[styles.messageItemLeftViewContent, styles.messageItemLeftViewContentImg]}>
                                    <Image source={{ uri: messageContent }} style={{ width: 100, height: 100, borderRadius: 12 }} />
                                </View>) : (<View style={styles.messageItemLeftViewContent}>
                                    <Text style={styles.messageItemLeftContent}>{messageContent}</Text>
                                </View>)}
                            </View>
                        </TouchableOpacity>))
                    }}
                    onContentSizeChange={() => {
                        setIsLoadMore(false);
                        messages.length == 20 && messageRef.current?.scrollToEnd({ animated: false });
                        messages.length > 20 && messageRef.current?.scrollToIndex({ animated: false, index: 20 });
                    }}
                    onScroll={handelScroll}
                    scrollEventThrottle={0}
                />
            )
        }
    }

    const handleSendMess = () => {
        if (message && message !== '' && !isBlockedFriend) {
            setMessage(null)

            const mess = {
                to: groupInfo.to,
                type: 0,
                message
            };

            socket.emit("message", mess, (rep) => {
                // console.log(rep, 'rep');
                if (rep.success == 0) {
                    Toast.show(rep.error, { position: Toast.positions.CENTER });

                    // this.$toast(`${rep.error}`, {
                    //     position: "top-right",
                    //     icon: Icon.components.Error,
                    // });
                }
            })
        }
    }

    return (<KeyboardAvoidingView
        extraScrollHeight={50}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            toggleShowEmoji(true);
        }}>
            <View style={styles.inner}>
                <View style={{
                    flexDirection: 'row',
                }}>
                    <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('Home')}
                        style={{
                            flexDirection: 'row',
                            flex: 1,
                            paddingRight: 10,
                            height: 56,
                            alignItems: 'center',
                        }}>
                        <Svg data-v-bdfb0870="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg"><Path data-v-bdfb0870="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
                        <Text style={{ fontWeight: '500', fontSize: Size.text, marginLeft: 8 }}>{groupInfo.infoGroupItemName}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={.8} onPress={() => {
                        navigation.navigate('HistoryMessage', {
                            preload: { ...refPreloadData.current },
                            userInfo: { ...userInfo },
                            groupInfo: { ...groupInfo },
                            isBlockedFriendProp: isBlockedFriend
                        })
                    }}
                        style={{
                            flex: 1,
                            alignItems: 'flex-end',
                            paddingRight: 10,
                            height: 56,
                            justifyContent: 'center',
                        }}>
                        {groupInfo.avatar ? <Image source={{ uri: groupInfo.avatar }} style={{ width: 32, height: 32, borderRadius: 32 }} />
                            : <Image source={avatarDefault} style={{ width: 32, height: 32, borderRadius: 32 }} />}
                    </TouchableOpacity>
                </View>

                <View style={{
                    flex: 1,
                    paddingHorizontal: 15
                }}>
                    {preloadData && (renderHistoryMess())}
                </View>
                {showEmoji && (
                    <View style={{
                        backgroundColor: '#f0f0f0',
                        borderColor: '#e4e4e4',
                        borderRadius: 4,
                        borderWidth: 1,
                        width: 402,
                        maxWidth: 402,
                        height: 307,
                        alignSelf: 'center'
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            padding: 3,
                            borderBottomWidth: 1,
                            borderBottomColor: '#e4e4e4'
                        }}>
                            {arrEmoji.map(item => {
                                return (<TouchableOpacity activeOpacity={.7} onPress={() => setEmoji(item)} style={[styles.emojiCategory,
                                emoji.id == item.id && styles.emojiCategoryActive]} key={item.id}>
                                    {item.icon}
                                </TouchableOpacity>)
                            })}
                        </View>

                        <FlashList
                            horizontal={false}
                            numColumns={8}
                            estimatedItemSize={100}
                            estimatedListSize={{ height: 250, width: 400 }}
                            keyExtractor={(item, i) => emoji.id + i}
                            data={emoji.data}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity style={styles.emojiWrapIcon}
                                        onPress={() => handlePickEmoji(item)}
                                        activeOpacity={.6}>
                                        <Text style={styles.emojiIcon}>{item}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                    </View>
                )}

                {image && <View style={{
                    backgroundColor: '#dedede',
                    borderRadius: 8,
                    marginHorizontal: 15,
                    padding: 5
                }}>
                    <TouchableOpacity style={{
                        paddingBottom: 20,
                        paddingLeft: 20,
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        zIndex: 1
                    }} onPress={() => setImage(null)}>
                        <Ionicons name="close-circle-outline" size={Size.iconSize + 4} color="gray" />
                    </TouchableOpacity>
                    <Image source={{ uri: image }} style={{ width: 150, height: 150 }} resizeMode='contain' />
                </View>}

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 88,
                    justifyContent: 'space-between',
                    paddingHorizontal: 12,
                    paddingVertical: 16,
                }}>
                    <View style={{ flexDirection: 'row', height: 40 }}>
                        <TouchableOpacity style={{ padding: 8 }} onPress={() => setShowModalImg(true)}>
                            <Svg width={24} height={24} data-v-bdfb0870="" aria-hidden="true" stroke={'rgb(107, 114, 128)'}
                                fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/Svg"
                                class="w-6 h-6"><Path data-v-bdfb0870=""
                                    fill-rule="evenodd"
                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                    clip-rule="evenodd"></Path></Svg>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 8 }} onPress={() => toggleShowEmoji()}>
                            <Svg width={24} height={24} data-v-bdfb0870="" aria-hidden="true" fill="none"
                                stroke={'rgb(107, 114, 128)'}
                                viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/Svg"><Path data-v-bdfb0870=""
                                    fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000
                                    2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1
                                    0 00-1.415 1.414 5 5 0 007.072 0z"
                                    clip-rule="evenodd"></Path></Svg>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        onChangeText={message => setMessage(message)}
                        value={message}
                        returnKeyType={'go'}
                        placeholder={placeHolderMessage}
                        editable={!isBlockedFriend}
                        placeholderTextColor={isBlockedFriend && '#fbab00'}
                        style={{
                            height: 40,
                            color: 'rgb(17, 24, 39)',
                            fontSize: Size.text - 2,
                            borderColor: 'rgb(209, 213, 219)',
                            borderWidth: 1,
                            borderRadius: 8,
                            flex: 1,
                            marginHorizontal: 16,
                            paddingHorizontal: 12,
                            paddingVertical: 8
                        }}
                    />
                    <TouchableOpacity activeOpacity={.7} style={{
                        backgroundColor: 'rgb(219, 234, 254)', padding: 8, borderRadius: 50,
                        transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: '90deg' },
                        { scaleX: 1 }, { scaleY: 1 }]
                    }} onPress={handleSendMess}>
                        <Svg width={24} height={24} data-v-bdfb0870="" aria-hidden="true" fill="rgb(37, 99, 235)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/Svg" class="w-6 h-6 rotate-90"><Path data-v-bdfb0870="" d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></Path></Svg>
                    </TouchableOpacity>
                </View>

                <Modal animationType="slide" transparent={true} visible={showModalImg}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={styles.fileOption}
                                onPress={pickImage}>
                                <Text>Thư viện ảnh</Text>
                                <Ionicons name="images-outline" size={Size.iconSize + 1} color="rgb(17, 24, 39)" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.fileOption}
                                onPress={toggleShowCamera}>
                                <Text style={{ flex: 1 }}>Chụp ảnh hoặc quay video</Text>
                                <Ionicons name="camera-outline" size={Size.iconSize + 3} color="rgb(17, 24, 39)" />
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={styles.fileOption}>
                                <Text>Chọn tệp</Text>
                                <Ionicons name="folder-outline" size={Size.iconSize + 2} color="rgb(17, 24, 39)" />
                            </TouchableOpacity> */}

                            <TouchableOpacity style={[styles.fileOption, {
                                justifyContent: 'center',
                                backgroundColor: '#dedede',
                                borderBottomLeftRadius: 8,
                                borderBottomRightRadius: 8
                            }]}
                                onPress={() => setShowModalImg(false)}>
                                <Ionicons name="close-circle-outline" size={Size.iconSize + 4} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal animationType="slide" transparent={true} visible={showCamera}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={styles.modalViewCamera}>
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
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>)
}

const styles = StyleSheet.create({
    modalViewCamera: {
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
    fileOption: {
        flexDirection: 'row',
        // backgroundColor: 'blue',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#dedede'
        // width: '100%'

    },
    modalView: {
        position: 'absolute',
        bottom: 70,
        left: 20,
        width: 200,
        // height: 200,
        // height: 120,
        backgroundColor: 'white',
        borderRadius: 8,
        // elevation: 5,
    },
    emojiIcon: {
        fontSize: Size.text + 20,
    },
    emojiWrapIcon: {
        width: 50,
        alignItems: 'center'
    },
    emojiCategory: {
        padding: 2
    },
    emojiCategoryActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#009688'
    },
    container: {
        flex: 1,
        paddingTop: 30,
        // maxWidth: 420,
        // width: '100%',
        // backgroundColor:'red'
    },
    inner: {
        flex: 1,
        // justifyContent: 'center'
    },
    messageItem: {
        flexDirection: 'row',
        paddingBottom: 10,
        // backgroundColor: 'red'
    },
    messageItemReverse: {
        flexDirection: 'row-reverse',
        paddingBottom: 10,
        // backgroundColor: 'red'
    },
    messageItemRight: {
        marginRight: 12
    },
    messageItemLeft: {
        marginLeft: 12
    },
    messageItemLeftName: {
        color: 'rgb(17, 24, 39)',
        fontWeight: '500',
        fontSize: Size.text - 1,
        alignSelf: 'flex-start'
    },
    messageItemRightName: {
        color: 'rgb(17, 24, 39)',
        fontWeight: '500',
        fontSize: Size.text - 1,
        alignSelf: 'flex-end'
    },
    messageItemRightViewContent: {
        padding: 8,
        backgroundColor: 'rgb(40, 84, 246)',
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderTopLeftRadius: 12
    },
    messageItemLeftViewContent: {
        padding: 8,
        backgroundColor: 'rgb(243, 244, 246)',
        borderBottomRightRadius: 12,
        borderBottomLeftRadius: 12,
        borderTopRightRadius: 12
    },
    messageItemLeftViewContentImg: {
        padding: 0,
        backgroundColor: 'transparent'
    },
    messageItemLeftContent: {
        fontSize: Size.text,
        color: '#000',
    },
    messageItemRightContent: {
        fontSize: Size.text,
        color: '#fff',
    }
})