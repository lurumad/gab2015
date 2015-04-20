(function () {
    'use strict';

    var app = angular.module('app', ['ngRoute', 'app.controllers']);

    app.config([
        '$routeProvider', function($routeProvider) {
            $routeProvider.
                when('/', { templateUrl: '/views/partials/posts-list.html', controller: 'postsController' }).
                when('/post/:postId', { templateUrl: '/views/partials/post-detail.html', controller: 'postDetailController' }).
                otherwise({ redirectTo: '/' });
        }
    ]);
})();
   
