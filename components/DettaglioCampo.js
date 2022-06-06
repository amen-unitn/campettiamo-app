import * as React from 'react';
import { Calendar } from 'react-native-calendars';
import { Text, SafeAreaView } from 'react-native';
import { apiCall } from './utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/cerca_campi';

class Dettaglio extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
            campo: props.campo,
            info: {},
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            days: {},
        }
        this.slots(this.state.year, this.state.month)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.year !== this.state.year || prevState.month !== this.state.month) {
            this.setState({ days: this.slots(this.state.year, this.state.month) })
        }
    }

    componentWillUnmount() {
        // fix Warning: Can't perform a React state update on an unmounted component
        this.setState = (state, callback) => {
            return;
        };
    }

    async getToken() {
        if (!this.state.token)
            this.state.token = await AsyncStorage.getItem('TOKEN');
        return this.state.token;
    }

    async trovaImmagine() {
        apiCall(await this.getToken(), '/api/v2/campo/' + id + '/foto', "GET", null, null, res => {
            console.log(res)
        }, err => { }, this.navigation);
    }

    componentDidMount() {
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
                    }}>{this.state.campo.nome}</Text>
                    <SafeAreaView style={styles.info}>
                        <Text>Indirizzo: {this.state.campo.indirizzo}, {this.state.campo.citta}, {this.state.campo.cap} {this.state.campo.provincia}</Text>
                        <Text>Tariffa: {this.state.campo.tariffa} euro</Text>
                        <Text>Prenota entro: {this.state.campo.prenotaEntro} ore</Text>
                        <Text style={{
                            flex: 1,
                            flexWrap: 'wrap',
                        }}>Sport: {this.state.campo.sport}</Text>
                    </SafeAreaView>
                </SafeAreaView>
                <SafeAreaView>
                    <Calendar style={{
                        marginBottom: '25%',
                        marginHorizontal: '5%',
                    }}
                        onMonthChange={(date) => {
                            this.setState({ month: date.month })
                        }}
                        markedDates={this.state.days}
                        theme={{
                            todayTextColor: '#72bb53',
                            arrowColor: '#72bb53',
                        }}
                        onDayPress={(data) => {
                            this.navigation.navigate('Slots', {
                                data: data.dateString,
                                campo: this.state.campo.id
                            })
                        }}
                    />
                </SafeAreaView>
            </>
        )
    }

    slots = async (year, month) => {

        let month_padded = (month < 10) ? '0' + month : month;
        apiCall(await this.getToken(), "campo/" + this.state.campo.id + "/slot/mese/" + year + "-" + month_padded, "GET", null, null,
            res => {
                let giorni = res.data;
                let lista_giorni = {}

                let lastDayOfMonth = new Date(year, month, 0).getDate();

                for (let i = 1; i <= lastDayOfMonth; i++) {
                    let day_paddded = (i < 10) ? '0' + i : i;
                    // check if i is in giorni
                    if (giorni.find(giorno => giorno == i)) {
                        lista_giorni[year + '-' + month_padded + '-' + day_paddded] = {
                            selected: true,
                            selectedColor: '#72bb53',
                        }
                    } else {
                        lista_giorni[year + '-' + month_padded + '-' + day_paddded] = {
                            disabled: true,
                            disableTouchEvent: true,
                        }
                    }
                }
                this.setState({ days: lista_giorni })
            }, null, this.navigation)
    }


}

module.exports = Dettaglio;