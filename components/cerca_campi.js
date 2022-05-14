import 'react-native-gesture-handler';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Searchbar } from 'react-native-paper';
import { View, Text, SafeAreaView, FlatList, Alert } from 'react-native';
import styles from '../styles/cerca_campi';
import { set } from 'react-native-reanimated';
import { ComponentEventsObserver } from 'react-native-navigation/lib/dist/src/events/ComponentEventsObserver';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ShowCampi = () => {
    return (
        <Stack.Navigator initialRouteName='Campi' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Campi' component={SearchCampi} />
        </Stack.Navigator>
    )
}

const SearchCampi = () => {
    return (
        <Tab.Navigator initialRouteName='Cerca per nome' options={{

        }}>
            <Tab.Screen name="Cerca per nome" component={SearchCampiByName} options={{
                tabBarIndicatorStyle: {
                    backgroundColor: '#72bb53'
                }
            }} />
            <Tab.Screen name="Cerca sulla mappa" component={SearchCampiByMap} options={{
                tabBarIndicatorStyle: {
                    backgroundColor: '#72bb53'
                }
            }} />
        </Tab.Navigator>
    );
}

class ListaCampi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            campi: [],
            search: '',
            refresh: true,
        }
    }

    componentDidMount() {
        this.getCampi();
    }

    getCampi = async () => {
        await fetch('http://192.168.1.120:9080/api/v1/campi')
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                this.setState({
                    //sort by name
                    campi: responseJson.sort((a, b) => (a.nome > b.nome) ? 1 : -1),
                    refresh: false,
                })
            })
            .catch(error => {
                console.error(error);
            });
    }

    filtraCampi = () => {
        return this.state.campi.filter(campo => {
            const tariffa = campo.tariffa.toString();
            return campo.nome.toLowerCase().includes(this.state.search.toLowerCase()) ||
                campo.indirizzo.toLowerCase().includes(this.state.search.toLowerCase()) ||
                campo.citta.toLowerCase().includes(this.state.search.toLowerCase()) ||
                campo.cap.toLowerCase().includes(this.state.search.toLowerCase()) ||
                campo.provincia.toLowerCase().includes(this.state.search.toLowerCase()) ||
                tariffa.includes(this.state.search.toLowerCase())
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <Searchbar
                    placeholder="Nome, indirizzo, luogo, tariffa"
                    onChangeText={(text) => this.setState({ search: text })}
                    value={this.state.search}
                />
                <FlatList
                    data={this.filtraCampi()}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            onPress={() => Alert.alert(item.nome, "Tariffa: " + item.tariffa.toString() + '€')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.item}>
                                <Text style={styles.text}>{item.nome}</Text>
                                <Text style={styles.indirizzo}>{item.indirizzo}, {item.citta}, {item.cap}, {item.provincia}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.id}
                    refreshing={this.state.refresh}
                    onRefresh={() => this.getCampi()}
                />
            </SafeAreaView>
        );
    }
}

function SearchCampiByName({ navigation }) {

    return (
        <View style={styles.container}>
            <ListaCampi
            />
        </View>
    )
}

function SearchCampiByMap({ navigation }) {
    return (
        <View>
            <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                    latitude: 46.065,
                    longitude: 11.125,
                    latitudeDelta: 0.0372,
                    longitudeDelta: 0.03,
                }}
            >
                <MapView.Marker
                    coordinate={{
                        latitude: 46.065,
                        longitude: 11.125,
                    }}
                    title={"Campo"}
                    description={"Campo da calcio"}
                    onCalloutPress={() => {
                        Alert.alert("Campo", "Campo da calcio")
                    }}
                />
            </MapView>
        </View>
    )
}

module.exports = ShowCampi;