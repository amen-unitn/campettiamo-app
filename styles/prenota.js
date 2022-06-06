import { StyleSheet, Dimensions } from "react-native";

styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  slots: {
      flex: 1,
      flexDirection: 'row',
      alignContent: "center",
      borderWidth: 1,
      maxWidth: '80%',
      maxHeight: '5%',
      borderRadius: 10,
      marginBottom: '15%',
      marginTop: '5%',
  },
  input:{
    flex: 1,
    textAlign: "center",
  },
  item: {
    flex: 1,
    backgroundColor: '#72bb53',
    paddingVertical: '5%',
    minWidth: Dimensions.get('window').width,
    marginVertical: '2%',
    alignItems: 'center',    
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  ora: {
    color: 'white',
  },
  button: {
    backgroundColor: '#72bb53',
    minWidth: '80%',
    maxWidth: '80%',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: '3%',
  },
  buttonDisabled: {
    backgroundColor: '#83917d',
    minWidth: '80%',
    maxWidth: '80%',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: '3%',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottom: {
    alignItems: 'center',
  },
  infoText: {

  },
});

module.exports = styles;