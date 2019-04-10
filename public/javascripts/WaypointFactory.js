app = angular.module('flycar');

app.factory('WaypointData', function ($http) {
    var data = {};

    data.waypoint = {}

    data.waypoints - []

    /**SECCIÓN DE MÉTODOS REMOTOS**/
    //Método shortcut
    //$http.get('/tareas').then(successCallback, errorCallback);
    data.getAll = function () {

        //En este formato de petición HTTP
        //'data' es un arreglo generado a partir
        //del json generado por el server.
        //En este caso los varoles están dentro
        //de un campo llamado 'data'. En otras
        //palabras para poder acceder al '_id', 'nombre' u
        //otro valor, se realiza por medio de la sintaxis
        //'data.data' (sin comillas).

        $http({
            method: 'GET',
            url: '/waypoints'
        }).then(function (data) {
            angular.copy(data.data, data.waypoints);
            console.log(data.data);
            return data.waypoints;
        }, function (error) {
            console.log(error);
            return null;
        });
    }

    data.add = function (waypoint) {
        $http.post('/waypoint', waypoint).then(successCallback, errorCallback);
        function successCallback(data) {
            data.waypoints.push(waypoint);
            //console.log(data);
        }
        function errorCallback(error) {
            console.log(error);
        }
    };

    data.update = function (waypoint) {
        $http.put('/ruta/' + waypoint._id, waypoint).then(successCallback, errorCallback);
        function successCallback(data) {
            var indice = data.waypoints.indexOf(waypoint);
            data.waypoints[indice] = data;
        }
        function errorCallback(error) {
            console.log(error);
        }
    }

    return data;
});
