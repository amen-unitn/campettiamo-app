import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text } from 'react-native';
import Dettaglio from './Dettaglio';
import ListaCampi from './ListaCampi';


import { requestOneTimePayment, requestBillingAgreement } from 'react-native-paypal'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();


const ShowCampi = () => {
    return (
        <Stack.Navigator initialRouteName='Campi' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Campi' component={SearchCampi} />
            <Stack.Screen name='Dettaglio campo' component={DettaglioCampo} />
            <Stack.Screen name='Slots' component={SlotsDisponibili} />
        </Stack.Navigator>
    )
}

const SlotsDisponibili = async ({ route, navigation }) => {

    const {
        nonce,
        payerId,
        email,
        firstName,
        lastName,
        phone
    } = await requestBillingAgreement(
      await AsyncStorage.getItem('PAYPAL'),
      {
        billingAgreementDescription: 'Ghe sboro', // required
        // any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
        currency: 'EUR',
        // any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
        localeCode: 'it_IT',
      }
    );

    return (
        <>
            <Text>Slots disponibili</Text>
        </>
    )
}

const DettaglioCampo = ({ route, navigation }) => {
    return (
        <Dettaglio campo={route.params.campo} navigation={navigation} />
    )
}

const SearchCampi = ({ navigation }) => {

    return (
        <Tab.Navigator initialRouteName='Cerca per nome' options={{

        }}>
            <Tab.Screen name="Cerca per nome" children={() => (
                <ListaCampi navigation={navigation} mappa={false} />
            )} options={{
                tabBarIndicatorStyle: {
                    backgroundColor: '#72bb53'
                }
            }} />
            <Tab.Screen name="Cerca sulla mappa" children={() => (
                <ListaCampi navigation={navigation} mappa={true} />
            )} options={{
                tabBarIndicatorStyle: {
                    backgroundColor: '#72bb53'
                }
            }} />
        </Tab.Navigator>
    );
}

splitTextByComma = (str) => {
    return str.split(',');
}


module.exports = ShowCampi;