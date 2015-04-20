'use strict';
angular.module('app.controllers', ['ngSanitize', 'wysiwyg.module']).
    controller('postsController', function($scope, $http, $sce) {
        $http.get('api/posts')
            .success(function (data) {
                $scope.posts = data;
                $scope.contentLoaded = true;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error:' + data);
        });

        $scope.titleFilter = function (post) {
            var keyword = new RegExp($scope.titleFilter, 'i');
            return !$scope.nameFilter || keyword.test(post.title);
        };
        $scope.obtenerBodyHtmlLimitado = function (snippet) {
            var limit = 500;
            var bodyCompleto = $sce.trustAsHtml(snippet);
            if (snippet.length> limit) {
                bodyCompleto = $sce.trustAsHtml(snippet.substring(0, limit) + " ...");
            }
            return bodyCompleto;
        };
       
    }).
    controller('postDetailController', function ($scope, $routeParams, $http, $sce) {
        $scope.id = $routeParams.postId;
        $http.get('api/posts/' + $routeParams.postId)
              .success(function (data) {
                    $scope.post = data;
                    $scope.contentLoaded = true;
                    console.log(data);
        })
        .error(function (data) {
            console.log('Error:' + data);
        });
        $scope.obtenerBodyHtml = function (snippet) {
            return $sce.trustAsHtml(snippet);
        };  
    }).
    controller('newPostController', function ($scope, $http, $location) {
        $scope.addPost = function (post) {
            if (post!=undefined && post.title !== "" && post.body !== "") {
                post.user = "admin";
                $http.post('api/posts/', post)
                    .success(function(data) {
                        $location.path("/");
                        console.log(data);
                    })
                    .error(function(data) {
                        console.log('Error:' + data);
                    });
            }      
        };
}   );

