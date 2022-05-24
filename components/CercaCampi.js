import 'react-native-gesture-handler';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Searchbar } from 'react-native-paper';
import { Text, SafeAreaView, FlatList, Alert } from 'react-native';
import styles from '../styles/cerca_campi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InputSpinner from 'react-native-input-spinner'
import { Calendar } from 'react-native-calendars';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ShowCampi = () => {
    return (
        <Stack.Navigator initialRouteName='Campi' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Campi' component={SearchCampi} />
            <Stack.Screen name='Dettaglio campo' component={DettaglioCampo} />
        </Stack.Navigator>
    )
}

class Dettaglio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.campo,
            info: {},
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            days: {}
        }
        this.slots(this.state.year, this.state.month)
        this.infoCampoDaID(this.state.id)
    }

    infoCampoDaID = async (id) => {
        return await fetch('https://campettiamo.herokuapp.com/api/v1/campo/' + id, {
            method: 'GET',
            headers: new Headers({
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpYW5uaS52ZXJkaUBnbWFpbC5jb20iLCJpZCI6IjgwZWIzYWZhLWExY2YtNDE5YS1iYjJjLTI1NDJlNWRmOGY1NyIsInRpcG9sb2dpYSI6IlV0ZW50ZSIsImlhdCI6MTY1MzQwNjg5OSwiZXhwIjoxNjUzNDkzMjk5fQ.pkHhdraTKdFJ-jQV7t0HIoc4q1hrGeCsMwOJkF5CrFo',
                'Content-Type': 'application/json'
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ info: responseJson })
            })
    }

    componentDidMount() {
        this.infoCampoDaID(this.state.id)
        this.setState({ year: new Date().getFullYear() })
        this.setState({ month: new Date().getMonth() + 1 })
        this.setState({ days: this.slots(this.state.year, this.state.month) })
    }

    render() {

        return (
            <>
                <SafeAreaView style={styles.container}>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        justifyContent: 'flex-start',
                        textAlign: 'center',
                    }}>{this.state.info.nome}</Text>
                    <SafeAreaView style={styles.info}>
                        <Text>Indirizzo: {this.state.info.indirizzo}, {this.state.info.citta}, {this.state.info.cap} {this.state.info.provincia}</Text>
                        <Text>Tariffa: {this.state.info.tariffa} euro</Text>
                        <Text>Prenota entro: {this.state.info.prenotaEntro} ore</Text>
                        <Text style={{
                            flex: 1,
                            flexWrap: 'wrap',
                        }}>Sport: {this.state.info.sport}</Text>
                    </SafeAreaView>
                </SafeAreaView>
                <SafeAreaView>
                    <Calendar style={{
                        marginBottom: '25%',
                        marginHorizontal: '5%',
                    }}
                        onMonthChange={(month) => {
                            this.setState({ month: month.month })
                        }}
                        markedDates={this.state.days}
                        theme={{
                            todayTextColor: '#72bb53',
                            arrowColor: '#72bb53',
                        }}

                    />
                </SafeAreaView>
            </>
        )
    }

    slots = async (year, month) => {

        let month_padded = (month < 10) ? '0' + month : month;

        const giorni = await fetch('https://campettiamo.herokuapp.com/api/v1/campo/' + this.state.id + '/slot/mese/' + year + '-' + month_padded, {
            method: 'GET',
            headers: new Headers({
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpYW5uaS52ZXJkaUBnbWFpbC5jb20iLCJpZCI6IjgwZWIzYWZhLWExY2YtNDE5YS1iYjJjLTI1NDJlNWRmOGY1NyIsInRpcG9sb2dpYSI6IlV0ZW50ZSIsImlhdCI6MTY1MzQwNjg5OSwiZXhwIjoxNjUzNDkzMjk5fQ.pkHhdraTKdFJ-jQV7t0HIoc4q1hrGeCsMwOJkF5CrFo',
                'Content-Type': 'application/json'
            })
        }).then(response => response.json())

        let lista_giorni = {}

        for (var i = 0; i < giorni.length; i++) {
            lista_giorni[year + '-' + month_padded + '-' + giorni[i]] = {
                selected: true,
                selectedColor: '#72bb53',
            }
        }

        this.state.days = lista_giorni
    }
}


const DettaglioCampo = ({ route }) => {
    return (
        <Dettaglio campo={route.params.campo} />
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

class ListaCampi extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            campiNome: [],
            campiLuogo: [],
            searchNome: '',
            searchLuogo: '',
            raggio: 5,
            refresh: true,
            mappa: this.props.mappa,
            latitude: 46.065,
            longitude: 11.125,
            latitudeDelta: 0.0372,
            longitudeDelta: 0.03,
        }
    }

    componentDidMount() {
        this.listCampiByNome();
        this.listCampiByLuogo();
        this.setState({ refresh: false })
    }

    splitTextByComma = (str) => {
        const lines = str.split(',');
        const elements = [];
        if (lines.length !== 1) {
            for (let i = 0; i < lines.length - 1; i += 2) {
                elements.push(
                    <SafeAreaView key={i} style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={{
                            fontSize: 12,
                            fontStyle: 'italic',
                            textAlign: 'center',
                            width: '50%',
                        }}>{lines[i]}</Text>
                        <Text style={{
                            fontSize: 12,
                            fontStyle: 'italic',
                            textAlign: 'center',
                            width: '50%',
                        }}>{lines[i + 1]}</Text>
                    </SafeAreaView>
                );
            }
        } else {
            elements.push(
                <SafeAreaView key={0} style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontSize: 12,
                        fontStyle: 'italic',
                        textAlign: 'center',
                        width: '50%',
                        textAlign: 'center',
                    }}>{lines[0]}</Text>
                </SafeAreaView>
            );
        }
        return elements;
    }



    listCampiByNome = async () => {
        await fetch('https://campettiamo.herokuapp.com/api/v1/campi-nome?nome=' + this.state.searchNome, {
            method: 'GET',
            headers: new Headers({
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpYW5uaS52ZXJkaUBnbWFpbC5jb20iLCJpZCI6IjgwZWIzYWZhLWExY2YtNDE5YS1iYjJjLTI1NDJlNWRmOGY1NyIsInRpcG9sb2dpYSI6IlV0ZW50ZSIsImlhdCI6MTY1MzQwNjg5OSwiZXhwIjoxNjUzNDkzMjk5fQ.pkHhdraTKdFJ-jQV7t0HIoc4q1hrGeCsMwOJkF5CrFo',
                'Content-Type': 'application/json'
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    campiNome: responseJson,
                })
            })
            .catch(() => {
                Alert.alert("Impossibile caricare i campi", "Riprova più tardi");
            });
    }

    listCampiByLuogo = async () => {
        let luogo = this.state.searchLuogo == '' ? 'Trento' : this.state.searchLuogo
        await fetch('https://campettiamo.herokuapp.com/api/v1/campi-luogo?luogo=' + luogo + '&raggio=' + this.state.raggio, {
            method: 'GET',
            headers: new Headers({
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpYW5uaS52ZXJkaUBnbWFpbC5jb20iLCJpZCI6IjgwZWIzYWZhLWExY2YtNDE5YS1iYjJjLTI1NDJlNWRmOGY1NyIsInRpcG9sb2dpYSI6IlV0ZW50ZSIsImlhdCI6MTY1MzQwNjg5OSwiZXhwIjoxNjUzNDkzMjk5fQ.pkHhdraTKdFJ-jQV7t0HIoc4q1hrGeCsMwOJkF5CrFo',
                'Content-Type': 'application/json'
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    campiLuogo: responseJson,
                })
            })
            .catch(() => {
                Alert.alert("Impossibile caricare i campi", "Riprova più tardi");
            });
    }

    render() {
        if (!this.state.mappa) {

            return (
                <SafeAreaView style={styles.container}>
                    <Searchbar
                        placeholder="Cerca per nome"
                        onChangeText={(text) => {
                            this.setState({ searchName: text }, async () => {
                                await this.listCampiByNome();
                            })
                        }}
                    />
                    <FlatList
                        data={this.state.campiNome}
                        renderItem={({ item }) =>
                            <TouchableOpacity
                                onPress={() => {
                                    this.navigation.navigate('Dettaglio campo', { campo: item.id })
                                }}
                                activeOpacity={0.8}
                            >
                                <SafeAreaView style={styles.item}>
                                    <Text style={styles.text}>{item.nome}</Text>
                                    <Text style={styles.indirizzo}>{item.indirizzo}, {item.citta}, {item.cap}, {item.provincia}</Text>
                                </SafeAreaView>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item.id}
                        refreshing={this.state.refresh}
                        onRefresh={() => {
                            this.setState({ search: '' })
                        }}
                    />
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={styles.container}>
                    <Searchbar
                        placeholder="Cerca sulla mappa"
                        onChangeText={(text) => {
                            this.setState({ searchLuogo: text }, async () => {
                                await this.listCampiByLuogo();
                            })
                        }}
                        value={this.state.search}
                    />
                    <MapView
                        showsUserLocation={true}
                        
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: this.state.latitudeDelta,
                            longitudeDelta: this.state.longitudeDelta,
                        }}
                        onRegionChangeComplete={(region) => {
                            this.setState({
                                latitude: region.latitude,
                                longitude: region.longitude,
                                latitudeDelta: region.latitudeDelta,
                                longitudeDelta: region.longitudeDelta,
                            })
                        }}
                        showsUserLocation={true}
                    >
                        {this.state.campiLuogo.map(campo => (
                            <MapView.Marker
                                key={campo.id}
                                coordinate={{
                                    latitude: campo.lat,
                                    longitude: campo.lng
                                }}
                                onCalloutPress={() => {
                                    console.log(campo.id)
                                    this.navigation.navigate('Dettaglio campo', { campo: campo.id })
                                }}
                            >
                                <MapView.Callout>
                                    <SafeAreaView>
                                        <Text style={{
                                            fontWeight: 'bold',
                                            fontSize: 16,
                                        }}>{campo.nome}</Text>
                                        {this.splitTextByComma(campo.sport)}
                                    </SafeAreaView>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))}

                    </MapView>
                    <SafeAreaView style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',

                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            width: '40%',

                        }}>Raggio</Text>
                        <InputSpinner style={{
                            width: '40%',
                            marginVertical: '1%'
                        }} min={1} max={10} value={this.state.raggio} onChange={(value) => {
                            this.setState({ raggio: value }, async () => {
                                await this.listCampiByLuogo();
                            })
                        }
                        } color={'#72bb53'} />
                    </SafeAreaView>
                </SafeAreaView>
            );
        }
    }
}

module.exports = ShowCampi;