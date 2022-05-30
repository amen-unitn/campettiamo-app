import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    titolo: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: '2%',
      marginBottom: '5%',
    },
    image: {
      alignSelf: 'center',
      aspectRatio: 1,
      flex:1,
      maxWidth: 250,
      maxHeight: 250,
      marginTop: 10,
      marginBottom: 10
    },
   
    inputView: {
      backgroundColor: "#aef092",
      borderRadius: 10,
      width: "80%",
      height: 45,
      marginBottom: 20,
      alignItems: "center",
    },
   
    TextInput: {
      height: 50,
      flex: 1,
      padding: 10,
      textAlign: "center"
    },
   
    forgot_button: {
      height: 30,
      marginBottom: 30,
    },
   
    btnContainer: {
      width: "80%",
      justifyContent: "center",
      color: "#61c238"
    },

  });

module.exports = {styles};