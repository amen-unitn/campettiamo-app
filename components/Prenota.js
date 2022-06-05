import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { requestOneTimePayment } from 'react-native-paypal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './utils';
import styles from '../styles/prenota';

const Prenota = (props) => {    

    const [times_pressed, setTimesPressed] = useState(0);
    const [oraInizio, setOraInizio] = useState('');
    const [oraFine, setOraFine] = useState('');
    const [slotLiberi, setSlotLiberi] = useState([]);
    const [buttonText, setButtonText] = useState('ACCEDI A PAYPAL');

    const [clientId, setClientId] = useState('');
    const [serverToken, setServerToken] = useState('');
    const [disabled, setDisabled] = useState(false);

    const [success, setSuccess] = useState({
        nonce: '',
        payerId: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    });

    const get_slots = async () => {
        apiCall(serverToken, 'campo/' + props.campo + '/slot/giorno/' + props.data, 'GET', null, null, (res => {
            if (res.success) {
                setSlotLiberi(res.data)
            } else {
                setSlotLiberi([])
            }
        }), (err => {
            Alert.alert('Errore', 'Impossibile caricare gli slot');
        }), props.navigation)
    }

    useEffect(() => {
        get_slots();
    }, [serverToken])

    const prenota = async () => {
        if (times_pressed === 0) {
            requestPayment();
            setButtonText('PAGA E CONFERMA')
            setTimesPressed(1)
        } else {
            checkIfCanBook();
            setDisabled(true)
        }
    }

    const checkIfCanBook = () => {
        apiCall(serverToken, 'campo/' + props.campo + '/prenota', 'POST', null, {
            data: props.data,
            oraInizio: oraInizio,
            oraFine: oraFine,
        }, (res => {
            if (res.success) {
                submitPayment();
            } else {
                Alert.alert('Errore', 'Impossibile prenotare questo slot');
            }
        }), (err => {
            Alert.alert('Errore', 'Impossibile prenotare');
        }), props.navigation)
    }

    const handleInizioHourInput = (text) => {
        if (text.length === 2) {
            setOraInizio(text + ':');
        } else
            // keep only first 5 characters
            setOraInizio(text.substring(0, 5));
    }

    const handleFineHourInput = (text) => {
        if (text.length === 2) {
            setOraFine(text + ':');
        } else
            // keep only first 5 characters
            setOraFine(text.substring(0, 5));
    }

    const fetchToken = async () => {
        await AsyncStorage.getItem('PAYPAL').then(
            (clientId) => setClientId(clientId),
        )
        await AsyncStorage.getItem('TOKEN').then(
            (token) => setServerToken(token)
        )
    }

    fetchToken();

    const errorAlert = (err) => {
        if (err) Alert.alert('Oops! Qualcosa è andato storto riprova', err);
    };

    const requestPayment = () => {
        apiCall(serverToken, "paypal/client", "GET", [{ name: "id", value: clientId }], null, (response) => {
            requestOneTimePayment(response.token, { amount: props.amount.toString() })
                .then(setSuccess)
        }, (err) => {
            errorAlert(err);
        }, null)
    }

    const submitPayment = async () => {
        if (success.nonce) {
            await apiCall(serverToken, "paypal/paga", "POST", null, { nonce: success.nonce, amount: props.amount.toString() }, (success, message) => {
                Alert.alert("Prenotazione effettuata", "Pagamento andato a buon fine")
                setDisabled(true)
            }, (err) => {
                errorAlert(err.message)
            }, null)
        }
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <FlatList
                    style={{
                        maxHeight: '50%',
                    }}
                    data={slotLiberi}
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
                    <TextInput style={styles.input} placeholder='Ora inizio' onChangeText={handleInizioHourInput} value={oraInizio} />
                    <TextInput style={styles.input} placeholder='Ora fine' onChangeText={handleFineHourInput} value={oraFine} />
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
                        <TouchableOpacity onPress={prenota} disabled={disabled} style={styles.button}>
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </SafeAreaView >
            </SafeAreaView>
        </>
    );
};

module.exports = Prenota;