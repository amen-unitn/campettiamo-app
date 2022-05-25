const BASE_URL = "https://campettiamo.herokuapp.com/api/v1/"

/**
 * Calls an API endpoint
 * @param {string} path after /api/v1/ 
 * @param {string} method GET | POST | PUT | DELETE
 * @param {list} getParams params to send in query string: list of objects {name:"name", value:"value"}
 * @param {object} body params to send in request body (object)
 * @returns Promise passing object (parsed from json) to resolve() and string to reject()
 */
function apiCall(token, path, method, getParams, body){
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
            let res = response.json()
            resolve(res)
        }).catch(error => {
            reject(error)
        })
    });
}

module.exports = {apiCall}