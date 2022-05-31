import * as React from 'react';
import { Alert, Button, Text, TextInput } from 'react-native';
import { SafeAreaView, FlatList } from 'react-native';
import { apiCall } from './utils';
import styles from '../styles/mie_prenotazioni';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

class PrenotazioniCampo extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            miei_campi: [], 
            prenotazioni_campo: [],
            campo_selezionato: "" , 
            refresh: true,
        }
        this.getCampiv2();      
    }

    componentDidMount() {
        this.getCampiv2();
        this.setState({ refresh: false });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.campo_selezionato != this.state.campo_selezionato ) {
            this.getPrenotazioni(this.state.campo_selezionato) ;
        }
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    async getCampiv2() {
        apiCall(await this.getToken(), 'gestore/miei-campi', 'GET', null, null, (res => {
            if (res.success) {
                this.setState({
                    miei_campi: res.data
                })
            } else {
                this.setState({
                    miei_campi: []
                })
            }
        }), (err => {
            Alert.alert('Errore', 'Impossibile caricare i campi');
        }), null)
    } 
    
    async getPrenotazioni(idCampo) {
       apiCall(await this.getToken(), 'campo/'+idCampo+'/prenotazioni', 'GET', null, null, (res => {
            if (res.success) {
                this.setState({
                    prenotazioni_campo: res.data
                })
            } else {
                this.setState({
                    prenotazioni_campo: []
                })
            }
        }), (err => {
            Alert.alert('Errore', 'Impossibile caricare le prenotazioni');
        }), null)
    }

    render() {
        return (
            <>
             <SelectDropdown dropdownStyle={styles.dropdown} buttonStyle={styles.dropbtn}
                                data = {miei_campi} 
                                onSelect={(selectedItem, index) => {
                                    this.setState({campo_selezionato : selectedItem})
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                            />
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={this.state.prenotazioni_campo}
                        renderItem={({ item }) =>
                            <SafeAreaView style={styles.item}>
                                    <Text style={styles.giorno}>{item.idUtente}</Text>
                                    <Text style={styles.giorno}>{item.data}</Text>
                                    <Text style={styles.ora}> Dalle : {item.oraInizio.slice(0, -4)} Alle : {item.oraFine.slice(0, -4)}</Text>
                                    <Text style={styles.ora}>{item.indirizzo}, {item.citta}</Text>
                            </SafeAreaView>
                        }
                    />
                </SafeAreaView>
            </>
        );
    }
}

const ShowPrenotazioniCampo = () => {
    return (
        <Stack.Navigator initialRouteName='Prenotazioni Campo' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Prenotazioni Campo' component={RoutePrenotazioniCampo} />
        </Stack.Navigator>
    )
}



const RoutePrenotazioniCampo = ({ route, navigation }) => {
    return (
        <PrenotazioniCampo navigation={navigation} />
    )
}

module.exports = ShowPrenotazioniCampo;