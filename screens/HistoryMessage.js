import { useEffect, useState } from 'react';
import {
    View, Text, Image,
    TouchableOpacity, StyleSheet,
    ScrollView, TouchableWithoutFeedback
} from 'react-native';
import Modal from 'react-native-modal';
import avatarDefault from '../assets/default.8a7fd05f.png';
import Svg, { Path, SvgUri } from 'react-native-svg';
import { Size } from '../utilities/Styles';
import { baseURL } from '../services/HttpService';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SimpleLineIcons } from '@expo/vector-icons';
import { LocalStore } from '../services/LocalStorageService';
import SocketIOService from '../services/SocketIOService';
import Toast from 'react-native-root-toast';

export default function HistoryMessageScreen({ navigation, route }) {
    const { params } = route;
    const { preload, userInfo, isBlockedFriendProp, groupInfo } = params;
    const { infoGroup, lastMedia } = preload;
    const [viewImage, setViewImage] = useState({ isShow: false, uri: null, fileType: null });
    const [showModalBlock, setShowModalBlock] = useState(false);
    const [isBlockedFriend, setIsBlockedFriend] = useState(isBlockedFriendProp)

    const localStore = LocalStore.getStore();
    const socket = SocketIOService(localStore);
    // console.log(groupInfo, 'groupInfo histo');
    useEffect(() => {
        lastMedia.sort((a, b) => {
            return parseInt(b.createdAt) - parseInt(a.createdAt);
        });
    }, [])

    const handleBlockOrUnblock = () => {
        const { members } = infoGroup,
            { me } = userInfo,
            findPartner = members.find(item => item._id != me._id);

        if (findPartner) {
            let status = isBlockedFriend ? 0 : 1;

            // console.log(findPartner._id, status, 'findPartner');
            socket.emit('block_or_unblock_friend', { status, _idFriend: findPartner._id }, res => {
                if (res) {
                    const { data, success, error } = res;

                    if (success == 1) {
                        Toast.show(data, { position: Toast.positions.CENTER });
                        setShowModalBlock(false);
                        setIsBlockedFriend(!isBlockedFriend);
                    }
                }
            })
        }
    }

    return (<View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => setShowModalBlock(false)}>
            <View style={{ flex: 1 }}>
                <StatusBar hidden={viewImage.isShow} />
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Dialog', {
                        preload, userInfo, isBlockedFriendProp, groupInfo
                    })} style={{
                        flex: 1,
                        height: 56,
                        justifyContent: 'center'
                    }}>
                        <Svg data-v-a41a837c="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><Path data-v-a41a837c="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowModalBlock(true)} style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        paddingRight: 10,
                        height: 56,
                        justifyContent: 'center',
                    }}>
                        <Svg data-v-a41a837c="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><Path data-v-a41a837c="" d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" stroke="#292D32" stroke-width="1.5"></Path><Path data-v-a41a837c="" d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" stroke="#292D32" stroke-width="1.5"></Path><Path data-v-a41a837c="" d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" stroke="#292D32" stroke-width="1.5"></Path></Svg>
                    </TouchableOpacity>
                </View>

                {infoGroup && infoGroup.isParallel == 1 && showModalBlock && <View style={{
                    position: 'absolute',
                    width: 200,
                    top: 45,
                    right: 10,
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    zIndex: 1
                }}>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 10
                    }} onPress={() => { handleBlockOrUnblock() }}>
                        <SimpleLineIcons name="ban" size={Size.iconSize} color="black" />
                        <Text style={{ flex: 1, marginLeft: 10, fontSize: Size.fontSize }}>{isBlockedFriend ? 'Bỏ chặn' : 'Chặn'}</Text>
                    </TouchableOpacity>
                </View>}

                <View style={{ alignItems: 'center' }}>
                    {groupInfo.avatar ? (<Image source={{ uri: groupInfo.avatar }} style={{ width: 64, height: 64, borderRadius: 64 }} />)
                        : (<Image source={avatarDefault} style={{ width: 64, height: 64, borderRadius: 64 }} />)}

                    <Text style={{ marginTop: 8, fontSize: Size.text + 2, fontWeight: '500' }}>{groupInfo.infoGroupItemName}</Text>
                </View>

                <View style={{
                    flex: 1,
                    paddingHorizontal: 12,
                    marginTop: 20
                }}>
                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between', height: 24,
                        alignItems: 'center'
                    }}>
                        <Text style={{ fontSize: Size.text }}>Đã chia sẻ</Text>
                        <TouchableOpacity style={{ color: '#4a6fc4' }}
                            onPress={() => navigation.navigate('FileShared', {
                                preload,
                                userInfo,
                                isBlockedFriendProp,
                                groupInfo,
                                lastMedia
                            })}>
                            <Text style={{ color: '#4a6fc4', textDecorationLine: 'underline', fontSize: Size.text }}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        {lastMedia.map(item => {
                            const { fileType, path, _id } = item;
                            const toUrl = baseURL + path;

                            if (fileType === 'image/png' || fileType === 'image/jpeg') {
                                return (<TouchableOpacity style={styles.historyItem} key={_id}
                                    onPress={() => setViewImage({ isShow: true, uri: toUrl, fileType })}>
                                    <Image source={{ uri: toUrl }} style={styles.historyItemImg} resizeMode={'contain'} />
                                </TouchableOpacity>)
                            }
                            else if (fileType === 'image/svg+xml') {
                                return (<TouchableOpacity onPress={() => setViewImage({ isShow: true, uri: toUrl, fileType })}
                                    style={styles.historyItem} key={_id}>
                                    <SvgUri
                                        width={'100%'}
                                        height={120}
                                        uri={toUrl}
                                    />
                                </TouchableOpacity>)
                            }
                        })}
                    </ScrollView>
                </View>
            </View>
        </TouchableWithoutFeedback >

        <Modal
            isVisible={viewImage.isShow}
            backdropColor={'#000'}
            backdropOpacity={.8}
            animationIn={'zoomInDown'}
            animationOut={'zoomOutUp'}
        >
            <View style={{
                borderRadius: 4,
                padding: 12,
                flex: 1
            }}>
                <TouchableOpacity onPress={() => setViewImage({ isShow: false, uri: null, fileType: null })}>
                    <Ionicons name="close-circle-outline" size={Size.iconSize + 4} color="#fff" />
                </TouchableOpacity>

                {(viewImage.fileType == 'image/png' || viewImage.fileType === 'image/jpeg')
                    && <Image source={{ uri: viewImage.uri }} style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 6
                    }} resizeMode={'contain'} />}

                {viewImage.fileType === 'image/svg+xml' && <SvgUri
                    width={'100%'}
                    height={'100%'}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 6
                    }}
                    uri={viewImage.uri}
                />}
            </View>
        </Modal>
    </View >)
}

const styles = StyleSheet.create({
    historyItem: {
        marginTop: 12,
        alignItems: 'center',
        backgroundColor: 'rgb(243, 244, 246)',
        borderRadius: 8,
        height: 120,
    },
    historyItemImg: {
        height: 120,
        width: '100%',
    },
    container: {
        flex: 1,
        paddingTop: 30,
    },
})