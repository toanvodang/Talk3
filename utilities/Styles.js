import { Dimensions } from 'react-native';
import { Header } from '@react-navigation/elements';

const { height, width } = Dimensions.get('window');
const scale = width / 320;

export const normalize = size => {
    const newSize = size * scale;
    const sizeText = Math.round(newSize);

    if (width > 700 && sizeText >= 20) {
        return 20;
    }
    if (sizeText >= 17) {
        return 17;
    }
    else {
        return sizeText;
    }
};

export const Size = {
    iconSize: normalize(13) + 3,
    iconSizeHeader: normalize(13) + 10,
    heightInput: 50,
    heightButton: 40,
    textSmall: normalize(11),
    text: normalize(13),
    textmedium: normalize(13) + 3,
    textlarge: normalize(13) + 5,
    textLableTabar: 13,
    deviceWidth: width,
    deviceheight: height,
    headerHeight: Header.height,
    defineSpace: 16,
    defineHalfSpace: 8,
};

const primaryColor = '#0971DC';
export const Colors = {
    black: '#000',
    primary: primaryColor,
    primaryDark: '#B80000',
    white: '#ffff',
    RedOrange: '#f44336',
    indigo: '#3f51b5',
    BahamaBlue: '#23527c',
    green50: '#e8f5e9',
    grey: '#9e9e9e',

    textGray900: 'rgb(17, 24, 39)'

};