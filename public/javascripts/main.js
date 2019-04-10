app = angular.module('flycar', ['ui.router', 'ngMaterial', 'ngMessages', 'mapboxgl-directive']);

app.config(function ($stateProvider, $urlRouterProvider, $mdThemingProvider) {
    $stateProvider
        .state('inicio', {
            url: '/inicio',
            templateUrl: 'views/inicio.html',
            controller: 'ctrlInicio'
        })

        .state('cronograma', {
            url: '/cronograma',
            templateUrl: 'views/cronograma.html',
            controller: 'ctrlCronograma'
        })

        .state('usuarios', {
            url: '/usuarios',
            templateUrl: 'views/usuarios.html',
            controller: 'ctrlUsuarios'
        })

        .state('editor', {
            url: '/editor',
            templateUrl: 'views/editor.html',
            controller: 'ctrlEditor'
        })

        //subpáginas editor
        .state('editor.crear', {
            url: '/crear',
            templateUrl: 'views/editor/crear.html',
            controller: 'ctrlCrearRuta'
        })

        .state('editor.editar', {
            url: '/editar',
            templateUrl: 'views/editor/editar.html',
            controller: 'ctrlEditarRuta'
        })

        .state('editor.eliminar', {
            url: '/eliminar',
            templateUrl: 'views/editor/eliminar.html',
            controller: 'ctrlEliminarRuta'
        })

        .state('visor', {
            url: '/visor',
            templateUrl: 'views/visor.html',
            controller: 'ctrlVisor'
        });

    $urlRouterProvider.otherwise('inicio');

    /*$mdThemingProvider.theme('docs-dark', 'default')
    .primaryPalette('yellow')
    .dark();*/
});

app.run([function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoicGFibG9zYXJhbmdvIiwiYSI6ImNqZmJ0ejZmbDE2dGMycW9idnlzdTEwYzYifQ.2biyau1-6T0nL1LFWHCF2w';
}]);

app.controller('ctrlInicio', function ($scope, $state) { });

app.controller('ctrlCronograma', function ($scope, $state) { });

app.controller('ctrlUsuarios', function ($scope, $state) { });

app.controller('ctrlEditor', function ($scope, $state) {
    switch ($state.current.name) {
        case 'editor.crear': $scope.currentNavItem = 'crear';
            break;
        case 'editor.editar': $scope.currentNavItem = 'editar';
            break;
        case 'editor.eliminar': $scope.currentNavItem = 'eliminar';
    }
});

//controladores subpáginas EDITOR
app.controller('ctrlCrearRuta', function ($scope, $state, $timeout, RouteData, WaypointData) {
    $scope.initialData = {
        mapaLocked: false,
        resumenLocked: false,
        btnNext: false,
        indexTab: 0,
        isOpen: false,
        selectedMode: 'md-fling',
        selectedDirection: 'right'
    }
    $scope.conductor = "";
    $scope.ruta = {
        nombre: "Ruta tesis",
        conductor_id: "5abc21f167a201024dc07fd8",
        velocidad_promedio: "",
        fecha_hora: {
            fecha_creacion: "",
            hora_deseada: "",
            fecha_inicio_captura: "",
            fecha_fin_captura: ""
        },
        clima: "",
        configuracion: {
            int_Captura: 2,
            int_Envio: 5
        },
        coordenadas: {
            coor_inicial: {
                lat_inicial: "-4.032693",
                long_inicial: "-79.202537"
            },
            coor_final: {
                lat_final: "-4.024575",
                long_final: "-79.203135"
            }
        },
        waypoints: []
    }

    $scope.waypoints = [
        {
            identificador: "Referencia A",
            ruta_id: "",
            velocidad_promedio: "",
            fecha_hora: {
                fecha_inicio_captura: "",
                fecha_fin_captura: ""
            },
            coordenadas: {
                latitud: "4.029647",
                longitud: "-79.202620"
            },
            subpoints: []
        },
        {
            identificador: "Referencia B",
            ruta_id: "",
            velocidad_promedio: "",
            fecha_hora: {
                fecha_inicio_captura: "",
                fecha_fin_captura: ""
            },
            coordenadas: {
                latitud: "-4.027152",
                longitud: "-79.202877"
            },
            subpoints: []
        }
    ];

    $scope.routes = RouteData.rutas;

    RouteData.getAll();

    /*$scope.waypoint = {
        identificador: 'Referencia A',
        ruta_id: '',
        velocidad_promedio: '',
        fecha_hora: {
            fecha_inicio_captura: '',
            fecha_fin_captura: ''
        },
        coordenadas: {
            latitud: 'lat',
            longitud: 'long'
        },
        subpoints: []
    }*/



    $scope.toMap = function () {
        /*$scope.initialData = {
            mapaLocked: false,
            resumenLocked: true
        }*/
        $scope.initialData.indexTab = Math.min($scope.initialData.indexTab + 1, 2);
    };

    $scope.toResumen = function () {
        /*$scope.initialData = {
            mapaLocked: false,
            resumenLocked: false
        }*/
        $scope.initialData.indexTab = Math.min($scope.initialData.indexTab + 1, 2);
    };

    $scope.conductor = null;
    $scope.conductores = null;
    $scope.clima = null;
    $scope.climas = null;

    $scope.cargarConductor = function () {

        // Use timeout to simulate a 650ms request.
        return $timeout(function () {

            $scope.conductores = $scope.conductores || [
                { id: 1, name: 'Pablo Sarango' }
            ];

        }, 650);
    };

    $scope.cargarClima = function () {
        $scope.climas = $scope.climas || [
            { id: 1, name: 'Lluvioso' },
            { id: 2, name: 'No lluvioso' }
        ];
    }
    /*
    $scope.previous = function () {
        $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
    */

    // Función para mapa
    $scope.glControls = {
        draw: {
            enabled: true,
            options: {
                position: 'top-left'
            }
        }
    };

    // Guardar Ruta
    $scope.guardar = function () {
        /*console.log($scope.ruta);
        console.log($scope.waypoints);
        $scope.waypoints.forEach(element => {
            console.log(element);
        });
        console.log($scope.waypoints[0]);*/

        //RouteData.add($scope.ruta);
        var json = JSON.stringify($scope.ruta);
        //console.log(json)
        //return guardarRuta(json, guardarWaypoints, errorCallback);
        guardarRuta(json).then((successMessage) => {
            console.log("¡Sí! " + successMessage);
        });
    }

    /*function guardarTodo (ruta, waypoints, successCallback, errorCallback) {

    }

    function successCallback(success) {

    }*/

    function guardarRuta(ruta) {
        const promise = new Promise(function (resolve, reject) {
            /*if (RouteData.add(ruta)) {
                resolve("Exito");
            } else {
                reject(new Error("error al guardar ruta"));
            }*/
            RouteData.add(ruta);
            resolve("chever");
        });
        //
    }

    function guardarWaypoints() {
        var temp = $scope.routes[$scope.routes.length - 1];
        console.log(temp);
    }

    function errorCallback(error) {
        console.log(error);
    }

    /**
     * function addToArray (data, array) {
  const promise = new Promise(function (resolve, reject) {
    setTimeout(function() {
      array.push(data)
      resolve(array)
    }, 1000);
    
    if (!array) {
      reject(new Error('No existe un array'))
    }
  })
  
  return promise
}

const array = [1, 2, 3]
addToArray(4, array).then(function () {
  console.log(array)
})

     */
});

app.controller('ctrlEditarRuta', function ($scope, $state) { });

app.controller('ctrlEliminarRuta', function ($scope, $state) { });


app.controller('ctrlVisor', function ($scope, $state) { });
