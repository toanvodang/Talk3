import { useState } from 'react';
import {
    KeyboardAvoidingView, View, Text,
    TextInput, TouchableOpacity, StyleSheet,
    Platform, ScrollView,
    TouchableWithoutFeedback,
    Keyboard, Image
} from 'react-native';
import { Size } from '../utilities/Styles';
import Modal from 'react-native-modal';
import { baseURL } from '../services/HttpService';
import Svg, { Path, SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ListMemberScreen({ navigation, route }) {
    const { params } = route;
    const { lastMedia, preload, userInfo, isBlockedFriendProp, groupInfo, members } = params;
    const [search, setSearch] = useState()
    const [viewImage, setViewImage] = useState({ isShow: false, uri: null, fileType: null });
    const [filterLastMedia, setFilterLastMedia] = useState([...lastMedia])
    const handleSearch = () => {
        if (search && search !== '') {
            const _filterLastMedia = lastMedia.filter(item => {
                return item.fileName && item.fileName.toLowerCase().includes(search.toLowerCase());
            })

            setFilterLastMedia([..._filterLastMedia]);
        }
        else {
            setFilterLastMedia([...lastMedia]);
        }
    }

    return (<KeyboardAvoidingView
        extraScrollHeight={150}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <StatusBar hidden={viewImage.isShow} />
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
                    <Text style={{ fontWeight: '500', fontSize: Size.text, marginLeft: 8 }}>Danh sách thành viên</Text>
                </TouchableOpacity>

                <ScrollView>
                    {members.map(item => {
                        const { avatar, _id, fullname, username } = item;

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
                                <Text style={{ marginLeft: 10 }}>{fullname || username}</Text>
                            </View>
                        </TouchableOpacity>)
                    })}
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>

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