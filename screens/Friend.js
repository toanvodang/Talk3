import { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Image, Keyboard,
    TouchableWithoutFeedback, LayoutAnimation, TextInput
} from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Size, Colors } from '../utilities/Styles';
import Svg, { Path } from 'react-native-svg';
// import { ScrollView, TextInput } from 'react-native-gesture-handler';
import avatarDefault from '../assets/default.8a7fd05f.png';
import Toast from 'react-native-root-toast';
// import Constants from '../utilities/Constants';
import { LocalStore } from '../services/LocalStorageService';
import SocketIOService from '../services/SocketIOService';
import HttpService, { baseURL } from '../services/HttpService';

function FriendInvitation({ friendItem, goBack, profile, receiveFriend, socket, setReceiveFriend }) {

    const [receiveData, setReceiveData] = useState([...receiveFriend]);
    const currDate = new Date();

    const handleAcceptOrReject = (obj, _id) => {
        socket.emit('reply_friend', obj, res => {
            const { data, success, error } = res;

            if (success == 1) {
                Toast.show(data, { position: Toast.positions.CENTER });

                const filterFriend = receiveData.filter(item => item._id !== _id);
                setReceiveData([...filterFriend]);
                setReceiveFriend([...filterFriend]);
            }
            else if (error) {
                Toast.show(error, { position: Toast.positions.CENTER });
            }
        })
    }

    return (<View style={styles.friendView}>
        <TouchableOpacity style={styles.friendHeader} activeOpacity={.7} onPress={() => goBack && goBack()}>
            <Svg data-v-0122e182="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg"><Path data-v-0122e182="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
            <Text style={[styles.label, { marginLeft: 0 }]}>{friendItem.label}</Text>
        </TouchableOpacity>

        <View style={styles.friendInvitationContent}>
            <Svg width="16" height="16" data-v-0122e182="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/Svg" viewBox="0 0 512 512" class="w-4 h-4 mr-2 fill-current"><Path data-v-0122e182="" fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></Path></Svg>
            <Text style={[styles.label, { marginLeft: 5, color: 'rgb(29, 78, 216)' }]}>{receiveData.length + ' ' + friendItem.label.toLowerCase()}</Text>
        </View>

        {receiveData.length > 0 && (
            receiveData.map(itemReceive => {
                const item = itemReceive['A'];
                let betweenTimeText = '';

                if (itemReceive.createdAt) {
                    let betweenTime = (currDate - new Date(itemReceive.createdAt)) / 1000;

                    if (betweenTime < 60) {
                        betweenTimeText = 'a few seconds ago';
                    }
                    else if (betweenTime / 60 < 1) {
                        betweenTimeText = 'a minute ago';
                    }
                    else if (betweenTime / 60 < 60) {
                        let round = Math.round(betweenTime / 60);
                        betweenTimeText = round + ' minutes ago';
                    }
                    else if (betweenTime / 3600 < 24) {
                        let round = Math.round(betweenTime / 3600);
                        betweenTimeText = round + ' hours ago';
                    }
                    else if (betweenTime / (24 * 3600) >= 1) {
                        let round = Math.round(betweenTime / (24 * 3600));
                        betweenTimeText = round + ' days ago';
                    }
                }

                return (<View style={styles.receiveFriend} key={item._id}>
                    {item.avatar ? <Image source={{ uri: baseURL + item.avatar }} style={{ width: 48, height: 48, borderRadius: 48 }} />
                        : <Image source={avatarDefault} style={{ width: 48, height: 48 }} />}
                    <View style={styles.receiveFriendInfo}>
                        <View style={styles.receiveFriendInfoTop}>
                            <Text style={styles.receiveFriendInfoTopName}>{item.fullname || item.username}</Text>
                            <Text style={styles.receiveFriendInfoTopTime}>{betweenTimeText}</Text>
                        </View>
                        <View style={styles.receiveFriendBot}>
                            <TouchableOpacity style={styles.receiveFriendInfoBotAccept}
                                onPress={() => handleAcceptOrReject({ _idFriend: item._id, status: 1 }, itemReceive._id)}>
                                <Text style={styles.receiveFriendInfoBotAcceptText}>Chấp nhận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.receiveFriendInfoReject}
                                onPress={() => handleAcceptOrReject({ _idFriend: item._id, status: 0 }, itemReceive._id)}>
                                <Text style={styles.receiveFriendInfoRejectText}>Từ chối</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>)
            })
        )}
    </View>)
}

function FriendList({ friendItem, goBack, navigation, userInfo }) {
    const [inputSearch, setInputSearch] = useState({ value: null, isFocus: false })
    const [data, setData] = useState([])

    useEffect(() => {

        HttpService.Get('api/friend/lists/')
            .then(res => {
                if (res) {
                    const { success, data, error } = res

                    if (success === 1 && data && data.items) {
                        setData([...data.items])
                    }
                    else if (success === 0 && error) {
                        Toast.show(error, { position: Toast.positions.CENTER });
                    }
                }
            })
    }, [])

    const handleFilter = () => {
        Keyboard.dismiss()
    }

    const handleToDialog = (item) => {
        if (item) {
            HttpService.Get('api/group/room/' + item._id + '?isParallel=1')
                .then(res => {
                    if (res) {
                        const { success, error, data } = res;

                        if (success == 1) {
                            const { _id } = data;

                            navigation.navigate('Dialog', {
                                userInfo: { ...userInfo },
                                groupInfo: {
                                    ...item,
                                    isGroup: false,
                                    infoGroupItemName: item.fullname || item.username,
                                    avatar: item.avatar ? baseURL + item.avatar : null,
                                    me: { ...userInfo.me },
                                    to: _id
                                }
                            })
                        }
                        else if (error) {
                            Toast.show(error, { position: Toast.positions.CENTER });
                        }
                    }
                })
        }
        // console.log(item, 'friend item');

    }

    return (<View style={[, styles.friendView]}>
        <TouchableOpacity style={styles.friendHeader} activeOpacity={.7} onPress={() => goBack && goBack()}>
            <Svg data-v-0122e182="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg"><Path data-v-0122e182="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
            <Text style={[styles.label, { marginLeft: 0 }]}>{friendItem.label}</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <View style={[styles.friendFilterSearch, inputSearch.isFocus && styles.inputFocus]}>
                    <TouchableOpacity style={{ height: 45, justifyContent: 'center' }} activeOpacity={.7} onPress={handleFilter}>
                        <Svg width="20" height="20" data-v-9ddc16f8="" aria-hidden="true" fill="rgb(107, 114, 128)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-50"><Path data-v-9ddc16f8="" fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></Path></Svg>
                    </TouchableOpacity>
                    <TextInput
                        returnKeyType='go'
                        placeholder='Tìm kiếm'
                        placeholderTextColor={'rgb(107, 114, 128)'}
                        onBlur={() => setInputSearch({ ...inputSearch, isFocus: false })}
                        onFocus={() => setInputSearch({ ...inputSearch, isFocus: true })}
                        onChangeText={value => setInputSearch({ ...inputSearch, value })}
                        value={inputSearch.value}
                        autoCapitalize={"none"}
                        onSubmitEditing={handleFilter}
                        style={styles.inputStyle}
                    />
                </View>
                <View>
                    <View style={styles.friendFilterCountResult}>
                        <Svg width="16" height="16" data-v-0122e182="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/Svg" viewBox="0 0 512 512" class="w-4 h-4 mr-2 fill-current"><Path data-v-0122e182="" fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></Path></Svg>
                        <Text style={[styles.label, { marginLeft: 5, color: 'rgb(29, 78, 216)' }]}>{data.length} bạn bè</Text>
                    </View>

                    <View style={{ height: Size.deviceheight - 190 }}>
                        <FlashList
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => {
                                return (<TouchableOpacity style={styles.friendRequestResultItem} activeOpacity={.7}
                                    onPress={() => handleToDialog(item)}>
                                    <Image source={avatarDefault} style={{ width: 48, height: 48 }} />
                                    <Text style={styles.friendListInfoName}>{item.username}</Text>
                                </TouchableOpacity>)
                            }}
                            estimatedItemSize={50}
                            data={data}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </View >)
}

function FriendRequest({ friendItem, goBack, profile }) {
    const [inputSearch, setInputSearch] = useState({ value: null, isFocus: false })
    const [data, setData] = useState([])

    useEffect(() => {
        HttpService.Get('api/friend/request/')
            .then(res => {
                if (res) {
                    const { success, data, error } = res

                    if (success === 1 && data && data.items) {
                        setData([...data.items])
                    }
                    else if (success === 0 && error) {
                        Toast.show(error, { position: Toast.positions.CENTER });
                    }
                }
            })
    }, [])

    const handleFilter = () => {
        Keyboard.dismiss();
        //alert('on filter with key: ' + inputSearch.value)
    }

    return (<View style={styles.friendView}>
        <TouchableOpacity style={styles.friendHeader} activeOpacity={.7} onPress={() => goBack && goBack()}>
            <Svg data-v-0122e182="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg"><Path data-v-0122e182="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
            <Text style={[styles.label, { marginLeft: 0 }]}>{friendItem.label}</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <View style={[styles.friendFilterSearch, inputSearch.isFocus && styles.inputFocus]}>
                    <TouchableOpacity style={{ height: 45, justifyContent: 'center' }} activeOpacity={.7} onPress={handleFilter}>
                        <Svg width="20" height="20" data-v-9ddc16f8="" aria-hidden="true" fill="rgb(107, 114, 128)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-50"><Path data-v-9ddc16f8="" fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></Path></Svg>
                    </TouchableOpacity>
                    <TextInput
                        returnKeyType='go'
                        placeholder='Tìm kiếm'
                        placeholderTextColor={Colors.textGray900}
                        onBlur={() => setInputSearch({ ...inputSearch, isFocus: false })}
                        onFocus={() => setInputSearch({ ...inputSearch, isFocus: true })}
                        onChangeText={value => setInputSearch({ ...inputSearch, value })}
                        value={inputSearch.value}
                        autoCapitalize={"none"}
                        onSubmitEditing={handleFilter}
                        style={styles.inputStyle}
                    />
                </View>
                <View>
                    <View style={styles.friendFilterCountResult}>
                        <Svg width="16" height="16" data-v-0122e182="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/Svg" viewBox="0 0 512 512" class="w-4 h-4 mr-2 fill-current"><Path data-v-0122e182="" fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></Path></Svg>
                        <Text style={[styles.label, { marginLeft: 5, color: 'rgb(29, 78, 216)' }]}>{data.length} yêu cầu đã gửi</Text>
                    </View>

                    <View style={{ height: Size.deviceheight - 190 }}>
                        <FlashList
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => {
                                return (<View style={styles.friendRequestResultItem}>
                                    <Image source={avatarDefault} style={{ width: 48, height: 48 }} />
                                    <View style={styles.friendRequestItemInfo}>
                                        <Text style={styles.infoName}>{item.B.username}</Text>
                                        <Text style={styles.infoNameDate}>
                                            {item.createdAt && new Date(item.createdAt).getDate()
                                                + '/'
                                                + new Date(item.createdAt).getMonth()
                                                + '/'
                                                + new Date(item.createdAt).getFullYear()
                                            }
                                        </Text>
                                    </View>
                                </View>)
                            }}
                            estimatedItemSize={50}
                            data={data}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    </View>)
}

function FriendFilter({ friendItem, goBack, profile, socket }) {
    const [inputSearch, setInputSearch] = useState({ value: null, isFocus: false })
    const [data, setData] = useState([])

    const handleFilter = () => {

        Keyboard.dismiss();

        if (!inputSearch.value || inputSearch.value === '') return;

        HttpService.Get('api/friend/search/' + inputSearch.value)
            .then(res => {
                if (res) {
                    const { success, data, error } = res

                    if (success === 1 && data && data.items) {
                        setData([...data.items])
                    }
                    else if (success === 0 && error) {
                        Toast.show(error, { position: Toast.positions.CENTER });
                    }
                }
            })
    }

    const handleMakeFriend = (item) => {
        socket.emit('add_friend', { _idFriend: item._id }, res => {
            const { data, success, error } = res;

            if (success == 1) {
                Toast.show(data, { position: Toast.positions.CENTER });
            }
            else if (error) {
                Toast.show(error, { position: Toast.positions.CENTER });
            }
        })
    }

    return (<View style={styles.friendView}>
        <TouchableOpacity style={styles.friendHeader} activeOpacity={.7} onPress={() => goBack && goBack()}>
            <Svg data-v-0122e182="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg"><Path data-v-0122e182="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
            <Text style={[styles.label, { marginLeft: 0 }]}>{friendItem.label}</Text>
        </TouchableOpacity>
        <View>
            <View style={{ height: 100 }}>
                <View style={[styles.friendFilterSearch, inputSearch.isFocus && styles.inputFocus]}>
                    <TextInput
                        returnKeyType='go'
                        placeholderTextColor={'rgb(107, 114, 128)'}
                        placeholder='Tìm kiếm'
                        onBlur={() => setInputSearch({ ...inputSearch, isFocus: false })}
                        onFocus={() => setInputSearch({ ...inputSearch, isFocus: true })}
                        onChangeText={value => setInputSearch({ ...inputSearch, value })}
                        value={inputSearch.value}
                        autoCapitalize={"none"}
                        onSubmitEditing={handleFilter}
                        style={styles.inputStyle}
                    />
                    <TouchableOpacity style={{ height: 45, justifyContent: 'center' }} activeOpacity={.7} onPress={handleFilter}>
                        <Svg width="20" height="20" data-v-9ddc16f8="" aria-hidden="true" fill="rgb(168, 170, 175)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-50"><Path data-v-9ddc16f8="" fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></Path></Svg>
                    </TouchableOpacity>
                </View>

                <View style={styles.friendFilterCountResult}>
                    <Svg width="16" height="16" data-v-0122e182="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/Svg" viewBox="0 0 512 512" class="w-4 h-4 mr-2 fill-current"><Path data-v-0122e182="" fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></Path></Svg>
                    <Text style={[styles.label, { marginLeft: 5, color: 'rgb(29, 78, 216)' }]}>{data.length} kết quả</Text>
                </View>
            </View>
            <View style={{ height: Size.deviceheight - 195 }}>
                <FlashList
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => {
                        return (<View style={styles.friendFilterResultItem}>
                            <Image source={avatarDefault} style={{ width: 48, height: 48 }} />
                            <View style={styles.friendFilterResultItemInfo}>
                                <Text style={styles.infoName}>{item.username}</Text>
                                <TouchableOpacity onPress={() => handleMakeFriend(item)}
                                    style={styles.btnMakeFriend}>
                                    <Text style={styles.txtMakeFriend}>Kết bạn</Text>
                                </TouchableOpacity>
                            </View>
                        </View>)
                    }}
                    estimatedItemSize={50}
                    data={data}
                />
            </View>
        </View>
    </View>)
}

export default function FriendScreen({ navigation, receiveFriend, setReceiveFriend, userInfoProp }) {
    // const { params } = route;
    // const { userInfo } = params;
    // console.log(userInfoProp, 'userInfoProp friend');
    const profile = LocalStore.getStore();

    const socket = SocketIOService(profile);

    const toggleOpenShowFriend = (item) => {
        setFriendItem(item)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    };

    const objFriend = {
        friendInvitation: 'FriendInvitation', friendList: 'FriendList',
        friendRequest: 'FriendRequest', friendFilter: 'FriendFilter'
    };
    const arrFriend = [
        {
            name: objFriend.friendInvitation,
            label: 'Lời mời kết bạn',
            icon: <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M3.40991 22C3.40991 18.13 7.25991 15 11.9999 15C12.9599 15 13.8899 15.13 14.7599 15.37" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M22 18C22 18.32 21.96 18.63 21.88 18.93C21.79 19.33 21.63 19.72 21.42 20.06C20.73 21.22 19.46 22 18 22C16.97 22 16.04 21.61 15.34 20.97C15.04 20.71 14.78 20.4 14.58 20.06C14.21 19.46 14 18.75 14 18C14 16.92 14.43 15.93 15.13 15.21C15.86 14.46 16.88 14 18 14C19.18 14 20.25 14.51 20.97 15.33C21.61 16.04 22 16.98 22 18Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M19.49 17.98H16.51" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M18 16.52V19.51" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path>
            </Svg>
        },
        {
            name: objFriend.friendList,
            label: 'Danh sách bạn bè',
            icon: <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Path d="M9.16006 10.87C9.06006 10.86 8.94006 10.86 8.83006 10.87C6.45006 10.79 4.56006 8.84 4.56006 6.44C4.56006 3.99 6.54006 2 9.00006 2C11.4501 2 13.4401 3.99 13.4401 6.44C13.4301 8.84 11.5401 10.79 9.16006 10.87Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M4.15997 14.56C1.73997 16.18 1.73997 18.82 4.15997 20.43C6.90997 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.91997 12.73 4.15997 14.56Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M18.3401 20C19.0601 19.85 19.7401 19.56 20.3001 19.13C21.8601 17.96 21.8601 16.03 20.3001 14.86C19.7501 14.44 19.0801 14.16 18.3701 14" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
            </Svg>
        },
        {
            name: objFriend.friendRequest,
            label: 'Yêu cầu kết bạn',
            icon: <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Path d="M14.4399 19.05L15.9599 20.57L18.9999 17.53" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M12.16 10.87C12.06 10.86 11.94 10.86 11.83 10.87C9.44997 10.79 7.55997 8.84 7.55997 6.44C7.54997 3.99 9.53997 2 11.99 2C14.44 2 16.43 3.99 16.43 6.44C16.43 8.84 14.53 10.79 12.16 10.87Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M11.99 21.8101C10.17 21.8101 8.36004 21.3501 6.98004 20.4301C4.56004 18.8101 4.56004 16.1701 6.98004 14.5601C9.73004 12.7201 14.24 12.7201 16.99 14.5601" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
            </Svg>
        },
        {
            name: objFriend.friendFilter,
            label: 'Tìm bạn',
            icon: <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg">
                <Path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M18.2 21.4C19.9673 21.4 21.4 19.9673 21.4 18.2C21.4 16.4327 19.9673 15 18.2 15C16.4327 15 15 16.4327 15 18.2C15 19.9673 16.4327 21.4 18.2 21.4Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
                <Path d="M22 22L21 21" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></Path>
            </Svg>
        }]
    const [friendItem, setFriendItem] = useState()
    const renderView = () => {
        switch (friendItem.name) {
            case objFriend.friendInvitation:
                return <FriendInvitation friendItem={friendItem} goBack={setFriendItem} profile={profile}
                    socket={socket} receiveFriend={receiveFriend} setReceiveFriend={setReceiveFriend} />;
            case objFriend.friendList:
                return <FriendList friendItem={friendItem} goBack={setFriendItem} navigation={navigation} userInfo={userInfoProp} socket={socket} />;
            case objFriend.friendRequest:
                return <FriendRequest friendItem={friendItem} goBack={setFriendItem} profile={profile} socket={socket} />;
            case objFriend.friendFilter:
                return <FriendFilter friendItem={friendItem} goBack={setFriendItem} profile={profile} socket={socket} />;
            default:
                return null;
        }
    }

    return (<View style={styles.container}>
        {!friendItem && (<View><Text style={[styles.label, { paddingVertical: 20 }]}>Bạn bè</Text>
            {arrFriend.map(item => {
                return (<TouchableOpacity key={item.name} activeOpacity={.6} style={styles.friendList} onPress={() => { toggleOpenShowFriend(item) }}>
                    {item.icon}
                    <Text style={styles.label}>{item.label}</Text>
                </TouchableOpacity>)
            })}</View>)}

        <View>
            {friendItem && renderView()}
        </View>
    </View >
    )
}

const styles = StyleSheet.create({
    receiveFriend: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    receiveFriendInfo: {
        flex: 1,
        marginLeft: 10,
        flexDirection: 'corowlumn'
    },
    receiveFriendInfoTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4
    },
    receiveFriendInfoTopName: {
        color: 'rgb(17, 24, 39)',
        fontWeight: '500',
        fontSize: Size.text
    },
    receiveFriendInfoTopTime: {
        color: 'rgb(175, 175, 175)',
        fontSize: Size.text
    },
    receiveFriendBot: {
        flexDirection: 'row',
        // justifyContent: 'space-between',

    },
    receiveFriendInfoBotAccept: {
        backgroundColor: 'rgb(40, 84, 246)',
        paddingVertical: 12,
        paddingHorizontal: 11,
        borderRadius: 6,
        marginRight: 10
    },
    receiveFriendInfoBotAcceptText: {
        fontWeight: '500',
        fontSize: Size.text,
        color: '#fff'
    },
    receiveFriendInfoReject: {
        backgroundColor: 'rgb(209, 213, 219)',
        paddingVertical: 12,
        borderRadius: 6,
        paddingHorizontal: 11
    },
    receiveFriendInfoRejectText: {
        fontWeight: '500',
        fontSize: Size.text
    },
    container: {
        flex: 1,
        maxWidth: 420,
        width: '100%',
    },
    friendList: {
        paddingVertical: 25,
        paddingHorizontal: 30,
        flexDirection: 'row'
    },
    label: {
        fontSize: Size.text,
        color: '#000',
        marginLeft: 15,
    },
    friendView: {
        padding: 15
    },
    friendListInfoName: {
        marginLeft: 15,
        fontWeight: '500',
        fontSize: Size.text,
        color: Colors.textGray900
    },
    friendRequestResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 75,
    },
    friendRequestItemInfo: {
        marginLeft: 15,
        height: 75,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    friendFilterSearch: {
        backgroundColor: '#fff',
        height: 45,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        marginBottom: 10
    },
    inputStyle: {
        flex: 1,
        paddingLeft: 10,
        color: Colors.textGray900, //'#262626',
        fontSize: Size.text - 2,
        height: 45
    },
    inputFocus: {
        borderColor: 'rgb(40, 84, 246)'
    },
    friendFilterCountResult: {
        borderTopColor: '#ececf0',
        borderTopWidth: 1,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    friendFilterResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 75,
        marginBottom: 12
    },
    friendFilterResultItemInfo: {
        marginLeft: 15,
        height: 75,
        justifyContent: 'space-around'
    },
    infoName: {
        fontWeight: '500',
        fontSize: Size.text - 2,
        color: Colors.textGray900
    },
    infoNameDate: {
        color: 'rgb(175, 175, 175)',
        fontWeight: '400',
        fontSize: Size.text - 2
    },
    btnMakeFriend: {
        backgroundColor: 'rgb(40, 84, 246)',
        paddingVertical: 12,
        paddingHorizontal: 17,
        borderRadius: 7,
        // width: 100
    },
    txtMakeFriend: {
        fontWeight: '500',
        fontSize: Size.text - 2,
        color: '#fff'
    },
    friendInvitation: {
        fontSize: Size.text
    },
    friendHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15
    },
    friendInvitationContent: {
        borderTopColor: '#ececf0',
        borderTopWidth: 1,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 12
    }
})