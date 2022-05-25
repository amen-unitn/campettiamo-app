import * as React from 'react';
import { Calendar } from 'react-native-calendars';
import { Text, SafeAreaView } from 'react-native';
import { apiCall } from './utils';

const tempToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdpYW5uaS52ZXJkaUBnbWFpbC5jb20iLCJpZCI6IjgwZWIzYWZhLWExY2YtNDE5YS1iYjJjLTI1NDJlNWRmOGY1NyIsInRpcG9sb2dpYSI6IlV0ZW50ZSIsImlhdCI6MTY1MzQ3MDQ0MSwiZXhwIjoxNjUzNTU2ODQxfQ.PDadY9oaX33e-_BclHoQ7s_9kzY4jxKJqBZRNbkfvVs";

class Dettaglio extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
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

    infoCampoDaID = (id) => {
        apiCall(tempToken, "campo/"+id, "GET", null, null)
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

    componentDidUpdate(prevProps, prevState) {
        if (prevState.year !== this.state.year || prevState.month !== this.state.month) {
            this.setState({ days: this.slots(this.state.year, this.state.month) })
        }
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
                        onMonthChange={(date) => {
                            this.setState({ month: date.month })
                        }}
                        markedDates={this.state.days}
                        theme={{
                            todayTextColor: '#72bb53',
                            arrowColor: '#72bb53',
                        }}
                        onDayPress={(data) => {
                            this.navigation.navigate('Slots')
                        }}
                    />
                </SafeAreaView>
            </>
        )
    }

    slots = (year, month) => {

        let month_padded = (month < 10) ? '0' + month : month;
        apiCall(tempToken, "campo/"+this.state.id+"/slot/mese/"+year+"-"+month_padded, "GET", null, null)
        .then(giorni => {
            let lista_giorni = {}

            let today = new Date();
            let lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
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
            this.setState({days: lista_giorni})
        })
    }
}

module.exports = Dettaglio;