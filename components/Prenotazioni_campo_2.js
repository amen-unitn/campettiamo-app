import * as React from 'react';
import { Alert, Button, Text, TextInput } from 'react-native';
import { SafeAreaView, FlatList } from 'react-native';
import { apiCall } from './utils';
import styles from '../styles/miei_campi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();


class MieiCampiPrenotazioni extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            miei_campi: [],
            refresh: true,
        }
        this.getCampi();
    }

    async componentDidMount() {
        await this.getCampi();
        this.setState({ refresh: false });
        this.focusListener = this.props.navigation.addListener('focus', async () => {
            await this.getCampi();
        });
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    async getCampi() {
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

    render() {
        return (
            <>
                <SafeAreaView style={styles.container}>
                    <FlatList
                        data={this.state.miei_campi}
                        renderItem={({ item }) =>
                            <TouchableOpacity
                                onPress={() => {
                                    this.navigation.navigate('Prenotazioni del Campo', { campo: item.id })
                                }}
                                activeOpacity={0.8}
                            >
                                <SafeAreaView style={styles.item}>
                                    <Text style={styles.text}>{item.nome}</Text>
                                    <Text style={styles.indirizzo}>{item.indirizzo}, {item.citta}</Text>
                                </SafeAreaView>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item.id}
                        refreshing={this.state.refresh}
                        onRefresh={() => {
                            this.getCampi();
                        }}
                    />
                </SafeAreaView>
            </>
        );
    }
}


class PrenotazioniCampo extends React.Component {

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            id: props.campo,
            lista_prenotazioni_campo : []
        }
        this.getPrenotazioni(this.state.id)
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }


    async componentDidMount() {
        await this.getPrenotazioni(this.state.id);
    }

    async getPrenotazioni(idCampo) {
        apiCall(await this.getToken(), 'campo/'+idCampo+'/prenotazioni', 'GET', null, null, (res => {
             if (res.success) {
                 console.log(res)
                 this.setState({
                     lista_prenotazioni_campo: res.data 
                 })
             } else {
                 this.setState({
                     lista_prenotazioni_campo: []
                 })
             }
         }), (err => {
             Alert.alert('Errore', 'Impossibile caricare le prenotazioni');
         }), null)
     }

    render() {
        return (
            <SafeAreaView style={styles.container}>
            <FlatList
                data={this.state.lista_prenotazioni_campo}
                renderItem={({ item }) =>
                    <SafeAreaView style={styles.item}>
                            <Text style={styles.giorno}>IdUtente : {item.idUtente}</Text>
                            <Text style={styles.giorno}>{item.data}</Text>
                            <Text style={styles.ora}> Dalle : {item.oraInizio.slice(0, -4)} Alle : {item.oraFine.slice(0, -4)}</Text>
                    
                    </SafeAreaView>
                }
            />
        </SafeAreaView>
        );
    }

}

const RouterPrenotazioniCampo = ({ route, navigation }) => {
    return (
        <PrenotazioniCampo campo={route.params.campo} navigation={navigation} />
    )
}

const RouterCampiPrenotazioni = ({ route, navigation }) => {
    return (
        <MieiCampiPrenotazioni navigation={navigation} />
    )
}

const ShowPrenotazioniMieiCampi = () => {
    return (
        <Stack.Navigator initialRouteName='Prenotazioni per campo' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Miei Campi Prenotazioni' component={RouterCampiPrenotazioni} />
            <Stack.Screen name='Prenotazioni del Campo' component={RouterPrenotazioniCampo} />
            
        </Stack.Navigator>
    )
}

module.exports = ShowPrenotazioniMieiCampi;