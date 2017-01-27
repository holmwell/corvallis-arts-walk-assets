var getDestinations = function ($http, callback) {
    $http.get('/destinations').success(callback)
    .error(function (err) {
        console.log(err);
    });
}

angular.module('caw-edit', ['monospaced.elastic'])
    .controller('EditCtrl', function ($scope, $http) {
        getDestinations($http, function (config) {
            $scope.assetsUrl = config.assetsUrl;
            $scope.destinations = config.destinations.sort(function (a, b) {

                var normalize = function (s) {
                    s = s.toLowerCase();
                    if (s.startsWith("the ")) {
                        s = s.substring("the ".length);
                    }
                    return s;
                }

                var normA = normalize(a.name);
                var normB = normalize(b.name);

                if (normA < normB) {
                    return -1;
                }
                if (normA > normB) {
                    return 1;
                }
                return 0;
            });
        });

        $scope.deactivateAll = function () {
            for (var i=0; i < $scope.destinations.length; i++) {
                $scope.destinations[i].isActive = false;
            }
            $scope.save();
        };

        $scope.save = function () {
            var data = {
                assetsUrl: $scope.assetsUrl,
                destinations: $scope.destinations
            };

            $http.put('/destinations', data).success(function () {
                // We're ok!
            })
            .error(function (err) {
                console.log(err);
            });

            $http.put('/config', data).success(function () {
                // We're ok!
            })
            .error(function (err) {
                console.log(err);
            });            
        }
    })
    .controller('DestCtrl', function ($scope, $http, $window, destId) {
        var destinations;

        getDestinations($http, function (config) {
            destinations = config.destinations;
            destinations.forEach(function (dest) {
                if (dest.id.toString() === destId.toString()) {
                    $scope.dest = dest;
                }
            })
            console.log(destId);
        });

        $scope.save = function () {
            var data = $scope.dest;

            if (data.geocode) {
                data.geocode.lat = data.geocode.lat * 1;
                data.geocode.lng = data.geocode.lng * 1;
            }

            $http.put('/dest', data).success(function () {
                // We're ok! Go back.
                $window.location.href = '/';
            })
            .error(function (err) {
                console.log(err);
            });
        };

    })
    .controller('NewDestCtrl', function ($scope, $http, $window, destId) {
        var destinations;

        $scope.save = function () {
            var data = $scope.dest;

            if ($scope.form.$invalid) {
                $scope.errorMessage = "Please fill out the required fields.";
                return;
            }

            if (data.geocode) {
                data.geocode.lat = data.geocode.lat * 1;
                data.geocode.lng = data.geocode.lng * 1;
            }

            $http.post('/dest', data).success(function () {
                // We're ok! Go back.
                $window.location.href = '/';
            })
            .error(function (err) {
                $scope.errorMessage = err;
                console.log(err);
            });
        };

    })