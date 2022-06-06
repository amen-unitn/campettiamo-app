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
    const [buttonText, setButtonText] = useState('CONFERMA');
    const [amount , setAmount] = useState(0);
    const [refresh, setRefresh] = useState(true);
    const [clientId, setClientId] = useState('');
    const [serverToken, setServerToken] = useState('');
    const [disabled, setDisabled] = useState(true);

    const [success, setSuccess] = useState({
        nonce: '',
        payerId: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
    });

    const get_slots = () => {
        apiCall(serverToken, 'campo/' + props.campo + '/slot/giorno/' + props.data, 'GET', null, null, (res => {
            if (res.success) {
                setSlotLiberi(res.data)
                setRefresh(false);
            } else {
                setSlotLiberi([])
            }
        }), (err => {
            Alert.alert('Errore', 'Impossibile caricare gli slot');
        }), props.navigation)
    }

    const get_amount = async () => {
        await apiCall(serverToken, 'paypal/amount', 'GET', [
            { name: 'idCampo', value: props.campo },
            { name: 'data', value: props.data },
            { name: 'oraInizio', value: oraInizio },
            { name: 'oraFine', value: oraFine }
        ], null, (res => {
            if (res.success) {
                setAmount(res.amount);
                Alert.alert('L\'importo è di ' + res.amount + '€', 'Ora puoi procedere con il pagamento')
            } else {
                Alert.alert('Errore', 'Impossibile ottenere l\'importo');
            }
        }), (err => {
            Alert.alert('Errore', 'Impossibile ottenere l\'importo');
        }), props.navigation)
    }

    useEffect(() => {
        get_slots();
    }, [serverToken])

    const prenota = async () => {
        if (times_pressed === 0) {
            await get_amount().then(
                
            );
            setButtonText('ACCEDI A PAYPAL')
            setTimesPressed(1);
        } else if (times_pressed === 1) {
            requestPayment()
            setButtonText('PAGA E CONFERMA')
            setTimesPressed(2)
        } else {
            checkIfCanBook();
            setDisabled(true)
        }
    }

    const checkIfCanBook = async () => {
        await apiCall(serverToken, 'campo/' + props.campo + '/prenota', 'POST', null, {
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

        let ora = parseInt(text.substring(0, 2));
        let minuti = parseInt(text.substring(3, 5));
        if (ora >= 0 && ora <= 23 && minuti >= 0 && minuti <= 59 && text.length === 5) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }

    }

    const handleFineHourInput = (text) => {
        if (text.length === 2) {
            setOraFine(text + ':');
        } else
            // keep only first 5 characters
            setOraFine(text.substring(0, 5));

        let ora = parseInt(text.substring(0, 2));
        let minuti = parseInt(text.substring(3, 5));
        if (ora >= 0 && ora <= 23 && minuti >= 0 && minuti <= 59 && text.length === 5) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }

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

    const requestPayment = () => {
        apiCall(serverToken, "paypal/client", "GET", [{ name: "id", value: clientId }], null, (response) => {
            requestOneTimePayment(response.token, { amount: amount.toString() })
                .then(setSuccess)
        }, (err) => {
            Alert.alert('Errore', 'Impossibile richiedere il pagamento');
        }, null)
    }

    const submitPayment = async () => {
        if (success.nonce) {
            await apiCall(serverToken, "paypal/paga", "POST", null, { nonce: success.nonce, amount: amount.toString() }, (success, message) => {
                if (success) {
                    Alert.alert('Prenotazione effettuata', 'Prenotazione effettuata con successo');
                    setDisabled(true);
                }
            }, (err) => {
                Alert.alert('Oops!', 'Qualcosa è andato storto, riprova!');
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
                    refreshing={refresh}
                    onRefresh={() => {
                        setRefresh(true);
                        get_slots();
                    }}

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
                        <TouchableOpacity onPress={prenota} disabled={disabled} style={
                            disabled ? styles.buttonDisabled : styles.button
                        }>
                            <Text style={styles.buttonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    </SafeAreaView>
                </SafeAreaView >
            </SafeAreaView>
        </>
    );
};

module.exports = Prenota;