//const BASE_URL = "https://campettiamo.herokuapp.com/api/v2/"
const BASE_URL = "http://192.168.1.111:9080/api/v2/";

import { Alert } from 'react-native';

/**
 * Calls an API endpoint returning a Promise.
 * @param {string} token user authentication token
 * @param {string} path after /api/v1/ 
 * @param {string} method GET | POST | PUT | DELETE
 * @param {array} getParams params to send in query string: array of objects {name:"name", value:"value"}
 * @param {object} body params to send in request body (object)
 * @returns Promise passing object (parsed from json) to resolve() and string to reject()
 */
function apiCallPromise(token, path, method, getParams, body){
    let queryString = "";
    if(getParams != null){
        queryString = "?";
        getParams.forEach(param => {
            queryString += param['name'] + "=" + param['value'] + "&"
        }) 
        queryString = queryString.slice(0, -1); //remove last &
    } 
    //console.log(BASE_URL + path + queryString); 

    return new Promise((resolve, reject) => {
        fetch(BASE_URL + path + queryString, {
            method: method,
            headers: new Headers({
                'x-access-token': token,
                'Content-Type': 'application/json'
            }),
            body: body !== null ? JSON.stringify(body) : null
        }).then(response => {
            let res = response.json();
            resolve(res)
        }).catch(error => {
            reject(error)
        })
    });
}

/**
 * Calls an API endpoint asynchronously. In case of invalid token, redirects to login page showing an alert message.
 * @param {string} token user authentication token
 * @param {string} path after /api/v1/ 
 * @param {string} method GET | POST | PUT | DELETE
 * @param {array} getParams params to send in query string: array of objects {name:"name", value:"value"}
 * @param {object} body params to send in request body (object)
 * @param {function} resolve function to call when request is successfully completed. It will be called providing a json response object
 * @param {function} reject function to call in case of errors
 * @returns void
 */
function apiCall(token, path, method, getParams, body, resolve, reject, navigation){
    apiCallPromise(token, path, method, getParams, body).then((res)=>{
        //console.log(res);
        if(res.success == false && res.errno == 1){
            //token is invalid
            //here i need to redirect to login page
            Alert.alert("Sessione scaduta", "Rifai l'accesso");
            if(navigation)
                navigation.navigate('Login')
        }else
            resolve(res);
    }).catch((error)=>{
        if(reject)
            reject(error);
    });
}

/**
 * Sends a login request to the API server, getting the token
 * @param {string} email user email
 * @param {string} pwd user password
 * @param {function} resolve function to call in case of successful request, giving json response object. token is available through response.token
 * @param {function} reject function to call in case of errors
 * @returns void
 */
function loginRequest(email, pwd, resolve, reject){
    return apiCall("", "login", "POST", null, {email:email, password:pwd}, resolve, reject);
}


function registerRequest(nome, cognome, email, pwd, paypal, telefono, tipologia, resolve, reject){
    let path = "";
    switch(tipologia){
        case "Utente":{path = "utente"; break;}
        case "Gestore":{path = "gestore";break;}
    }
    return apiCall("", path, "POST", null, {
        nome:nome, cognome:cognome, email:email, paypal:paypal, telefono:telefono, password:pwd
    }, resolve, reject);
}

module.exports = {apiCall, loginRequest, registerRequest}