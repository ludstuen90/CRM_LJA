var CRMLJA = angular.module('CRMLJA', []);

CRMLJA.controller('contentArea', ['$scope', '$http', function($scope, $http){

  $scope.angularWorks = function(){
    console.log('angular works');
  };

  // $scope.client ={
  //   firstName: "Aesop",
  //   lastName: "P.W. Corgi",
  //   phoneNumber: "555-555-5555",
  //   address: "522 Dog Way",
  //   city: "Minneapolis",
  //   state: "MN",
  //   ID: "652929",
  //   email: "BallinAesop818@gmail.com"
  // };

// $scope.insurer = {
//   provider: "Met Life",
//   cName: "Juanamaria Cordones Cook",
//   phone: "612-555-5555",
//   email: "JCordonesCook@Metlife.com"
// };


  $http({
    method: 'GET',
    url: '/getClient',
  }).then(function(response){
    console.log(response);

    $scope.client = response.data[0];
    console.log($scope.client);
  });

  $http({
    method: 'GET',
    url: '/getInsurer',
  }).then(function(responseIns){
    console.log(responseIns);
    $scope.insurer=responseIns.data[0];
  });





  $scope.angularWorks();

}]);
