import * as React from 'react';
import { Alert, Button, Text, TextInput } from 'react-native';
import { SafeAreaView, FlatList } from 'react-native';
import { apiCall } from './utils';
import styles from '../styles/mie_prenotazioni';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

class ListaPrenotazioni extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            mie_prenotazioni: [],
            refresh: true,
        }
        this.getPrenotazioni();
    }

    componentDidMount() {
        this.getPrenotazioni();
        this.setState({ refresh: false });
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    async deletePrenotazione(datapre, orainizio, orafine){
        let url = 'campo/'+this.state.id+'/prenota'
      

        apiCall(await this.getToken(), url, 'DELETE', null, {
                data: datapre,
                oraInizio: orainizio,
                oraFine: orafine
            },
            (res => {
                if (res.success) {
                    Alert.alert('Ottimo', 'Prenotazione eliminata correttamente');
                } else {
                    Alert.alert('Errore', 'Impossibile eliminare la prenotazione');
                }
            }),
            (err => {
                    Alert.alert('Errore', 'Impossibile eliminare la prenotazione');
            }), null)
        this.getPrenotazioni();
    }


    async getPrenotazioni() {
        apiCall(await this.getToken(), 'utente/mie-prenotazioni', 'GET', null, null, (res => {
            if (res.success) {
                this.setState({

                    mie_prenotazioni: res.data
                })
            } else {
                this.setState({
                    miei_prenotazioni: []
                })
            }
        }), (err => {
            Alert.alert('Errore', 'Impossibile caricare le prenotazioni');
        }), null)
    }

    render() {
        return (
            <>
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={this.state.mie_prenotazioni}
                        renderItem={({ item }) =>
                            <TouchableOpacity
                                onLongPress={
                                    () => {
                                        this.deletePrenotazione(item.data, item.oraInizio.slice(0,-4), item.oraFine.slice(0,-4) )
                                    }
                                }
                                activeOpacity={0.8}
                            >
                                <SafeAreaView style={styles.item}>
                                    <Text style={styles.titolo}>{item.nome}</Text>
                                    <Text style={styles.giorno}>{item.data}</Text>
                                    <Text style={styles.ora}> Dalle: {item.oraInizio.slice(0, -4)} Alle: {item.oraFine.slice(0, -4)}</Text>
                                    <Text style={styles.ora}>{item.indirizzo}, {item.citta}</Text>
                                </SafeAreaView>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item.id + item.data + item.oraInizio + item.oraFine}
                    />
                </SafeAreaView>
            </>
        );
    }
}

const ShowMiePrenotazioni = () => {
    return (
        <Stack.Navigator initialRouteName='Mie Prenotazioni' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Prenotazioni' component={ShowPrenotazioni} />
        </Stack.Navigator>
    )
}

const ShowPrenotazioni = ({ route, navigation }) => {
    return (
        <ListaPrenotazioni navigation={navigation} />
    )
}

module.exports = ShowMiePrenotazioni;