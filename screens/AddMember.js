import { useState } from 'react';
import {
    KeyboardAvoidingView, View, Text,
    TextInput, TouchableOpacity, StyleSheet,
    Platform, ScrollView,
    TouchableWithoutFeedback,
    Keyboard, Image
} from 'react-native';
import { Size } from '../utilities/Styles';
import Svg, { Path, SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import HttpService, { baseURL } from '../services/HttpService';
import avatarDefault from '../assets/default.8a7fd05f.png';
import { LocalStore } from '../services/LocalStorageService';
import SocketIOService from '../services/SocketIOService';
import Toast from 'react-native-root-toast';

export default function AddMemberScreen({ navigation, route }) {
    const { params } = route;
    const { lastMedia, preload, userInfo, isBlockedFriendProp, groupInfo } = params;
    const [search, setSearch] = useState();
    const [data, setData] = useState([]);

    const localStore = LocalStore.getStore();
    const socket = SocketIOService(localStore);

    const handleSearch = () => {
        if (search && search !== '') {
            HttpService.Get('api/friend/search/' + search)
                .then(res => {
                    if (res) {
                        const { success, data, error } = res

                        if (success === 1 && data && data.items) {
                            setData([...data.items]);
                        }
                        else if (success === 0 && error) {
                            Toast.show(error, { position: Toast.positions.CENTER });
                        }
                    }
                })
        }
    }

    const handleAddFriend = item => {
        socket.emit('add_members_to_group', { _idGroup: groupInfo.to, _idMembers: item.id }, res => {
            const { data, success, error } = res;
            if (success == 1) {
                Toast.show('Đã thêm ' + item.username + ' vào nhóm', { position: Toast.positions.CENTER });
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                    <Text style={{ fontWeight: '500', fontSize: Size.text, marginLeft: 8 }}>Thêm thành viên</Text>
                </TouchableOpacity>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 40,
                    borderColor: 'rgb(59, 130, 246)',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderRadius: 4,
                    paddingRight: 12,
                    paddingLeft: 20,
                    marginTop: 8,
                    marginHorizontal: 12
                }}>
                    <TextInput
                        onChangeText={search => setSearch(search)}
                        value={search}
                        returnKeyType={'go'}
                        placeholder='Tìm kiếm'
                        onSubmitEditing={handleSearch}
                        style={{
                            height: 40,
                            color: 'rgb(17, 24, 39)',
                            fontSize: Size.text - 2,
                            flex: 1,
                            paddingVertical: 8
                        }}
                    />

                    <TouchableOpacity onPress={handleSearch}>
                        <Svg width={20} height={20} data-v-0b8d352f="" aria-hidden="true" fill="rgb(107, 114, 128)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="w-5"><Path data-v-0b8d352f="" fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></Path></Svg>
                    </TouchableOpacity>
                </View>

                {data.length > 0 && (<View style={{
                    borderTopColor: '#ececf0',
                    borderTopWidth: 1,
                    flexDirection: 'row',
                    padding: 10,
                    alignItems: 'center'
                }}>
                    <Svg width="16" height="16" data-v-0122e182="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/Svg" viewBox="0 0 512 512" class="w-4 h-4 mr-2 fill-current"><Path data-v-0122e182="" fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></Path></Svg>
                    <Text style={[styles.label, { marginLeft: 5, color: 'rgb(29, 78, 216)' }]}>{data.length} kết quả</Text>
                </View>)}

                <ScrollView>
                    {data.map((item) => {
                        const { avatar, fullname, username, _id } = item;

                        return (<View key={_id} style={styles.fileSharedItem}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                {avatar ? <Image source={{ uri: baseURL + avatar }} style={{ width: 36, height: 36, borderRadius: 36 }} /> :
                                    <Image source={avatarDefault} style={{ width: 36, height: 36, borderRadius: 36 }} />}
                                <Text style={{ marginLeft: 10 }}>{username || fullname}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleAddFriend(item)} style={{ backgroundColor: 'rgb(59, 130, 246)', borderRadius: 5, padding: 8 }}>
                                <Text style={{ color: '#fff', fontSize: Size.fontSize }}>Thêm</Text>
                            </TouchableOpacity>
                        </View>)
                    })}
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView >)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
    },
    fileSharedItem: {
        marginTop: 12,
        // backgroundColor: 'rgb(240, 242, 245)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        // height: 64,
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