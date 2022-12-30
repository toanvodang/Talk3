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
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ManagerMemberScreen({ navigation, route }) {
    const { params } = route;
    const { lastMedia, preload, userInfo, isBlockedFriendProp, groupInfo, members } = params;
    const [search, setSearch] = useState();
    const [data, setData] = useState([...members]);
    const [showModalBlock, setShowModalBlock] = useState(false);

    const renderMember = () => {
        const { permissionGroup } = preload;

        return data.map(item => {
            const { avatar, _id, fullname, username } = item;
            let role = [];

            if (permissionGroup) {
                role = permissionGroup[_id]?.role;
            }

            return (<TouchableOpacity key={_id} style={styles.fileSharedItem}
                onPress={() => navigation.navigate('MemberDetail', {
                    preload,
                    userInfo,
                    isBlockedFriendProp,
                    groupInfo,
                    lastMedia,
                    member: item
                })}>
                <View style={styles.fileSharedItemInfo}>
                    {avatar ? <Image source={{ uri: baseURL + avatar }} style={{ width: 36, height: 36, borderRadius: 36 }} /> :
                        <Image source={avatarDefault} style={{ width: 36, height: 36, borderRadius: 36 }} />}
                    <Text style={[{ marginLeft: 10 }, role.includes('created_group') && { color: 'rgb(253, 107, 104)' }]}>{fullname || username}</Text>
                </View>
            </TouchableOpacity>)
        })
    }

    const handleSearch = () => {
        if (search && search !== '') {
            let searchLowerCase = search.toLowerCase();
            const filter = members.filter(item => {
                return item.username && item.username.toLowerCase().includes(searchLowerCase)
                    || item.fullname && item.fullname.toLowerCase().includes(searchLowerCase)
            });

            setData([...filter]);
        }
        else {
            setData([...members]);
        }
    }

    return (<KeyboardAvoidingView
        extraScrollHeight={150}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
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
                        <Text style={{ fontWeight: '500', fontSize: Size.text, marginLeft: 8 }}>Danh sách thành viên</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowModalBlock(true)} style={{
                        flex: 1,
                        alignItems: 'flex-end',
                        paddingRight: 10,
                        height: 56,
                        justifyContent: 'center'
                    }}>
                        <Svg data-v-a41a837c="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/Svg"><Path data-v-a41a837c="" d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" stroke="#292D32" stroke-width="1.5"></Path><Path data-v-a41a837c="" d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" stroke="#292D32" stroke-width="1.5"></Path><Path data-v-a41a837c="" d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" stroke="#292D32" stroke-width="1.5"></Path></Svg>
                    </TouchableOpacity>
                </View>

                {showModalBlock && <View style={{
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
                    }} onPress={() => { setShowModalBlock(false) }}>
                        <MaterialCommunityIcons name="chat-remove-outline" size={Size.iconSize} color="black" />
                        <Text style={{ flex: 1, marginLeft: 10, fontSize: Size.fontSize }}>Cấm chat tất cả</Text>
                    </TouchableOpacity>
                </View>}

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
                        onChangeText={search => {
                            setSearch(search);
                            // handleSearch();
                        }}
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

                {search && search !== '' && (<View style={{
                    borderTopColor: '#ececf0',
                    borderTopWidth: 1,
                    flexDirection: 'row',
                    padding: 10,
                    alignItems: 'center',
                    marginLeft: 5,
                    marginTop: 10
                }}>
                    <Svg width="16" height="16" data-v-0122e182="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/Svg" viewBox="0 0 512 512" class="w-4 h-4 mr-2 fill-current"><Path data-v-0122e182="" fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></Path></Svg>
                    <Text style={[styles.label, { marginLeft: 5, color: 'rgb(29, 78, 216)' }]}>{data.length} kết quả</Text>
                </View>)}

                <ScrollView>
                    {renderMember()}
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
        marginTop: 10,
        backgroundColor: 'rgb(240, 242, 245)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 5,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center'
    },
    fileSharedItemInfo: {
        marginLeft: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fileSharedItemName: {
        fontSize: Size.text,
        fontWeight: '700'
    },
    fileSharedItemSize: {
        fontSize: Size.text
    }
})