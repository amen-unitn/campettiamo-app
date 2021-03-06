import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import CustomDrawer from './components/CustomDrawer';
import Login from './components/Login';
import Registrazione from './components/Registrazione';
import RecuperoPwd from './components/RecuperoPwd';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {

  const StartApp = ({ route, navigation }) => {
    return (
        <Login navigation={navigation} />
    )
  }

  return (
    <>
    <StatusBar animated={true} barStyle='default' backgroundColor='#72bb53' />
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={StartApp} />
          <Stack.Screen name='RecuperoPwd' component={RecuperoPwd} />
          <Stack.Screen name='Registrazione' component={Registrazione} />
          <Stack.Screen name='App' component={CustomDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );

}