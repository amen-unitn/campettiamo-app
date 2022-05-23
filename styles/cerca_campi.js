import { StyleSheet, Dimensions } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';

styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  map: {
    width: '100%',
    height: '83%',
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
  },
  info: {
    flex: 1,
    flexDirection: 'column',
  }
});

module.exports = styles;