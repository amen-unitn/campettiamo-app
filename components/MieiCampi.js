import * as React from 'react';
import { Alert, Button, Text, TextInput } from 'react-native';
import { SafeAreaView, FlatList } from 'react-native';
import { apiCall } from './utils';
import styles from '../styles/miei_campi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const PropCampo = ({ route, navigation }) => {
    return (
        <ModificaCampo campo={route.params.campo} navigation={navigation} />
    )
}

const NuovoCampo = ({ route, navigation }) => {
    return (
        <CreaNuovoCampo navigation={navigation} />
    )
}

const ShowMieiCampi = ({ route, navigation }) => {
    return (
        <MieiCampi navigation={navigation} />
    )
}

class MieiCampi extends React.Component {
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
                                    this.navigation.navigate('Proprietà campo', { campo: item.id })
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
                <SafeAreaView style={styles.plus}>
                    <TouchableOpacity
                        style={styles.floatinBtn}
                        onPress={() => {
                            this.navigation.navigate('Nuovo campo')
                        }}
                    >
                        <Text style={styles.add}>+</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </>
        );
    }
}

class CreaNuovoCampo extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            nome: '',
            indirizzo: '',
            cap: '',
            citta: '',
            provincia: '',
            sport: '',
            tariffa: '',
            prenotaEntro: ''
        }
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    async createCampo() {
        // check if all fields are filled
        if (this.state.nome === '' || this.state.indirizzo === '' || this.state.cap === '' || this.state.citta === '' || this.state.provincia === '' || this.state.sport === '' || this.state.tariffa === '' || this.state.prenotaEntro === '') {
            Alert.alert('Attenzione', 'Compilare tutti i campi');
        } else {
            // check if is a number
            if (isNaN(this.state.cap) || isNaN(this.state.tariffa) || isNaN(this.state.prenotaEntro)) {
                Alert.alert('Attenzione', 'Il CAP, la tariffa e la prenota entro devono essere numeri');
            } else {
                // check if is a 5 digits number
                if (this.state.cap.length !== 5 || isNaN(this.state.cap.slice(-1))) {
                    Alert.alert('Attenzione', 'Il CAP deve essere di 5 cifre');
                }
                // check if is a number
                else {
                    apiCall(await this.getToken(), 'campo/', 'POST', null, {
                        nome: this.state.nome,
                        indirizzo: this.state.indirizzo,
                        cap: this.state.cap,
                        citta: this.state.citta,
                        provincia: this.state.provincia,
                        sport: this.state.sport,
                        tariffa: this.state.tariffa,
                        prenotaEntro: this.state.prenotaEntro
                    }, (res) => {
                        if (res.success) {
                            Alert.alert('Campo creato con successo');
                            this.navigation.goBack();
                        } else {
                            Alert.alert('Attenzione', res.message);
                        }
                    }, (err) => {
                        Alert.alert('Attenzione', err.message);
                    }, null);
                }
            }
        }
    }

    render() {
        return (
            <>
                <SafeAreaView style={{
                    alignItems: 'center',
                }}>
                    <Text style={styles.titolo}>Nuovo campo</Text>
                    <SafeAreaView style={styles.colonna}>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Nome</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(nome) => this.setState({ nome })}
                                value={this.state.nome}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Indirizzo</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(indirizzo) => this.setState({ indirizzo })}
                                value={this.state.indirizzo}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>CAP</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(cap) => this.setState({ cap })}
                                value={this.state.cap}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Città</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(citta) => this.setState({ citta })}
                                value={this.state.citta}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Provincia</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(provincia) => this.setState({ provincia })}
                                value={this.state.provincia}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Sport</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(sport) => this.setState({ sport })}
                                value={this.state.sport}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Tariffa (€)</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(tariffa) => this.setState({ tariffa })}
                                value={this.state.tariffa}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Prenota entro (ore)</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(prenotaEntro) => this.setState({ prenotaEntro })}
                                value={this.state.prenotaEntro}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.crea}>
                            <Button color='#72bb53' title='Crea' onPress={() => this.createCampo()} />

                        </SafeAreaView>
                    </SafeAreaView>
                </SafeAreaView>
            </>
        );
    }
}

class ModificaCampo extends React.Component {

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            id: props.campo,
            nome: '',
            indirizzo: '',
            cap: '',
            citta: '',
            provincia: '',
            sport: '',
            tariffa: '',
            prenotaEntro: ''
        }
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    async getActualData() {
        apiCall(await this.getToken(), "campo/" + this.state.id, "GET", null, null, res => {
            if (res.data) {
                this.setState({
                    nome: res.data.nome,
                    indirizzo: res.data.indirizzo,
                    cap: res.data.cap,
                    citta: res.data.citta,
                    provincia: res.data.provincia,
                    sport: res.data.sport,
                    tariffa: res.data.tariffa,
                    prenotaEntro: res.data.prenotaEntro
                })
            }
        }, err => { }, this.navigation);
    }

    async componentDidMount() {
        await this.getActualData();
    }

    async modifica() {
        if (this.state.nome == '' || this.state.indirizzo == '' || this.state.cap == '' ||
            this.state.citta == '' || this.state.provincia == '' || this.state.sport == '' ||
            this.state.tariffa == '' || this.state.prenotaEntro == '') {
            Alert.alert("Errore", "Tutti i campi sono obbligatori. Completali.")
        } else {
            let capReg = /^[0-9]{5}$/;
            // match positive float/integer
            let positiveNumReg = /^\d*\.?\d*$/;
            if (capReg.test(this.state.cap) === false) {
                Alert.alert("Errore", "Il CAP deve essere un numero di 5 cifre.");
            } else if (positiveNumReg.test(this.state.tariffa) === false || positiveNumReg.test(this.state.prenotaEntro) === false) {
                Alert.alert("Errore", "La tariffa e prenota entro devono essere numeri positivi.");
            } else {
                apiCall(await this.getToken(), "campo/" + this.state.id, "PUT", null, {
                    nome: this.state.nome,
                    indirizzo: this.state.indirizzo,
                    cap: this.state.cap,
                    citta: this.state.citta,
                    provincia: this.state.provincia,
                    sport: this.state.sport,
                    tariffa: this.state.tariffa,
                    prenotaEntro: this.state.prenotaEntro
                }, (res) => {
                    if (res.success == true) {
                        Alert.alert("Modifica completata", "Campo aggiornato con successo");
                        this.navigation.goBack();
                    } else {
                        Alert.alert("Errore", "Errore durante la modifica, riprova!");
                    }
                }, (err) => { }, this.navigation);
            }
        }
    }

    async elimina() {
        apiCall(await this.getToken(), "campo/" + this.state.id, "DELETE", null, null, async (res) => {
            if (res.success == true) {
                Alert.alert("Operazione completata", "Campo cancellato con successo");
                this.navigation.goBack();
            } else {
                Alert.alert("Errore", "Errore durante la cancellazione, riprova!");
            }
        }, (err) => { }, this.navigation);
    }


    render() {
        return (
            <>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.titolo}>Modifica Account</Text>
                    <SafeAreaView style={styles.colonna}>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Nome</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.nome}
                                onChangeText={(nome) => this.setState({ nome })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Indirizzo</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.indirizzo}
                                onChangeText={(indirizzo) => this.setState({ indirizzo })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>CAP</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.cap}
                                onChangeText={(cap) => this.setState({ cap })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Città</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.citta}
                                onChangeText={(citta) => this.setState({ citta })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Provincia</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.provincia}
                                onChangeText={(provincia) => this.setState({ provincia })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Sport</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.sport}
                                onChangeText={(sport) => this.setState({ sport })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Tariffa (€)</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.tariffa}
                                onChangeText={(tariffa) => this.setState({ tariffa })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Prenota entro (ore)</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.prenotaEntro}
                                onChangeText={(prenotaEntro) => this.setState({ prenotaEntro })}
                            />
                        </SafeAreaView>


                    </SafeAreaView>
                    <SafeAreaView style={styles.btnCont}>
                        <Button color='#72bb53' title='Aggiorna' onPress={() => this.modifica()} />
                    </SafeAreaView>

                    <SafeAreaView style={styles.btnCont}>
                        <Button color='#e0a00b' title='Elimina campo' onPress={() => this.elimina()} />
                    </SafeAreaView>
                </SafeAreaView>
            </>
        );
    }

}

const ShowInfoMieiCampi = () => {
    return (
        <Stack.Navigator initialRouteName='Miei Campi' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Miei campi' component={ShowMieiCampi} />
            <Stack.Screen name='Proprietà campo' component={PropCampo} />
            <Stack.Screen name='Nuovo campo' component={NuovoCampo} />
        </Stack.Navigator>
    )
}

module.exports = ShowInfoMieiCampi;