import * as React from 'react';
import { SafeAreaView, Image, Dimensions, ImageBackground, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShowCampi from './CercaCampi';
import Logout from './Logout';
import ShowInfoMieiCampi from './MieiCampi';
import GestisciAccount from './GestisciAccount';
import ShowMiePrenotazioni from './MiePrenotazioni';
import ShowPrenotazionimieiCampi from './Prenotazioni_campo_2';

const Drawer = createDrawerNavigator();

class CustomDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            tipologia: props.route.params.tipologia,
            email: props.route.params.email
        }
        this.getNome();
    }

    getNome = async () => {
        await AsyncStorage.getItem('EMAIL').then(
            (value) => {
                this.setState({ email: value });
            }
        );
    }

    CustomImg = (props) => {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground style={{
                    backgroundColor: '#72bb53', // or '#72bb53'
                }}
                >
                    <Image source={require('../assets/logo.png')} style={{
                        width: '50%',
                        alignSelf: 'center',
                        height: Dimensions.get('window').height / 6,
                        marginTop: '10%',
                    }} />
                    <SafeAreaView style={{
                        marginBottom: '5%',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold'
                        }}>{this.state.email}</Text>
                    </SafeAreaView>
                </ImageBackground>
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                </DrawerContentScrollView>
            </SafeAreaView>
        )
    }


    render() {

        let view = null;

        switch (this.state.tipologia) {
            case "Utente": {
                view = (
                    <Drawer.Navigator useLegacyImplementation={true} initialRouteName="Cerca campi" drawerContent={props => <this.CustomImg {...props} />}
                        screenOptions={{
                            drawerActiveBackgroundColor: '#72bb53',
                            drawerActiveTintColor: '#fff',
                        }}
                    >
                        <Drawer.Screen name="Cerca campi" component={ShowCampi} options={{
                            headerStyle: { backgroundColor: '#72bb53' },
                            headerTitleStyle: { color: 'white' },
                            headerTitleAlign: 'center',
                            headerTintColor: 'white'
                        }}
                        />
                        <Drawer.Screen name="Le mie Prenotazioni" component={ShowMiePrenotazioni} options={{
                            headerStyle: { backgroundColor: '#72bb53' },
                            headerTitleStyle: { color: 'white' },
                            headerTitleAlign: 'center',
                            headerTintColor: 'white'
                        }}
                        />

                        <Drawer.Screen name="Gestione Account" component={GestisciAccount} options={{
                            headerStyle: { backgroundColor: '#72bb53' },
                            headerTitleStyle: { color: 'white' },
                            headerTitleAlign: 'center',
                            headerTintColor: 'white'
                        }}
                        />

                        <Drawer.Screen name="Logout" component={Logout} options={{
                            headerStyle: { backgroundColor: '#72bb53' },
                            headerTitleStyle: { color: 'white' },
                            headerTitleAlign: 'center',
                            headerTintColor: 'white'
                        }}
                        />

                    </Drawer.Navigator>
                );
                break;

            }
            case "Gestore": {
                view = (
                    <Drawer.Navigator useLegacyImplementation={true} initialRouteName="I miei campi" drawerContent={props => <this.CustomImg {...props} />}
                        screenOptions={{
                            drawerActiveBackgroundColor: '#72bb53',
                            drawerActiveTintColor: '#fff',
                        }}
                    >

                        <Drawer.Screen name="I miei campi" component={ShowInfoMieiCampi} options={{
                            headerStyle: { backgroundColor: '#72bb53' },
                            headerTitleStyle: { color: 'white' },
                            headerTitleAlign: 'center',
                            headerTintColor: 'white'
                        }}
                        />

                        <Drawer.Screen name="Prenotazioni Campo" component={ShowPrenotazionimieiCampi} options={{
                            headerStyle: { backgroundColor: '#72bb53' },
                            headerTitleStyle: { color: 'white' },
                            headerTitleAlign: 'center',
                            headerTintColor: 'white'
                        }}
                        />


                        <Drawer.Screen name="Gestione Account" component={GestisciAccount} options={{
                            headerStyle: { backgroundColor: '#72bb53' },
                            headerTitleStyle: { color: 'white' },
                            headerTitleAlign: 'center',
                            headerTintColor: 'white'
                        }}
                        />

                        <Drawer.Screen name="Logout" component={Logout} options={{
                            headerStyle: { backgroundColor: '#72bb53' },
                            headerTitleStyle: { color: 'white' },
                            headerTitleAlign: 'center',
                            headerTintColor: 'white'
                        }}
                        />

                    </Drawer.Navigator>
                );
                break;
            }
        }
        return view;

    }
}



module.exports = CustomDrawer;