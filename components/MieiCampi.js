import * as React from 'react';
import { Alert, Button, Text, TextInput } from 'react-native';
import { SafeAreaView, FlatList } from 'react-native';
import { apiCall } from './utils';
import styles from '../styles/miei_campi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

class ListaCampi extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            miei_campi: [],
            refresh: true,
        }
        this.getCampi();
    }

    componentDidMount() {
        this.getCampi();
        this.setState({ refresh: false });
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
                            <Text style={styles.proprieta}>Tariffa</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(tariffa) => this.setState({ tariffa })}
                                value={this.state.tariffa}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Prenota entro</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(prenotaEntro) => this.setState({ prenotaEntro })}
                                value={this.state.prenotaEntro}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.crea}>
                            <Button color='#72bb53' title='Crea' onPress={async () => {
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
                                            apiCall(await this.getToken(), 'campo', 'POST', null, {
                                                nome: this.state.nome,
                                                indirizzo: this.state.indirizzo,
                                                cap: this.state.cap,
                                                citta: this.state.citta,
                                                provincia: this.state.provincia,
                                                sport: this.state.sport,
                                                tariffa: this.state.tariffa,
                                                prenotaEntro: this.state.prenotaEntro
                                            }, ((res) => {
                                                if (res.success) {
                                                    Alert.alert('Campo creato con successo');
                                                    this.navigation.goBack();
                                                } else {
                                                    Alert.alert('Attenzione', res.message);
                                                }
                                            }), ((err) => {
                                                console.log(err)
                                                Alert.alert('Attenzione', err.message);
                                            }), null);
                                        }
                                    }
                                }
                            }} />

                        </SafeAreaView>
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

const PropCampo = () => {
    return (
        <Text>
            Proprietà campo
        </Text>
    )
}

const NuovoCampo = ({ route, navigation }) => {
    return (
        <CreaNuovoCampo navigation={navigation} />
    )
}

const ShowMieiCampi = ({ route, navigation }) => {
    return (
        <ListaCampi navigation={navigation} />
    )
}

module.exports = ShowInfoMieiCampi;