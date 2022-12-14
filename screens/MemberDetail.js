import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView, View, Text,
    TouchableOpacity, StyleSheet,
    Platform, Image
} from 'react-native';
import avatarDefault from '../assets/default.8a7fd05f.png';
import { Size } from '../utilities/Styles';
import { baseURL } from '../services/HttpService';
import Svg, { Path } from 'react-native-svg';
import HttpService from '../services/HttpService';
import SocketIOService from '../services/SocketIOService';
import { LocalStore } from '../services/LocalStorageService';
import Toast from 'react-native-root-toast';

export default function MemberDetailScreen({ navigation, route }) {
    const { params } = route;
    const { lastMedia, preload, userInfo, isBlockedFriendProp, groupInfo, member } = params;
    const localStore = LocalStore.getStore();
    const socket = SocketIOService(localStore);

    // console.log(userInfo.me, member._id, 'member');
    const [receiveFriend, setReceiveFriend] = useState([]);

    useEffect(() => {
        HttpService.Get('api/friend/lists/')
            .then(res => {
                if (res) {
                    const { success, data, error } = res

                    if (success === 1 && data && data.items) {
                        const { items } = data;
                        // console.log(items, 'ddd');
                        setReceiveFriend([...items]);
                    }
                    else if (success === 0 && error) {
                        //Toast.show(error, { position: Toast.positions.CENTER });
                    }
                }
            })
    }, []);

    const { avatar, _id, username, fullname } = member;
    let isMe = false;

    if (userInfo.me?._id == _id) {
        isMe = true;
    }

    const toDialogMember = () => {
        HttpService.Get('api/group/room/' + _id + '?isParallel=1')
            .then(res => {
                if (res) {
                    const { success, error, data } = res;

                    if (success == 1) {
                        const { lastMessages } = userInfo,
                            { infoGroup } = lastMessages,
                            _to = data._id,
                            infoGroupItem = infoGroup[_to],
                            { createdBy, members } = infoGroupItem;

                        const findMemberByUserCreate = members.find(itemMember => itemMember._id != createdBy._id);

                        let infoGroupItemName = '',
                            avatar = null;

                        if (findMemberByUserCreate) {
                            infoGroupItemName = findMemberByUserCreate.fullname || findMemberByUserCreate.username;
                            avatar = findMemberByUserCreate.avatar && 'https://chat.cybercode88.com/' + findMemberByUserCreate.avatar;
                        }

                        navigation.navigate('Dialog', {
                            userInfo,
                            groupInfo: {
                                ...groupInfo,
                                to: _to,
                                avatar,
                                infoGroupItemName
                            },
                            isReload: true
                        })
                    }
                    else if (error) {
                        Toast.show(error, { position: Toast.positions.CENTER });
                    }
                }
            })
    }

    const handleMakeFriend = () => {
        socket.emit('add_friend', { _idFriend: _id }, res => {
            const { data, success, error } = res;

            if (success == 1) {
                Toast.show(data, { position: Toast.positions.CENTER });
            }
            else if (error) {
                Toast.show(error, { position: Toast.positions.CENTER });
            }
        })
    }

    return (<KeyboardAvoidingView
        extraScrollHeight={150}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.navigate('HistoryMessage', {
                preload,
                userInfo,
                isBlockedFriendProp,
                groupInfo,
                lastMedia
            })}
                style={{
                    flexDirection: 'row',
                    height: 56,
                    paddingRight: 12,
                    alignItems: 'center'
                }}>
                <Svg data-v-a41a837c="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><Path data-v-a41a837c="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
                {/* <Text style={{ fontWeight: '500', fontSize: Size.text, marginLeft: 8 }}>Danh s??ch th??nh vi??n</Text> */}
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
                {avatar ? <Image source={{ uri: baseURL + avatar }} style={{ width: 64, height: 64, borderRadius: 64 }} /> :
                    <Image source={avatarDefault} style={{ width: 64, height: 64, borderRadius: 64 }} />}
                <Text style={{ marginTop: 10 }}>{'@' + username}</Text>

                {!isMe && (receiveFriend.length > 0 && receiveFriend.find(itemFriend => itemFriend._id == _id) ? (<TouchableOpacity onPress={() => toDialogMember()}
                    style={{
                        backgroundColor: 'rgb(40, 84, 246)',
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        borderRadius: 5,
                        marginTop: 10
                    }}>
                    <Text style={{ fontWeight: '500', fontSize: Size.text, color: '#fff' }}>G???i tin nh???n</Text>
                </TouchableOpacity>) : (<TouchableOpacity onPress={() => handleMakeFriend()}
                    style={{
                        backgroundColor: 'rgb(40, 84, 246)',
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        borderRadius: 5,
                        marginTop: 10
                    }}>
                    <Text style={{ fontWeight: '500', fontSize: Size.text, color: '#fff' }}>K???t b???n</Text>
                </TouchableOpacity>))}
            </View>
        </View>
    </KeyboardAvoidingView >)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
    },
    fileSharedItem: {
        marginTop: 12,
        backgroundColor: 'rgb(240, 242, 245)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        height: 64,
        flexDirection: 'row',
        alignItems: 'center'
    },
    fileSharedItemInfo: {
        marginLeft: 8
    },
    fileSharedItemName: {
        fontSize: Size.text,
        fontWeight: '700'
    },
    fileSharedItemSize: {
        fontSize: Size.text
    }
})