import { useState } from 'react';
import {
    KeyboardAvoidingView, View, Text,
    TextInput, TouchableOpacity, StyleSheet,
    Platform, ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Size } from '../utilities/Styles';
import Svg, { Path } from 'react-native-svg';

export default function FileSharedScreen({ navigation, route }) {
    const { params } = route;
    const { itemGroup } = params;
    const [search, setSearch] = useState()

    const handleSearch = () => {
        if (search && search !== '')
            alert(search)
    }

    return (<KeyboardAvoidingView
        extraScrollHeight={150}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => navigation.navigate('HistoryMessage', { itemGroup: { ...itemGroup } })}
                    style={{
                        flexDirection: 'row',
                        height: 56,
                        paddingRight: 12,
                        alignItems: 'center'
                    }}>
                    <Svg data-v-a41a837c="" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><Path data-v-a41a837c="" d="M15 19.9201L8.47997 13.4001C7.70997 12.6301 7.70997 11.3701 8.47997 10.6001L15 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></Path></Svg>
                    <Text style={{ fontWeight: '500', fontSize: Size.text, marginLeft: 8 }}>Tệp đã chia sẻ</Text>
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

                <ScrollView>
                    <TouchableOpacity style={styles.fileSharedItem} onPress={() => alert(1)}>
                        <Svg width={20} height={20} data-v-bdfb0870="" aria-hidden="true" fill="rgb(107, 114, 128)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"><Path data-v-bdfb0870="" fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></Path></Svg>
                        <View style={styles.fileSharedItemInfo}>
                            <Text style={styles.fileSharedItemName}>file.png</Text>
                            <Text style={styles.fileSharedItemSize}>1.3MB</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.fileSharedItem}>
                        <Svg width={20} height={20} data-v-bdfb0870="" aria-hidden="true" fill="rgb(107, 114, 128)" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6"><Path data-v-bdfb0870="" fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></Path></Svg>
                        <View style={styles.fileSharedItemInfo}>
                            <Text style={styles.fileSharedItemName}>file.png</Text>
                            <Text style={styles.fileSharedItemSize}>1.3MB</Text>
                        </View>
                    </TouchableOpacity>
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