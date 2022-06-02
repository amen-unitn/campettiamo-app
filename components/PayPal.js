import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { requestOneTimePayment } from 'react-native-paypal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiCall } from './utils';

export default PayPal = (props) => {

    console.log(props.amount)

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
        <SafeAreaView>
            <ScrollView>
                <View style={styles.wrapper}>
                    <TouchableOpacity onPress={() => requestPayment()}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Accedi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={disabled} onPress={() => submitPayment()}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Paga</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    headerStyle: {
        fontSize: 24,
        fontWeight: '600',
        color: 'black',
    },
    sectionTitle: {
        paddingTop: 10,
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
    description: {
        paddingTop: 5,
        fontSize: 12,
        color: 'black',
    },
    wrapper: {
        padding: 10,
    },
    errorText: {
        color: 'red',
    },
    textInput: {
        padding: 5,
        marginTop: 5,
        backgroundColor: 'grey',
        fontSize: 16,
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: '#1E6738',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
    },
    buttonText: {
        color: 'white',
        alignSelf: 'center',
        fontWeight: '600',
    },
    sectionBorder: {
        width: '100%',
        height: 1,
        backgroundColor: 'black',
        marginVertical: 10,
    },
});