import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from 'react-native';
import Dettaglio from './DettaglioCampo';
import ListaCampi from './ListaCampi';
import PayPal from './PayPal';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const t = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hdHRpYTI3MDBmcmFuemluQGdtYWlsLmNvbSIsImlkIjoiNDMzNjBhODgtODJkOC00NjY2LTlmNjUtY2Q5MjQ3NTBmN2I1IiwidGlwb2xvZ2lhIjoiR2VzdG9yZSIsImlhdCI6MTY1Mzk1MjExMiwiZXhwIjoxNjU0MDM4NTEyfQ.GfnvTwEnLGrO5hQA1Rcjh7bCs7kX2yHdWcDxKyd1Qe0';
const codice = "eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklqSXdNVGd3TkRJMk1UWXRjMkZ1WkdKdmVDSXNJbWx6Y3lJNkltaDBkSEJ6T2k4dllYQnBMbk5oYm1SaWIzZ3VZbkpoYVc1MGNtVmxaMkYwWlhkaGVTNWpiMjBpZlEuZXlKbGVIQWlPakUyTlRRd05EQTRNallzSW1wMGFTSTZJall3TkRRd09HUTJMVGd5TXpNdE5HUmlNUzA0WVdVMUxUSmlNbVk1WVdKbE9UaGpZaUlzSW5OMVlpSTZJamgzTm1nemNHaDVibVF5TmpSMGNYTWlMQ0pwYzNNaU9pSm9kSFJ3Y3pvdkwyRndhUzV6WVc1a1ltOTRMbUp5WVdsdWRISmxaV2RoZEdWM1lYa3VZMjl0SWl3aWJXVnlZMmhoYm5RaU9uc2ljSFZpYkdsalgybGtJam9pT0hjMmFETndhSGx1WkRJMk5IUnhjeUlzSW5abGNtbG1lVjlqWVhKa1gySjVYMlJsWm1GMWJIUWlPbVpoYkhObGZTd2ljbWxuYUhSeklqcGJJbTFoYm1GblpWOTJZWFZzZENKZExDSnpZMjl3WlNJNld5SkNjbUZwYm5SeVpXVTZWbUYxYkhRaVhTd2liM0IwYVc5dWN5STZleUpqZFhOMGIyMWxjbDlwWkNJNklqUXdOamswTVRjME9DSjlmUS42QWpUdzFqU18wajkzTnRiTWU2WEhTNFpwZk0xcGhrbUNRYTJmQ00wdzJhQ0lkUllhNlN4bkFLLU1WUF8wZFlKdU9iQkxhMDdoSWJndVlqVEVqWldVQT9jdXN0b21lcl9pZD0iLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvOHc2aDNwaHluZDI2NHRxcy9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJncmFwaFFMIjp7InVybCI6Imh0dHBzOi8vcGF5bWVudHMuc2FuZGJveC5icmFpbnRyZWUtYXBpLmNvbS9ncmFwaHFsIiwiZGF0ZSI6IjIwMTgtMDUtMDgiLCJmZWF0dXJlcyI6WyJ0b2tlbml6ZV9jcmVkaXRfY2FyZHMiXX0sImhhc0N1c3RvbWVyIjp0cnVlLCJjbGllbnRBcGlVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvOHc2aDNwaHluZDI2NHRxcy9jbGllbnRfYXBpIiwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwibWVyY2hhbnRJZCI6Ijh3NmgzcGh5bmQyNjR0cXMiLCJhc3NldHNVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImF1dGhVcmwiOiJodHRwczovL2F1dGgudmVubW8uc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbSIsInZlbm1vIjoib2ZmIiwiY2hhbGxlbmdlcyI6W10sInRocmVlRFNlY3VyZUVuYWJsZWQiOnRydWUsImFuYWx5dGljcyI6eyJ1cmwiOiJodHRwczovL29yaWdpbi1hbmFseXRpY3Mtc2FuZC5zYW5kYm94LmJyYWludHJlZS1hcGkuY29tLzh3NmgzcGh5bmQyNjR0cXMifSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImJpbGxpbmdBZ3JlZW1lbnRzRW5hYmxlZCI6dHJ1ZSwiZW52aXJvbm1lbnROb05ldHdvcmsiOmZhbHNlLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYWxsb3dIdHRwIjp0cnVlLCJkaXNwbGF5TmFtZSI6IkNhbXBldHRpYW1vIiwiY2xpZW50SWQiOiJBWW9KSHRjWlZOS0VBVE9aRWJyWHJCalZzalBJQjFxcG1vT015WWRqV2pTMzNibVY4amJOZDF4S3RoQU9iTHc1blpQQnFoX1htekVIX01zMiIsInByaXZhY3lVcmwiOiJodHRwOi8vZXhhbXBsZS5jb20vcHAiLCJ1c2VyQWdyZWVtZW50VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3RvcyIsImJhc2VVcmwiOiJodHRwczovL2Fzc2V0cy5icmFpbnRyZWVnYXRld2F5LmNvbSIsImFzc2V0c1VybCI6Imh0dHBzOi8vY2hlY2tvdXQucGF5cGFsLmNvbSIsImRpcmVjdEJhc2VVcmwiOm51bGwsImVudmlyb25tZW50Ijoib2ZmbGluZSIsImJyYWludHJlZUNsaWVudElkIjoibWFzdGVyY2xpZW50MyIsIm1lcmNoYW50QWNjb3VudElkIjoiY2FtcGV0dGlhbW8iLCJjdXJyZW5jeUlzb0NvZGUiOiJFVVIifX0=";

const ShowCampi = () => {
    return (
        <Stack.Navigator initialRouteName='Campi' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Campi' component={SearchCampi} />
            <Stack.Screen name='Dettaglio campo' component={DettaglioCampo} />
            <Stack.Screen name='Slots' component={SlotsDisponibili} />
        </Stack.Navigator>
    )
}

const SlotsDisponibili = ({ route, navigation }) => {
    return (
        <PayPal amount={10} />
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