'use strict';

var app = angular.module ('upcoming', ['ui.router']),
    siteUrl = 'http://localhost:8080';

/*
  configuration of states, default state
  DEFAULT: /meetings (state: meetingList)
*/

app.config (['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state ('upcomingList', {
      url: '/upcoming',
      templateUrl: '/upcomingList.html',
      controller: 'ctrlUpcomingList'
    })
    .state ('upcoming', {
      url: '/upcoming/{id}',
      templateUrl: '/upcoming.html',
      controller: 'ctrlUpcoming'
    });

    $urlRouterProvider.otherwise ('/upcoming');
}]);

/*
  CONTROLLERS FOR ALL states
*/

app
  .controller ('ctrlUpcomingList', ['$scope', '$http', '$q', function ($scope, $http, $q) {
    $scope.meetingList = [];

    $http.get (siteUrl + '/api/upcoming').then (function (response) {
      $scope.meetingList = response.data;
    }, function (err) {
      console.log (err);
    });

  }])
  .controller ('ctrlUpcoming', ['$scope', '$stateParams', '$http', function ($scope, $stateParams, $http) {
    $scope.blank = $stateParams.id;
    $http.get (siteUrl + '/api/upcoming/' + $stateParams.id).then (function (response) {
      $scope.blank = response.data;
    }, function (err) {
      console.log (err);
    });

/*
    $http.get (siteUrl + '/api/upcoming/' + $stateParams.id + '/cancel').then (function (response) {
      console.log (response);
    }, function (err) {
      console.log (err);
    });
*/
  }]);
