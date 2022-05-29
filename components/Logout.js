import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
  }

  async componentDidMount() {
    this.navigation.navigate('Login');
    await AsyncStorage.setItem('TOKEN', "");
    await AsyncStorage.setItem('TIPOLOGIA', "")
    await AsyncStorage.setItem('EMAIL', "")
  }

  render() {

    return (
      <View>
      </View>
    );

  }
}

module.exports = Logout;