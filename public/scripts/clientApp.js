var CRMLJA = angular.module('CRMLJA', []);

CRMLJA.controller('contentArea', ['$scope', '$http', function($scope, $http){

  $scope.angularWorks = function(){
    console.log('angular works');
  };


$scope.updateClient = function(){
        var sendMe = {
          id: $scope.idIn
        };


        $http({
          method: 'POST',
          url: '/sendClient',
          data: sendMe
        }).then(function(){
          console.log("We have completed the post");
          $scope.getClients();
          // $scope.client = response.data[0];
          console.log($scope.client);
        });

        console.log("before sending to server, searchId is ", sendMe.id);



};

$scope.getClients = function(){
  console.log("get clients was called!");
  $http({
    method: 'GET',
    url: '/getInsurer',
  }).then(function(responseIns){
    console.log("response insurer is is...");
    console.log(responseIns.data);
    $scope.insurer=responseIns.data;
  });

  $http({
    method: 'GET',
    url: '/getClient',
  }).then(function(response){
    console.log("client response is...");
    console.log(response);
    $scope.client = response.data[0];
    console.log($scope.client);
  });
};
$scope.getClients();

}]);

CRMLJA.controller('searchPage', ['$scope', '$http', function($scope, $http){
  $scope.test = function(){
    console.log("Search page works!");
  };

  $scope.nextPage = function(){
    console.log('made it to next page');
    $http({
      method: 'GET',
      url: '/360View'
    });
  };

  $scope.searchClient = function(){
    console.log("We are now searching for...", $scope.clientId);
    var sendMe = {
      id: $scope.clientId
    };

    $http({
      method: 'POST',
      url: '/sendClient',
      data: sendMe
    }).then(function(){
      $scope.nextPage();
    });

  };



}]);
