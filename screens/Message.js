import { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Modal,
    Image, LayoutAnimation, TouchableWithoutFeedback
} from 'react-native';
import { Size } from '../utilities/Styles';
import Svg, { Path } from 'react-native-svg';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import avatarDefault from '../assets/default.8a7fd05f.png';
import { Ionicons } from '@expo/vector-icons';
import { LocalStore } from '../services/LocalStorageService';
import moment from "moment";
import SocketIOService from '../services/SocketIOService';


function MessageFilter({ setShowFilter, navigation }) {
    const refInputFilter = useRef()
    const [inputFilter, setInputFilter] = useState({ value: null, isFocus: true })
    const [showFriend, setShowFriend] = useState(true)
    const [showGroup, setShowGroup] = useState(true)

    const toggleOpenShowFriend = () => {
        setShowFriend(!showFriend);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    const toggleOpenShowGroup = () => {
        setShowGroup(!showGroup);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    return (<View>
        <View style={{ flexDirection: 'row', paddingVertical: 16, marginLeft: -15, alignItems: 'center' }}>
            <TouchableOpacity activeOpacity={.7} onPress={() => setShowFilter && setShowFilter(false)}
                style={{ paddingHorizontal: 5 }}>
                <Svg data-v-f6fa0f44="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path data-v-f6fa0f44="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
            </TouchableOpacity>
            <View style={[{
                flex: 1, height: 42, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                borderRadius: 8, borderWidth: 1, paddingLeft: 5, borderColor: 'transparent'
            }, inputFilter.isFocus && styles.inputFilterFocus]}>
                <Svg width={20} height={20} data-v-f6fa0f44="" aria-hidden="true" fill="rgb(107, 114, 128)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500"><Path data-v-f6fa0f44="" fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></Path></Svg>
                <TextInput
                    returnKeyType='go'
                    placeholder='Tìm kiếm'
                    placeholderTextColor={'rgb(107, 114, 128)'}
                    ref={refInputFilter}
                    onBlur={() => setInputFilter({ ...inputFilter, isFocus: false })}
                    onFocus={() => setInputFilter({ ...inputFilter, isFocus: true })}
                    onChangeText={value => setInputFilter({ ...inputFilter, value })}
                    value={inputFilter.value}
                    autoCapitalize={"none"}
                    // onSubmitEditing={handleFilter}
                    style={[styles.inputStyle, { paddingLeft: 5, color: 'rgb(17, 24, 39)' }]}
                />
            </View>
        </View>

        <ScrollView>
            <TouchableOpacity style={styles.messageFilterGroup} activeOpacity={.7} onPress={toggleOpenShowFriend}>
                <Text style={styles.messageFilterGroupName}>Bạn bè</Text>
                <View style={showFriend && styles.rotateIcon}>
                    <Svg data-v-f6fa0f44="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><Path data-v-f6fa0f44="" d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
                </View>
            </TouchableOpacity>

            {showFriend && (<View>
                <TouchableOpacity style={styles.friendMessage} activeOpacity={.7} onPress={() => navigation.navigate('Dialog')}>
                    <View>
                        <Image source={avatarDefault} style={styles.messageFilterImg} />
                        <View style={[styles.iconDot, styles.iconDotOnline]}></View>
                    </View>

                    <Text style={styles.messageFilterNickname}>ss</Text>
                </TouchableOpacity>
            </View>)}

            <TouchableOpacity style={styles.messageFilterGroup} activeOpacity={.7} onPress={toggleOpenShowGroup}>
                <Text style={styles.messageFilterGroupName}>Nhóm</Text>
                <View style={showGroup && styles.rotateIcon}>
                    <Svg data-v-f6fa0f44="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><Path data-v-f6fa0f44="" d="M19.9201 8.94995L13.4001 15.47C12.6301 16.24 11.3701 16.24 10.6001 15.47L4.08008 8.94995" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
                </View>
            </TouchableOpacity>

            {showGroup && (<View>
                <TouchableOpacity style={styles.friendMessage} activeOpacity={.7} onPress={() => navigation.navigate('Dialog')}>
                    <View>
                        <Image source={avatarDefault} style={styles.messageFilterImg} />
                    </View>
                    <View style={styles.friendMessageGroupInfo}>
                        <Text style={styles.messageFilterNickname}>ss</Text>
                        <Text style={styles.nicknameGroup}>@ss</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.friendMessage} activeOpacity={.7} onPress={() => navigation.navigate('Dialog')}>
                    <View>
                        <Image source={avatarDefault} style={styles.messageFilterImg} />
                    </View>
                    <View style={styles.friendMessageGroupInfo}>
                        <Text style={styles.messageFilterNickname}>ss</Text>
                        <Text style={styles.nicknameGroup}>@ss</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.friendMessage} activeOpacity={.7} onPress={() => navigation.navigate('Dialog')}>
                    <View>
                        <Image source={avatarDefault} style={styles.messageFilterImg} />
                    </View>
                    <View style={styles.friendMessageGroupInfo}>
                        <Text style={styles.messageFilterNickname}>ss</Text>
                        <Text style={styles.nicknameGroup}>@ss</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.friendMessage} activeOpacity={.7} onPress={() => navigation.navigate('Dialog')}>
                    <View>
                        <Image source={avatarDefault} style={styles.messageFilterImg} />
                    </View>
                    <View style={styles.friendMessageGroupInfo}>
                        <Text style={styles.messageFilterNickname}>ss</Text>
                        <Text style={styles.nicknameGroup}>@ss</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.friendMessage} activeOpacity={.7} onPress={() => navigation.navigate('Dialog')}>
                    <View>
                        <Image source={avatarDefault} style={styles.messageFilterImg} />
                    </View>
                    <View style={styles.friendMessageGroupInfo}>
                        <Text style={styles.messageFilterNickname}>ss</Text>
                        <Text style={styles.nicknameGroup}>@ss</Text>
                    </View>
                </TouchableOpacity>
            </View>)}

        </ScrollView>
    </View >)
}

export default function MessageScreen({ navigation }) {
    // console.log(socket, 'ss');
    const refUserInfo = useRef();
    const [showBtnCreateGroup, setShowBtnCreateGroup] = useState(false);
    const [showModalCreateGroup, setShowModalCreateGroup] = useState(true);
    const [groupInfo, setGroupInfo] = useState({ groupPrefix: null, name: null });
    const [isShowFriend, setIsShowFriend] = useState(true);
    const [showFilter, setShowFilter] = useState(false);
    const [focus, setFocus] = useState();
    const [userInfo, setUserInfo] = useState();
    const localStore = LocalStore.getStore();
    const socket = SocketIOService(localStore);
    const refGroupName = useRef();
    const refGroupPrefix = useRef();

    const handleSetUserInfo = useCallback((data) => {
        const { me, lastMessages } = data,
            { messages } = lastMessages;

        if (me.avatar) {
            me.avatar = 'https://chat.cybercode88.com/' + me.avatar;
        }
        else {
            me.avatar = null;
        }

        messages.sort((a, b) => {
            return parseInt(b.createdAt) - parseInt(a.createdAt);
        });
        // console.log(data, 'handleSetUserInfo--')
        refUserInfo.current = { ...data };
        setUserInfo({ ...data });
    }, []);

    const handleUserOnline = useCallback((data) => {
        // console.log(data, 'handleUserOnline--');
        const { friendsOnline } = refUserInfo.current;
        setUserInfo({
            ...refUserInfo.current,
            friendsOnline: [...friendsOnline, data]
        })
    }, []);

    const handleUserOffline = useCallback((data) => {
        // console.log(data, 'handleUserOffline--');
        const { friendsOnline } = refUserInfo.current,
            filter = friendsOnline.filter(item => item._id != data._id);
        setUserInfo({
            ...refUserInfo.current,
            friendsOnline: [...filter]
        })
    }, []);


    const handleMessage = useCallback((data) => {
        const { lastMessages } = refUserInfo.current,
            { messages } = lastMessages,
            filterMessage = messages.filter(item => item.to != data.to);

        setUserInfo({
            ...refUserInfo.current,
            lastMessages: {
                ...lastMessages,
                messages: [{ ...data, from: data.from._id }, ...filterMessage]
            }
        })
    }, []);


    useEffect(() => {
        // socket.on('connect', () => console.log(socket.id, 'connect--'))
        socket.on('user_info', (data) => handleSetUserInfo(data));
        socket.on('user_online', (data) => handleUserOnline(data));
        socket.on('user_offline', (data) => handleUserOffline(data));
        socket.on('message', (data) => {
            handleMessage(data);
        });

        return () => {
            // console.log('disconnect');
            socket.off("user_info", handleSetUserInfo);
            socket.off("user_online", handleUserOnline);
            socket.off("user_offline", handleUserOffline);
            socket.off('message', handleMessage)
            socket.disconnect();
        };
    }, [])

    const toggleShowFilter = () => {
        setShowFilter(!showFilter)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    const handleNavDialog = (itemGroup) => {

    }

    const renderLastMessage = () => {
        const { lastMessages, friendsOnline, me } = userInfo,
            { messages, infoGroup, fromUsersList } = lastMessages;

        return <View style={{ height: Size.deviceheight - 235 }}>
            <ScrollView>
                {messages.map(item => {
                    const infoGroupItem = infoGroup[item.to],
                        messageLastFrom = fromUsersList[item.from];

                    let infoGroupItemName = '',
                        messageLastFromName = '',
                        messageLast = '',
                        avatar = null,
                        isOnline = true;

                    if (item.message !== '') {
                        messageLast = item.message
                    }
                    else if (item.media) {
                        messageLast = 'Đã đính kèm 1 tệp';
                    }

                    if (messageLastFrom && messageLastFrom._id == me._id) {
                        messageLastFromName = 'Bạn: ' + messageLast;
                    }
                    else if (messageLastFrom) {
                        messageLastFromName = messageLastFrom.username + ': ' + messageLast;
                    }

                    if (infoGroupItem.isParallel == 1) {
                        const { createdBy, members } = infoGroupItem;

                        if (createdBy && createdBy._id == me._id) {
                            const findMemberByUserCreate = members.find(itemMember => itemMember._id != createdBy._id);

                            if (findMemberByUserCreate) {
                                infoGroupItemName = findMemberByUserCreate.fullname || findMemberByUserCreate.username;
                                avatar = findMemberByUserCreate.avatar && 'https://chat.cybercode88.com/' + findMemberByUserCreate.avatar;
                            }
                        }
                        else {
                            infoGroupItemName = createdBy.fullname || createdBy.username;
                            avatar = createdBy.avatar && 'https://chat.cybercode88.com/' + createdBy.avatar;
                        }

                        const findMemberByMe = members.find(itemMember => itemMember._id != me._id);
                        const findMemberOnline = friendsOnline.find(itemOnline => itemOnline._id == findMemberByMe._id);

                        if (!findMemberOnline) {
                            isOnline = false;
                        }
                    }
                    else {
                        infoGroupItemName = infoGroupItem.name;
                    }

                    if (infoGroupItem) {
                        return (<TouchableOpacity style={styles.friendMessage} activeOpacity={.7} key={item.to}
                            onPress={() => navigation.navigate('Dialog', { itemGroup: { ...item, infoGroupItemName, avatar, me: { ...me } } })}>
                            <View>
                                {avatar ? <Image source={{ uri: avatar }} style={{ width: 36, height: 36, borderRadius: 36 }} />
                                    : <Image source={avatarDefault} style={{ width: 36, height: 36, borderRadius: 36 }} />}
                                <View style={[styles.iconDot, isOnline ? styles.iconDotOnline : styles.iconDotOffline]}></View>
                            </View>
                            <View style={styles.friendMessageInfo}>
                                <View style={styles.friendMessageInfoText}>
                                    {infoGroupItem.isParallel == 0 && <Ionicons name="people" size={Size.text} color="#a9a9a9" />}
                                    <Text style={styles.infoFriendName}>{infoGroupItemName}</Text>
                                </View>
                                <Text style={styles.nickname}>{messageLastFromName}</Text>
                            </View>
                            <Text style={styles.infoFriendNameDate}>{item.createdAt && moment(parseInt(item.createdAt)).format('HH:mm')}</Text>
                        </TouchableOpacity>)
                    }

                    return <View></View>;
                })}
            </ScrollView></View>
    }

    const handleShowModalCreateGroup = () => {
        setShowBtnCreateGroup(false)
    }

    const handleCreateGroup = () => {
        const { groupPrefix, name } = groupInfo;
        // socket.emit('create_group', {
        //     groupPrefix: "@g2",
        //     name: "g22"
        // }, (data) => {
        //     console.log(data, 'create_group--');
        // })
    }

    return (<View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => setShowBtnCreateGroup(false)}>
            {showFilter ? <MessageFilter setShowFilter={toggleShowFilter} navigation={navigation} /> :
                (<View>
                    <View style={{ flexDirection: 'row', paddingVertical: 15 }}>
                        {userInfo && userInfo.me.avatar ? <Image source={{ uri: userInfo.me.avatar }} style={{ width: 48, height: 48, borderRadius: 48 }} />
                            : <Image source={avatarDefault} style={{ width: 48, height: 48, borderRadius: 48 }} />}
                        <Text style={{ fontWeight: '600', color: '#070131', fontSize: Size.text + 4.8, marginLeft: 10 }}>{userInfo && (userInfo.me.fullname || userInfo.me.username)}</Text>
                    </View>

                    {false && (<View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 }}>
                            <Text style={{ color: '#31363e', fontWeight: '500', fontSize: Size.text + 1.5 }}>Online Now</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ color: '#2854f6', fontSize: Size.text + 1.5 }}>1</Text>
                            </View>
                        </View>

                        <ScrollView>
                            <TouchableOpacity style={styles.friendMessage} activeOpacity={.7} onPress={() => navigation.navigate('Dialog')}>
                                <View>
                                    <Image source={avatarDefault} style={{ width: 36, height: 36, borderRadius: 36 }} />
                                    <View style={[styles.iconDot, styles.iconDotOnline]}></View>
                                </View>
                                <View style={styles.friendMessageInfo}>
                                    <View style={styles.friendMessageInfoText}>
                                        <Ionicons name="people" size={Size.text} color="#a9a9a9" />
                                        <Text style={styles.infoFriendName}>ss</Text>
                                    </View>
                                    <Text style={styles.nickname}>@ss</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.friendMessage} activeOpacity={.7} onPress={() => navigation.navigate('Dialog')}>
                                <View>
                                    <Image source={avatarDefault} style={{ width: 36, height: 36, borderRadius: 36 }} />
                                    <View style={[styles.iconDot, styles.iconDotOnline]}></View>
                                </View>
                                <View style={styles.friendMessageInfo}>
                                    <View style={styles.friendMessageInfoText}>
                                        <Ionicons name="people" size={Size.text} color="#a9a9a9" />
                                        <Text style={styles.infoFriendName}>ss</Text>
                                    </View>
                                    <Text style={styles.nickname}>@ss</Text>
                                </View>
                                <Text style={styles.infoFriendNameDate}>05:10</Text>
                            </TouchableOpacity>

                        </ScrollView>
                    </View>
                    )}

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, position: 'relative', zIndex: 1 }}>
                            <Text style={{ color: '#31363e', fontWeight: '500', fontSize: Size.text + 1.5 }}>Tin nhắn</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity style={{ marginRight: 15 }} onPress={() => setShowBtnCreateGroup(true)}>
                                    <Svg data-v-b9e5ec02="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 cursor-pointer"><Path data-v-b9e5ec02="" d="M12 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V11.5" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path><Path data-v-b9e5ec02="" d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path><Path data-v-b9e5ec02="" d="M19.21 14.77L15.6701 18.31C15.5301 18.45 15.4 18.71 15.37 18.9L15.18 20.25C15.11 20.74 15.45 21.0801 15.94 21.0101L17.29 20.82C17.48 20.79 17.75 20.66 17.88 20.52L21.4201 16.9801C22.0301 16.3701 22.3201 15.6601 21.4201 14.7601C20.5301 13.8701 19.82 14.16 19.21 14.77Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path><Path data-v-b9e5ec02="" d="M18.7001 15.28C19.0001 16.36 19.8401 17.2 20.9201 17.5" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
                                </TouchableOpacity>

                                {showBtnCreateGroup && <View style={{ flex: 1 }}><View style={{
                                    position: 'absolute',
                                    width: 150,
                                    top: 24,
                                    right: 14,
                                    backgroundColor: '#fff',
                                    borderRadius: 8,
                                }}>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 10
                                    }} onPress={() => handleShowModalCreateGroup()}>
                                        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <Path d="M9.16006 10.87C9.06006 10.86 8.94006 10.86 8.83006 10.87C6.45006 10.79 4.56006 8.84 4.56006 6.44C4.56006 3.99 6.54006 2 9.00006 2C11.4501 2 13.4401 3.99 13.4401 6.44C13.4301 8.84 11.5401 10.79 9.16006 10.87Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                                            <Path d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                                            <Path d="M4.15997 14.56C1.73997 16.18 1.73997 18.82 4.15997 20.43C6.90997 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.91997 12.73 4.15997 14.56Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                                            <Path d="M18.3401 20C19.0601 19.85 19.7401 19.56 20.3001 19.13C21.8601 17.96 21.8601 16.03 20.3001 14.86C19.7501 14.44 19.0801 14.16 18.3701 14" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                                        </Svg>
                                        <Text style={{ flex: 1, marginLeft: 10 }}>Tạo nhóm</Text>

                                    </TouchableOpacity>
                                </View></View>}

                                <TouchableOpacity onPress={() => setIsShowFriend(!isShowFriend)}>
                                    <Svg data-v-b9e5ec02="" width="24" height="24" viewBox="0 0 24 24" fill={isShowFriend ? 'none' : '#000'} xmlns="http://www.w3.org/2000/svg" class="cursor-pointer"><Path data-v-b9e5ec02="" d="M12.7276 2.43234L14.4875 5.95195C14.7274 6.4419 15.3674 6.91184 15.9073 7.00183L19.0969 7.53177C21.1367 7.87173 21.6167 9.35156 20.1468 10.8114L17.6671 13.2911C17.2471 13.7111 17.0172 14.521 17.1472 15.1009L17.8571 18.1706C18.417 20.6003 17.1272 21.5402 14.9774 20.2703L11.9877 18.5005C11.4478 18.1806 10.5579 18.1806 10.008 18.5005L7.01826 20.2703C4.8785 21.5402 3.57864 20.5903 4.13858 18.1706L4.8485 15.1009C4.97849 14.521 4.74851 13.7111 4.32856 13.2911L1.84884 10.8114C0.389001 9.35156 0.858948 7.87173 2.89872 7.53177L6.08836 7.00183C6.6183 6.91184 7.25823 6.4419 7.4982 5.95195L9.25804 2.43234C10.2179 0.522553 11.7778 0.522553 12.7276 2.43234Z" stroke="#292D32" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{
                            backgroundColor: '#fff',
                            height: 45,
                            borderRadius: 5,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingHorizontal: 10,
                            borderWidth: 1,
                            borderColor: 'transparent',
                            marginVertical: 20
                        }}>
                            <TouchableOpacity style={{ height: 45, flex: 1, flexDirection: 'row', alignItems: 'center' }}
                                activeOpacity={.7} onPress={toggleShowFilter}>
                                <Svg width="20" height="20" data-v-9ddc16f8="" aria-hidden="true" fill="rgb(107, 114, 128)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-50"><Path data-v-9ddc16f8="" fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></Path></Svg>
                                <Text style={{ paddingLeft: 5 }}>Tìm kiếm</Text>
                            </TouchableOpacity>
                        </View>

                        {userInfo && isShowFriend && renderLastMessage()}
                    </View>
                </View>)}
        </TouchableWithoutFeedback>

        <Modal animationType="slide" transparent={true} visible={showModalCreateGroup}>
            <View style={styles.fromInput}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Tên nhóm</Text>
                    <View style={[styles.control, focus == 'name' && styles.controlFocus]}>
                        <TextInput
                            onChangeText={name => setGroupInfo({ ...groupInfo, name })}
                            onFocus={() => setFocus('name')}
                            onBlur={() => setFocus()}
                            value={groupInfo.name}
                            ref={refGroupName}
                            returnKeyType={'done'}
                            placeholder={'Tên nhóm'}
                            style={[styles.text, styles.inputStyle]} />
                    </View>
                </View>

                <View style={styles.formControl}>
                    <Text style={styles.label}>Prefix</Text>
                    <View style={[styles.control, focus == 'groupPrefix' && styles.controlFocus]}>
                        <TextInput
                            onChangeText={groupPrefix => setGroupInfo({ ...groupInfo, groupPrefix })}
                            value={groupInfo.groupPrefix}
                            onFocus={() => setFocus('groupPrefix')}
                            onBlur={() => setFocus()}
                            returnKeyType={'done'}
                            placeholder={'@nhom_cua_ban'}
                            ref={refGroupPrefix}
                            style={[styles.text, styles.inputStyle]} />
                    </View>
                </View>

                <View style={styles.styViewLogin}>
                    <TouchableOpacity onPress={() => handleCreateGroup()}>
                        <Text style={styles.styTextLogin}>Tạo nhóm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    </View>
    )
}

const styles = StyleSheet.create({
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
    // inputStyle: {
    //     flex: 1,
    //     paddingLeft: 10,
    //     color: 'rgb(17, 24, 39)',
    //     fontSize: Size.text
    // },
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


    rotateIcon: {
        transform: [{ translateX: 0 }, { translateY: 0 }, { rotate: '180deg' },
        { skewX: '0deg' }, { skewY: '0deg' }, { scaleY: 1 }, { scaleX: 1 }]
    },
    messageFilterGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingVertical: 10
    },
    messageFilterGroupName: {
        fontSize: Size.text
    },
    messageFilterNickname: {
        fontSize: Size.text,
        marginLeft: 16,
        fontWeight: '500',
        color: 'rgb(17, 24, 39)'
    },
    inputFilterFocus: {
        borderColor: '#2563eb'
    },
    container: {
        flex: 1,
        maxWidth: 420,
        width: '100%',
        paddingHorizontal: 15
    },
    friendMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32
    },
    messageFilterImg: {
        width: 48,
        height: 48,
        borderRadius: 48
    },
    iconDot: {
        width: 12,
        height: 12,
        borderRadius: 50,
        position: 'absolute',
        right: 0,
        bottom: 0,
        borderWidth: 2,
        borderColor: '#fff'
    },
    iconDotOnline: {
        backgroundColor: 'rgb(74, 222, 128)'
    },
    iconDotOffline: {
        backgroundColor: 'rgb(255, 144, 27)'
    },
    friendMessageInfo: {
        flex: 1,
        marginLeft: 15
    },
    friendMessageGroupInfo: {
        flex: 1
    },
    friendMessageInfoText: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoFriendName: {
        fontSize: Size.text,
        fontWeight: '500',
        marginLeft: 2,
        paddingBottom: 2
    },
    nickname: {
        color: 'rgb(148, 163, 184)',
        fontSize: Size.text - 2
    },
    nicknameGroup: {
        fontSize: Size.text - 2,
        color: 'color: rgb(17, 24, 39)',
        fontWeight: '400',
        marginLeft: 16
    },
    infoFriendNameDate: {
        color: 'rgb(107, 114, 128)',
        fontSize: Size.text - 2
    },
    inputStyle: {
        flex: 1,
        paddingLeft: 10,
        color: '#262626',
        fontSize: Size.text,
        fontWeight: '400',
        height: 45
    }
})