import * as React from 'react';
import { View, Image, Dimensions, ImageBackground } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomDrawer = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <ImageBackground style={{
                backgroundColor: '#72bb53', // or '#72bb53'
            }}
            >
                <Image source={require('../assets/logo.png')} style={{
                    width: '50%',
                    alignSelf: 'center',
                    height: Dimensions.get('window').height / 6,
                    marginTop: '10%',
                    marginBottom: '10%',
                }} />
            </ImageBackground>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    )
}

module.exports = CustomDrawer;