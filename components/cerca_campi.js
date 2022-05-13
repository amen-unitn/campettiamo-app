import 'react-native-gesture-handler';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Searchbar } from 'react-native-paper';
import { View, Text } from 'react-native';
import styles from '../styles/cerca_campi';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ShowCampi = () => {
    return (
        <Stack.Navigator initialRouteName='Campi' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Campi' component={SearchCampi} />
        </Stack.Navigator>
    )
}

const SearchCampi = () => {
    return (
        <Tab.Navigator initialRouteName='Cerca per nome' options={{

        }}>
            <Tab.Screen name="Cerca per nome" component={SearchCampiByName} options={{
                tabBarIndicatorStyle: {
                    backgroundColor: '#72bb53'
                }
            }} />
            <Tab.Screen name="Cerca sulla mappa" component={SearchCampiByMap} options={{
                tabBarIndicatorStyle: {
                    backgroundColor: '#72bb53'
                }
            }} />
        </Tab.Navigator>
    );
}

function SearchCampiByName({ navigation }) {

    const [searchQuery, setSearchQuery] = React.useState('');

    const onChangeSearch = query => setSearchQuery(query);

    return (
        <>
            <View style={{ alignItems: 'center' }}>
                <Searchbar
                    placeholder="Cerca campo"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
            </View>
            <View style={ styles.container }>
                <Text>
                    {/* change "softwareKeyboardLayoutMode": "pan" in app.json if you don't want the view to be pushed up */}
                    {searchQuery?.length > 0 ? searchQuery : 'Lista campi'}
                </Text>
            </View>
        </>
    );
}

function SearchCampiByMap({ navigation }) {
    return (
        <View>
            <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                    latitude: 46.065,
                    longitude: 11.125,
                    latitudeDelta: 0.0372,
                    longitudeDelta: 0.03,
                }}
            >
            </MapView>
        </View>
    );
}

module.exports = ShowCampi;