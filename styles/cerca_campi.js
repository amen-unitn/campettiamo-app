import { StyleSheet, Dimensions } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';

styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  item: {
    flex: 1,
    backgroundColor: '#72bb53',
    paddingVertical: '10%',
    minWidth: Dimensions.get('window').width,
    marginVertical: '2%',
    alignItems: 'center',
    
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  indirizzo: {
    color: 'white',
  }
});

module.exports = styles;