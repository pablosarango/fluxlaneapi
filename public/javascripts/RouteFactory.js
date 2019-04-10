app = angular.module('flycar');

app.factory('RouteData', function ($http) {
    var comun = {};

    comun.ruta = {};

    comun.rutas = [];

    /**SECCIÓN DE MÉTODOS REMOTOS**/
    //Método shortcut
    //$http.get('/tareas').then(successCallback, errorCallback);
    comun.getAll = function () {

        //En este formato de petición HTTP
        //'comun' es un arreglo generado a partir
        //del json generado por el server.
        //En este caso los varoles están dentro
        //de un campo llamado 'comun'. En otras
        //palabras para poder acceder al '_id', 'nombre' u
        //otro valor, se realiza por medio de la sintaxis
        //'comun.comun' (sin comillas).

        $http({
            method: 'GET',
            url: '/rutas'
        }).then(function (data) {
            angular.copy(data.data, comun.rutas);
            console.log(data.data);
            return comun.rutas;
        }, function (error) {
            console.log(error);
            return null;
        });
    }

    comun.add = function (ruta) {
        $http.post('/ruta', ruta).then(successCallback, errorCallback);
        function successCallback(data) {
            comun.rutas.push(ruta);
            return true;
            //console.log(comun.rutas.length);
        }
        function errorCallback(error) {
            console.log(error);
            return false;
        }
    };

    comun.update = function (ruta) {
        $http.put('/ruta/' + ruta._id, ruta).then(successCallback, errorCallback);
        function successCallback(data) {
            var indice = comun.rutas.indexOf(ruta);
            comun.rutas[indice] = comun;
        }
        function errorCallback(error) {
            console.log(error);
        }
    }
    /*
    comun.delete = function (tarea) {
        $http.delete('/tarea/' + tarea._id).then(successCallback, errorCallback);
        function successCallback(comun) {
            var indice = comun.tareas.indexOf(tarea);
            comun.tareas.splice(indice, 1);
        }
        function errorCallback(error) {
            console.log(error);
        }
    };
    */


    return comun;
});
