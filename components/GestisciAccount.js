import * as React from 'react';
import { styles } from '../styles/registrazione.js';
import { apiCall } from './utils.js';
import { Text, Image, TextInput, Button, Alert, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class GestisciAccount extends React.Component {

    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            email: "",
            pwd: "",
            nome: "",
            cognome: "",
            paypal: "",
            telefono: "",
        }
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    async getActualData() {
        apiCall(await this.getToken(), "utente", "GET", null, null, res => {
            if (res.data)
                this.setState({
                    nome: res.data.nome,
                    cognome: res.data.cognome,
                    paypal: res.data.account_paypal,
                    email: res.data.email,
                    telefono: res.data.telefono

                })
        }, err => { }, this.navigation);
    }

    async componentDidMount() {
        await this.getActualData();
    }

    async modifica() {
        if (this.state.email == "" || this.state.pwd == "" || this.state.nome == "" ||
            this.state.cognome == "" || this.state.paypal == "" || this.state.telefono == "" ||
            this.state.tipologia == "") {
            Alert.alert("Errore", "Tutti i campi sono obbligatori. Completali.")
        } else {
            let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (emailReg.test(this.state.email) === false || emailReg.test(this.state.paypal) === false) {
                Alert.alert("Errore", "Le email devono essere valide")
            } else {
                apiCall(await this.getToken(), "utente", "PUT", null, {
                    nome: this.state.nome, cognome: this.state.cognome, email: this.state.email,
                    password: this.state.pwd, telefono: this.state.telefono, paypal: this.state.paypal
                }, (res) => {
                    if (res.success == true) {
                        Alert.alert("Modifica completata", "Profilo aggiornato con successo");
                    } else {
                        Alert.alert("Errore", "Errore durante la modifica, riprova!");
                    }
                }, (err) => { }, this.navigation);
            }
        }
    }

    async elimina() {
        apiCall(await this.getToken(), "utente", "DELETE", null, null, async (res) => {
            if (res.success == true) {
                Alert.alert("Operazione completata", "Profilo cancellato con successo. Torna a trovarci :(");
                await AsyncStorage.setItem('TOKEN', '');
                await AsyncStorage.setItem('TIPOLOGIA', '');
                await AsyncStorage.setItem('PAYPAL', '');
                this.navigation.navigate('Login');
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
                            <Text style={styles.proprieta}>Cognome</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.cognome}
                                onChangeText={(cognome) => this.setState({ cognome })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Email</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Password</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={true}
                                value={this.state.pwd}
                                onChangeText={(pwd) => this.setState({ pwd })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Email Paypal</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.paypal}
                                onChangeText={(paypal) => this.setState({ paypal })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Telefono</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                value={this.state.telefono}
                                onChangeText={(telefono) => this.setState({ telefono })}
                            />
                        </SafeAreaView>

                    </SafeAreaView>
                    <SafeAreaView style={styles.btnCont}>
                        <Button color='#72bb53' title='Aggiorna' onPress={() => this.modifica()} />
                    </SafeAreaView>

                    <SafeAreaView style={styles.btnCont}>
                        <Button color='#e0a00b' title='Elimina Account' onPress={() => this.elimina()} />
                    </SafeAreaView>
                </SafeAreaView>
            </>
        );
    }

}

module.exports = GestisciAccount;