import * as React from 'react';
import { Alert, Button, Text, TextInput, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { apiCall } from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/prenota';

class Prenota extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            id: props.campo,
            data: props.data,
            slot_liberi: null,
            token: null,
            buttonText: 'ACCEDI A PAYPAL',
            oraInizio: null,
            oraFine: null,
        }
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    async get_slots() {
        apiCall(await this.getToken(), 'campo/' + this.state.id + '/slot/giorno/' + this.state.data, 'GET', null, null, (res => {
            if (res.success) {
                this.setState({
                    slot_liberi: res.data
                })
            }
            else {
                this.setState({
                    slot_liberi: []
                })
            }
        }), (err => {
            Alert.alert('Errore', 'Impossibile caricare gli slot');
        }), this.navigation)
    }

    componentDidMount() {
        this.get_slots();
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    test() {
        Alert.alert('Access effettuato con successo');
        this.setState({
            buttonText: 'PAGA E CONFERMA'
        })
    }

    handleInizioHourInput = (text) => {
        if (text.length === 2) {
            text = text + ':';
            this.setState({
                oraInizio: text
            })
        } else
            // keep only first 5 characters
            this.setState({ oraInizio: text.substring(0, 5) });
    }

    handleFineHourInput = (text) => {
        if (text.length === 2) {
            text = text + ':';
            this.setState({
                oraFine: text
            })
        } else
            // keep only first 5 characters
            this.setState({ oraFine: text.substring(0, 5) });
    }


    render() {
        return (
            <>
                <SafeAreaView style={styles.container}>
                    <FlatList
                        style={{
                            maxHeight: '50%',
                        }}
                        data={this.state.slot_liberi}
                        renderItem={({ item }) => {
                            return (
                                <SafeAreaView style={styles.item}>
                                    <Text style={styles.ora}>{item.oraInizio.slice(0, -4)} - {item.oraFine.slice(0, -4)}</Text>
                                </SafeAreaView>
                            )
                        }}
                        keyExtractor={item => item.oraInizio}
                    />
                    <SafeAreaView style={{
                        minWidth: '90%',
                        maxWidth: '90%',
                        marginBottom: '2%',
                        marginTop: '20%',
                    }}>
                        <Text style={{
                            fontStyle: 'italic',
                            textAlign: 'center',
                        }}>Inserire l'intervallo di tempo per il quale vuoi prenotare il campo</Text>
                    </SafeAreaView>
                    <SafeAreaView style={styles.slots}>
                        <TextInput style={styles.input} placeholder='Ora inizio' onChangeText={this.handleInizioHourInput} value={this.state.oraInizio} />
                        <TextInput style={styles.input} placeholder='Ora fine' onChangeText={this.handleFineHourInput} value={this.state.oraFine} />
                    </SafeAreaView>
                    <SafeAreaView style={styles.bottom}>
                        <SafeAreaView style={{
                            minWidth: '90%',
                            maxWidth: '90%',
                            marginBottom: '2%',
                        }}>
                            <Text style={{
                                fontStyle: 'italic',
                                textAlign: 'center',
                            }}>Per confermare la tua prenotazione devi prima accedere al tuo account PayPal e poi pagare</Text>
                        </SafeAreaView>
                        <SafeAreaView>
                            <TouchableOpacity onPress={() => this.prova()}
                                style={styles.button}>
                                <Text style={styles.buttonText}>{this.state.buttonText}</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </SafeAreaView >
                </SafeAreaView>
            </>
        );
    }
}

module.exports = Prenota;