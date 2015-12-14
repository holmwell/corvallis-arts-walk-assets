angular.module('caw-edit', ['monospaced.elastic'])
    .controller('EditCtrl', function ($scope, $http) {
        $http.get('/destinations').success(function (config) {
            $scope.assetsUrl = config.assetsUrl;
            $scope.destinations = config.destinations;
        })
        .error(function (err) {
            console.log(err);
        });

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