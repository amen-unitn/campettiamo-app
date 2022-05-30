import * as React from 'react';
import { styles } from '../styles/login.js';
import { apiCall } from './utils';
import { Text, View, Image, StatusBar, TextInput, TouchableOpacity, Button, Alert } from 'react-native';

class RecuperoPwd extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      email: ""
    }
  }


  setEmail(email) {
    this.setState({ email: email })
  }

  async requestPassword() {
    apiCall("", "recupero", "POST", null, {"email":this.state.email}, (res)=>{
        if(res.success){
            Alert.alert("Password generata", "Controlla la tua mail, ti abbiamo inviato una nuova password");
            this.navigation.goBack();
        }else{
            Alert.alert("Errore", "Utente non trovato");
        }
    }, (err)=>{
        Alert.alert("Errore", "Riprova più tardi");
    }, null);

  }
      

  render() {

    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require("../assets/logo.png")} />
        <Text style={styles.titolo}>Recupera Password</Text>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(email) => this.setEmail(email)}
          />
        </View>

        <View style={styles.btnContainer}>
          <Button color="#61c238" onPress={() => this.requestPassword()} title="Recupera Password" />
        </View>

      </View>
    );

  }
}

module.exports = RecuperoPwd;