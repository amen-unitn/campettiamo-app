import * as React from 'react';
import {styles} from '../styles/login.js';
import { loginRequest } from './utils';
import { Text, View, Image, StatusBar, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.state = {
          email:"",
          pwd:""
        }
    }


    setEmail(email){
        this.setState({email:email})
    }
    setPassword(pwd){
        this.setState({pwd:pwd})
    }

    async login(){
      loginRequest(this.state.email, this.state.pwd, async (response) => {
        //console.log(response);
        if(response.success == true){
          await AsyncStorage.setItem('TOKEN', response.token);
          await AsyncStorage.setItem('TIPOLOGIA', response.tipologia)
          this.navigation.navigate('App');
        }else{
          Alert.alert("Errore","Username o password non validi");
        }
      });
      
    }

    async componentDidMount(){
      let token = await AsyncStorage.getItem('TOKEN');
      if(token && token != "")
        this.navigation.navigate('App');
    }

    render() {
        
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require("../assets/logo.png")} />
              
         
              <StatusBar style="auto" />
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Email"
                  placeholderTextColor="#003f5c"
                  onChangeText={(email) => this.setEmail(email)}
                />
              </View>
         
              <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Password"
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  onChangeText={(password) => this.setPassword(password)}
                />
              </View>
         
              <TouchableOpacity>
                <Text style={styles.forgot_button}>Password dimenticata?</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.forgot_button}>Non hai un account? Registrati</Text>
              </TouchableOpacity>

              <View style={styles.btnContainer}>
                <Button color="#61c238" onPress={() => this.login()} title="ACCEDI"/>
              </View>
         
            </View>
          );
         
    }
}

module.exports = Login;

//onClick={loginRequest(this.state.email, this.state.pwd)}