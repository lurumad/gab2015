
var app = angular.module('app', ['ngRoute','app.controllers']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/', { templateUrl: '/views/partials/posts-list.html', controller: 'postsController' }).
        when('/post/:postId', { templateUrl: '/views/partials/post-detail.html', controller: 'postDetailController' }).
        otherwise({ redirectTo: '/' });
}]);



//app.config(['$routeProvider', function ($routeProvider) {
//        $routeProvider.
//          when('/posts', { templateUrl: 'partials/posts-list.html', controller: 'postsController' }).
//          when('/post', { templateUrl: 'partials/post-detail.html', controller: 'postDetailController' }).
//          when('/post/:postId', {templateUrl: 'partials/post-detail.html',controller: 'postDetailController'}).
//          otherwise({redirectTo: '/post'});
//    }]);
   
