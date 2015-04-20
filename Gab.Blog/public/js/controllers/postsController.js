'use strict';

angular.module('app.controllers', []).
    controller('postsController', function($scope, $http) {
        $http.get('api/posts')
            .success(function (data) {
                $scope.posts = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error:' + data);
        });

        $scope.titleFilter = function (post) {
            var keyword = new RegExp($scope.titleFilter, 'i');
            return !$scope.nameFilter || keyword.test(post.title);
        };
    }).
    controller('postDetailController', function ($scope, $routeParams, $http) {
        $scope.id = $routeParams.postId;
        $http.get('api/posts/' + $routeParams.postId)
              .success(function (data) {
                    $scope.post = data;
                    console.log(data);
        })
        .error(function (data) {
            console.log('Error:' + data);
        });
    });