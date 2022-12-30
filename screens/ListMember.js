import {
    KeyboardAvoidingView, View, Text,
    TouchableOpacity, StyleSheet,
    Platform, ScrollView,
    TouchableWithoutFeedback,
    Keyboard, Image
} from 'react-native';
import { Size } from '../utilities/Styles';
import avatarDefault from '../assets/default.8a7fd05f.png';
import { baseURL } from '../services/HttpService';
import Svg, { Path, SvgUri } from 'react-native-svg';

export default function ListMemberScreen({ navigation, route }) {
    const { params } = route;
    const { lastMedia, preload, userInfo, isBlockedFriendProp, groupInfo, members } = params;

    const renderMember = () => {
        const { permissionGroup } = preload;
        // console.log(members, 'members');
        return members.map(item => {
            const { avatar, _id, fullname, username, bio } = item;
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
                    <View>
                        <Text style={[{ marginLeft: 10 }, role.includes('created_group') && { color: 'rgb(253, 107, 104)' }]}>{username || fullname}</Text>
                        <Text style={[{ marginLeft: 10, color: '#afafaf' }]}>{bio}</Text>
                    </View>
                </View>
            </TouchableOpacity>)
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
                    <Text style={{ fontWeight: '500', fontSize: Size.text, marginLeft: 8 }}>Danh sách thành viên</Text>
                </TouchableOpacity>

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
        marginTop: 7,
        backgroundColor: 'rgb(240, 242, 245)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
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