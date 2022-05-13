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
  }
});

module.exports = styles;