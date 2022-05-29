import { StyleSheet, Dimensions } from "react-native";

styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    alignSelf: 'center',
    aspectRatio: 1,
    flex:1,
    maxWidth: 100,
    maxHeight: 100,
    marginTop: 5,
    marginBottom: 5
  },
  dropdown:{
    width:'80%'
  },
  dropbtn:{
    width:'90%'
  },
  plus: {
    flex: 1,
    position: 'absolute',
    bottom: '3%',
    right: '3%',
    width: '15.5%',
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
    marginBottom: '2%',
  },
  colonna: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  testo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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

  btnCont:{
    width: "80%",
    justifyContent: "center",
    color: "#61c238",
    marginTop: '5%'
  }
});

module.exports = {styles};
