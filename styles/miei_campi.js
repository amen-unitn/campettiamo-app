import { StyleSheet, Dimensions } from "react-native";

styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    flex: 1,
    position: 'absolute',
    bottom: '3%',
    right: '3%',
    width: '15.5%',
  },
  floatinBtn: {
    borderRadius: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
  },
  add: {
    fontSize: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
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
  },
  titolo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '2%',
  },
  colonna: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  testo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: '1%',
    paddingHorizontal: '5%',
  },
  field: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '1%',
  },
  proprieta: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    borderWidth: 1,
    width: '90%',
    textAlign: 'center',
  },
  crea: {
    marginTop: '5%',
  },
  btnCont:{
    width: "80%",
    justifyContent: "center",
    color: "#61c238",
    marginTop: '2%'
  }
});

module.exports = styles;