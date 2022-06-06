import * as React from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Searchbar } from 'react-native-paper';
import { Text, SafeAreaView, FlatList, Alert } from 'react-native';
import styles from '../styles/cerca_campi';
import { TouchableOpacity } from 'react-native-gesture-handler';
import InputSpinner from 'react-native-input-spinner'
import * as Location from 'expo-location';
import { apiCall } from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    componentDidMount() {
        this.get_current_location();
        this.setState({ refresh: false });
        this.listCampiByLuogo();
        this.listCampiByNome();
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
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

    get_current_location = async () => {
        await Location.requestForegroundPermissionsAsync().then(() => {
            Location.getCurrentPositionAsync({
                enableHighAccuracy: false,
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

        apiCall(await this.getToken(), "campi-nome", "GET", [{ name: "nome", value: this.state.searchNome }], null,
            responseJson => {
                //console.log(responseJson);
                if (responseJson.success) {
                    this.setState({
                        campiNome: responseJson.data,
                    })
                } else {
                    Alert.alert("Impossibile caricare i campi", "Riprova più tardi");
                }

            },
            () => {
                Alert.alert("Impossibile caricare i campi", "Riprova più tardi");
            }, this.navigation);
    }

    listCampiByLuogo = async () => {
        if (this.state.searchLuogo != '') {
            apiCall(await this.getToken(), "campi-luogo", "GET", [{ name: "luogo", value: this.state.searchLuogo },
            { name: "raggio", value: this.state.raggio }], null,
                responseJson => {
                    if (responseJson.success) {
                        this.setState({
                            campiLuogo: responseJson.data,
                        })
                    } else {
                        Alert.alert("Impossibile caricare i campi", "Riprova più tardi");
                    }
                },
                () => {
                    Alert.alert("Impossibile caricare i campi", "Riprova più tardi");
                }, this.navigation);
        } else {
            apiCall(await this.getToken(), "campi-raggio", "GET", [{ name: "lat", value: this.state.latitude },
            { name: "lng", value: this.state.longitude }, { name: "raggio", value: this.state.raggio }], null,
                responseJson => {
                    if (responseJson.success) {
                        this.setState({
                            campiLuogo: responseJson.data,
                        })
                    } else {
                        Alert.alert("Impossibile caricare i campi", "Riprova più tardi");
                    }
                },
                () => {
                    Alert.alert("Impossibile caricare i campi", "Riprova più tardi");
                }, this.navigation);
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
                                    this.navigation.navigate('Dettaglio campo', { campo: item })
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
                        style={styles.map}
                        region={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: this.state.latitude != 0 ? this.state.latitudeDelta : 90,
                            longitudeDelta: this.state.latitudeDelta != 0 ? this.state.longitudeDelta : 180
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
                                    this.navigation.navigate('Dettaglio campo', { campo: campo })
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

                        }}>Distanza (km)</Text>
                        <InputSpinner style={{
                            width: '40%',
                            marginVertical: '1%'
                        }} min={1} max={100} value={this.state.raggio} onChange={(value) => {
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