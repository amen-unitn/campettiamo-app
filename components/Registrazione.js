import * as React from 'react';
import { styles } from '../styles/registrazione.js';
import { registerRequest } from './utils.js';
import { Text, Image, TextInput, Button, Alert, SafeAreaView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

class Registrazione extends React.Component {

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
            tipologia: ""
        }
    }

    async registrazione() {
        if (this.state.email == "" || this.state.pwd == "" || this.state.nome == "" ||
            this.state.cognome == "" || this.state.paypal == "" || this.state.telefono == "" ||
            this.state.tipologia == "") {
            Alert.alert("Errore", "Tutti i campi sono obbligatori. Completali.")
        } else {
            let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (emailReg.test(this.state.email) === false || emailReg.test(this.state.paypal) === false) {
                Alert.alert("Errore", "Le email devono essere valide")
            } else {
                //proceed to registration
                registerRequest(this.state.nome, this.state.cognome, this.state.email, this.state.pwd,
                    this.state.paypal, this.state.telefono, this.state.tipologia, (res) => {
                        if (res.success == true) {
                            Alert.alert("Registrazione completata", "Ora puoi accedere");
                            this.navigation.goBack();
                        } else {
                            Alert.alert("Errore", "Errore durante la registrazione, riprova!");
                        }
                    }, null)
            }
        }

    }


    render() {
        return (
            <>
                <SafeAreaView style={styles.container}>
                    <Image style={styles.image} source={require("../assets/logo.png")} />
                    <Text style={styles.titolo}>Crea Account</Text>
                    <SafeAreaView style={styles.colonna}>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Tipologia Account</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <SelectDropdown dropdownStyle={styles.dropdown} buttonStyle={styles.dropbtn}
                                data={["Utente", "Gestore"]}
                                onSelect={(selectedItem, index) => {
                                    this.setState({ tipologia: selectedItem })
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                            />
                        </SafeAreaView>

                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Nome</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(nome) => this.setState({ nome })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Cognome</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(cognome) => this.setState({ cognome })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Email</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
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
                                onChangeText={(pwd) => this.setState({ pwd })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Email Paypal</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(paypal) => this.setState({ paypal })}
                            />
                        </SafeAreaView>
                        <SafeAreaView style={styles.testo}>
                            <Text style={styles.proprieta}>Telefono</Text>
                        </SafeAreaView>
                        <SafeAreaView style={styles.field}>
                            <TextInput
                                style={styles.input}
                                onChangeText={(telefono) => this.setState({ telefono })}
                            />
                        </SafeAreaView>

                    </SafeAreaView>
                    <SafeAreaView style={styles.btnCont}>
                        <Button color='#72bb53' title='Registrati' onPress={() => this.registrazione()} />
                    </SafeAreaView>
                </SafeAreaView>
            </>
        );
    }

}

module.exports = Registrazione;