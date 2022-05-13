import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ShowCampi from './components/cerca_campi';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Cerca campi">
        <Drawer.Screen name="Cerca campi" component={ShowCampi} options={{
          headerStyle: { backgroundColor: '#72bb53' },
          headerTitleStyle: { color: 'white' },
          headerTitleAlign: 'center',
          headerTintColor: 'white'
        }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}