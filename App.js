import { createDrawerNavigator, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ShowCampi from './components/CercaCampi';
import CustomDrawer from './components/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Cerca campi" drawerContent={props => <CustomDrawer {...props} /> }
        screenOptions={{
          drawerActiveBackgroundColor: '#72bb53',
          drawerActiveTintColor: '#fff',
        }}
      >
        <Drawer.Screen name="Cerca campi" component={ShowCampi} options={{
        headerStyle: { backgroundColor: '#72bb53' },
        headerTitleStyle: { color: 'white' },
        headerTitleAlign: 'center',
        headerTintColor: 'white'
      }}
      />
    </Drawer.Navigator>
    </NavigationContainer >
  );
}