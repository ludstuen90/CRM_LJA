var CRMLJA = angular.module('CRMLJA', []);

CRMLJA.controller('contentArea', ['$scope', '$http', function($scope, $http){

  $scope.angularWorks = function(){
    console.log('angular works');
  };

  $scope.client ={
    firstName: "Aesop",
    lastName: "P.W. Corgi",
    phoneNumber: "555-555-5555",
    address: "522 Dog Way",
    city: "Minneapolis",
    state: "MN",
    ID: "652929",
    email: "BallinAesop818@gmail.com"
  };




  $scope.angularWorks();

}]);
