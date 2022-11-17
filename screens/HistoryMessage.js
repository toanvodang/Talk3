import * as React from 'react';
import {
    View, Text, Image,
    TouchableOpacity, StyleSheet,
    ScrollView
} from 'react-native';
import bgLogin from '../assets/bgLogin.png';
import avatarDefault from '../assets/default.8a7fd05f.png';
import Svg, { Path } from 'react-native-svg';
import { Size } from '../utilities/Styles';

export default function HistoryMessageScreen({ navigation, route }) {
    const { params } = route;
    const { itemGroup } = params;
    const { infoGroup } = itemGroup;
    console.log(infoGroup, '----');

    return (<View style={styles.container}>

        <View style={{
            flexDirection: 'row',
        }}>
            <TouchableOpacity onPress={() => navigation.navigate('Dialog', { itemGroup: { ...itemGroup } })} style={{
                flex: 1,
                height: 56,
                justifyContent: 'center'
            }}>
                <Svg data-v-a41a837c="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><Path data-v-a41a837c="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert(1)} style={{
                flex: 1,
                alignItems: 'flex-end',
                paddingRight: 10,
                height: 56,
                justifyContent: 'center'
            }}>
                <Svg data-v-a41a837c="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><Path data-v-a41a837c="" d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10Z" stroke="#292D32" stroke-width="1.5"></Path><Path data-v-a41a837c="" d="M19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10Z" stroke="#292D32" stroke-width="1.5"></Path><Path data-v-a41a837c="" d="M12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z" stroke="#292D32" stroke-width="1.5"></Path></Svg>
            </TouchableOpacity>
        </View>

        <View style={{ alignItems: 'center' }}>
            {infoGroup.avatar ? (<Image source={{ uri: infoGroup.avatar }} style={{ width: 64, height: 64, borderRadius: 64 }} />)
                : (<Image source={avatarDefault} style={{ width: 64, height: 64, borderRadius: 64 }} />)}

            <Text style={{ marginTop: 8, fontSize: Size.text + 2, fontWeight: '500' }}>{infoGroup.infoGroupItemName}</Text>
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
                <TouchableOpacity style={{ color: '#4a6fc4' }} onPress={() => navigation.navigate('FileShared', { itemGroup: { ...itemGroup } })}>
                    <Text style={{ color: '#4a6fc4', textDecorationLine: 'underline', fontSize: Size.text }}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={styles.historyItem}>
                    <Image source={bgLogin} style={styles.historyItemImg} resizeMode={'contain'} />
                </View>

                <View style={styles.historyItem}>
                    <Image source={avatarDefault} style={styles.historyItemImg} resizeMode={'contain'} />
                </View>
            </ScrollView>
        </View>
    </View>)
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