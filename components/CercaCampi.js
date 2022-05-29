import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Text } from 'react-native';
import Dettaglio from './Dettaglio';
import ListaCampi from './ListaCampi';

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

const SlotsDisponibili = ({ route, navigation }) => {
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