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
    $scope.meetingList = [
      {agenda: 'Test agenda 1', date: 'Sample date 1', creator: 'Mein hum creator'},
      {agenda: 'Test agenda 2', date: 'Sample date 2', creator: 'Mein hum creator'}
    ];

    $http.get (siteUrl + '/api/upcoming').then (function (response) {
      console.log (response.data);
    }, function (err) {
      console.log (err);
    });

  }])
  .controller ('ctrlUpcoming', ['$sope', '$stateParams', function ($scope, $stateParams) {
    $scope.blank = $stateParams.id;
  }]);
