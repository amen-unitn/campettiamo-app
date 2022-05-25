import * as React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Searchbar } from 'react-native-paper';
import { Text, SafeAreaView, FlatList, Alert } from 'react-native';
import styles from '../styles/cerca_campi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InputSpinner from 'react-native-input-spinner'
import * as Location from 'expo-location';

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
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.0372,
            longitudeDelta: 0.03,
            currentPosition: false,
            moved: false,
            textChanged: false,
        }
        this.listCampiByNome();
        this.listCampiByLuogo();
    }

    componentDidMount() {
        this.get_curent_location();
        this.setState({ refresh: false });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.searchLuogo != this.state.searchLuogo || prevState.raggio !== this.state.raggio || prevState.latitude !== this.state.latitude || prevState.longitude !== this.state.longitude) {
            this.listCampiByLuogo();
        }
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

    get_curent_location = async () => {
        await Location.requestForegroundPermissionsAsync().then(() => {
            Location.getCurrentPositionAsync({
                enableHighAccuracy: true,
            }).then((location) => {
                this.setState({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.0372,
                    longitudeDelta: 0.03,
                    currentPosition: true,
                });
            });
        });
    }

    listCampiByNome = async () => {
        await fetch('https://campettiamo.herokuapp.com/api/v1/campi-nome?nome=' + this.state.searchNome, {
            method: 'GET',
            headers: new Headers({
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpYW5uaS52ZXJkaUBnbWFpbC5jb20iLCJpZCI6IjgwZWIzYWZhLWExY2YtNDE5YS1iYjJjLTI1NDJlNWRmOGY1NyIsInRpcG9sb2dpYSI6IlV0ZW50ZSIsImlhdCI6MTY1MzQ3MDQ0MSwiZXhwIjoxNjUzNTU2ODQxfQ.PDadY9oaX33e-_BclHoQ7s_9kzY4jxKJqBZRNbkfvVs',
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
        if (this.state.searchLuogo != '') {
            await fetch('https://campettiamo.herokuapp.com/api/v1/campi-luogo?luogo=' + this.state.searchLuogo + '&raggio=' + this.state.raggio, {
                method: 'GET',
                headers: new Headers({
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpYW5uaS52ZXJkaUBnbWFpbC5jb20iLCJpZCI6IjgwZWIzYWZhLWExY2YtNDE5YS1iYjJjLTI1NDJlNWRmOGY1NyIsInRpcG9sb2dpYSI6IlV0ZW50ZSIsImlhdCI6MTY1MzQ3MDQ0MSwiZXhwIjoxNjUzNTU2ODQxfQ.PDadY9oaX33e-_BclHoQ7s_9kzY4jxKJqBZRNbkfvVs',
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
        } else {
            await fetch('https://campettiamo.herokuapp.com/api/v1/campi-raggio?lat=' + this.state.latitude + '&lng=' + this.state.longitude + '&raggio=' + this.state.raggio, {
                method: 'GET',
                headers: new Headers({
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpYW5uaS52ZXJkaUBnbWFpbC5jb20iLCJpZCI6IjgwZWIzYWZhLWExY2YtNDE5YS1iYjJjLTI1NDJlNWRmOGY1NyIsInRpcG9sb2dpYSI6IlV0ZW50ZSIsImlhdCI6MTY1MzQ3MDQ0MSwiZXhwIjoxNjUzNTU2ODQxfQ.PDadY9oaX33e-_BclHoQ7s_9kzY4jxKJqBZRNbkfvVs',
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
    }

    render() {
        if (!this.state.mappa) {

            return (
                <SafeAreaView style={styles.container}>
                    <Searchbar
                        placeholder="Cerca per nome"
                        onChangeText={(text) => {
                            this.setState({ searchNome: text, textChanged: true }, async () => {
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
                            this.setState({ searchLuogo: text })
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
                            latitudeDelta: this.state.latitude!=0?this.state.latitudeDelta:90,
                            longitudeDelta: this.state.latitudeDelta!=0?this.state.longitudeDelta:180 
                        }}
                        onRegionChangeComplete={(region) => { // check if position is now avaiable

                            if (this.state.moved == false && this.state.currentPosition == true) {
                                this.setState({
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                    latitudeDelta: region.latitudeDelta,
                                    longitudeDelta: region.longitudeDelta,
                                    moved: true,
                                    currentPosition: false
                                })
                            } else if (this.state.textChanged == false || this.state.moved == false) {
                                this.setState({
                                    latitude: region.latitude,
                                    longitude: region.longitude,
                                    latitudeDelta: region.latitudeDelta,
                                    longitudeDelta: region.longitudeDelta,
                                    moved: true,
                                })
                            }
                        }}
                    >
                        {this.state.campiLuogo.map(campo => (
                            <MapView.Marker

                                key={campo.id}
                                coordinate={{
                                    latitude: campo.lat,
                                    longitude: campo.lng
                                }}
                                onCalloutPress={() => {
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
                </SafeAreaView >
            );
        }
    }
}

module.exports = ListaCampi;