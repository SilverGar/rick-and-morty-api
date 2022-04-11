// Instanciamos el request.
// Esto nos permite hacer una petición a algun servidor en la nube
let XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

let API = 'https://rickandmortyapi.com/api/character/';


function fetchData(url_api, callback) {
    // Referencia al objeto XMLHttp request 
    let xhttp = new XMLHttpRequest();

    /* 
    Hacemos el llamado a una url
    El 1er parametro pasamos lo que queremos hacer, en este caso GET
    2do parametro pasamos la url
    3er parametro indicamos si queremos que se maneje de forma asincrona(viene en true por defecto)
    */
    xhttp.open('GET', url_api, true);

    // Indicamos lo que se va a hacer con el llamado a la API
    xhttp.onreadystatechange = function (event) {
        /*
        Aqui se hace una validación del estado del llamado de la API
        estado 0: request not initialized
        estado 1: server connection established
        estado 2: request received
        estado 3: processing request
        estado 4: request finished and response is ready
        */
        if (xhttp.readyState === 4) {
            /*
            Verificamos el estado, estos son algunos estados comunes:
            200: 'OK'
            403: 'Forbidden'
            404: 'Page not found'
            Lista completa: https://www.w3schools.com/tags/ref_httpmessages.asp

            En este caso queremos verificar que todo cargo correctamente, es decir el estado 200
            */
            if (xhttp.status === 200) {
                // Estandar de node, primer valor es el error, y el segundo la información
                callback(null, JSON.parse(xhttp.responseText));
            } else {
                const error = new Error('Error ' + url_api);
                return callback(error, null);
            }
        }
    }
    // Envio de la solicitud
    xhttp.send();
}

// Primero se hace fetch de la lista de personajes, y se almacena la info en data1
fetchData(API, function (error1, data1) {
    // Si hay un error lo imprimimos
    if (error1) return console.error(error1);
    // Despues se hace fetch del primer personaje y se almacena la info en data2
    fetchData(API + data1.results[0].id + '/', function (error2, data2) {
        // Imprimimos error si lo hay
        if (error2) return console.error(error2);
        // Por ultimo se hace fetch de la dimension del personaje y se almacena la info en data 3
        fetchData(data2.origin.url + '/', function (error3, data3) {
            if (error3) return console.error(error3);

            // Se imprime la cantidad de personajes disponibles
            console.log(data1.info.count);
            // Se imprime el nombre del primer personaje
            console.log(data2.name);
            // Se imprime la dimension del primer personaje
            console.log(data3.dimension);
        })
    });
});