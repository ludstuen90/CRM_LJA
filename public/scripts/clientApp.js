var CRMLJA = angular.module('CRMLJA', []);

  // angular.module('CRMLJA', ['ngAnimate', 'ui.bootstrap']);
  // angular.module('CRMLJA').controller('DropdownCtrl', function ($scope, $log) {
  //   $scope.items = [
  //     'The first choice!',
  //     'And another choice for you.',
  //     'but wait! A third!'
  //   ];
  //
  //   $scope.status = {
  //     isopen: false
  //   };
  //
  //   $scope.toggled = function(open) {
  //     $log.log('Dropdown is now: ', open);
  //   };
  //
  //   $scope.toggleDropdown = function($event) {
  //     $event.preventDefault();
  //     $event.stopPropagation();
  //     $scope.status.isopen = !$scope.status.isopen;
  //   };
  //
  //   $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));
  // });

CRMLJA.controller('contentArea', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.angularWorks = function(){
    console.log('angular works');
  };

$scope.caseClick = function(index){
  console.log("received request at caseClick of: ");
  console.log(index);

  var caseSend = {
    case_id: index
  };

    $http({
      method: 'POST',
      url: '/caseParams',
      data: caseSend
    }).then(function(){
      console.log('Now we will go to the case');
      $scope.toCase();

    });


  $scope.toCase = function(){
    $window.location.href = '/case';
  };
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
        $http({
          method: 'GET',
          url: '/getCases',
        }).then(function(responseCas){
          console.log('cases response is');
          $scope.cases=responseCas.data;
          console.log($scope.cases);

        });
};







$scope.getClients();

}]);

CRMLJA.controller('searchPage', ['$scope', '$http', '$window', function($scope, $http, $window){

        $scope.test = function(){
          console.log("Search page works!");
        };

        $scope.nextPage = function(){
          console.log('made it to next page');
          $window.location.href = '/';

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
            console.log('post call completed.');
            $scope.nextPage();
          });

        };





}]);


CRMLJA.controller('cases', ['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.getCases = function(){
    $http({
      method: 'GET',
      url: '/getClient',
    }).then(function(response){
      $scope.client = response.data[0];
console.log("Client info is...");
      console.log($scope.client);
    });


    $http({
      method: 'GET',
      url: '/caseMet',
    }).then(function(response){
      console.log("Now, for case meta information we are receiving...");
      $scope.caseMeta = response.data[0];
      console.log($scope.caseMeta);
    });

    $http({
      method: 'GET',
      url: '/caseDet',
    }).then(function(response){
      console.log("Now, for case note content we are receiving...");
      $scope.casenotes = response.data;
      console.log($scope.casenotes);
    });
  };

$scope.noteClick= function(noteId){
  console.log("received a note click request of ", noteId);
  noteView = {
    view: noteId
  };

    $scope.toNotes = function(){
        console.log('Request received to go to notes');
        $window.location.href = '/caseNoteView';
      };
        $http({
          method: 'POST',
          url: '/noteView',
          data: noteView
        }).then(function(){
            console.log('note request completed');
            $scope.toNotes();
        });



};


  $scope.getCases();

}]);


CRMLJA.controller('caseNotes', ['$scope', '$http', '$window', function($scope, $http, $window){
$scope.noteId = 0;

$scope.noteUpdate = function(){
  console.log("note is now", $scope.noteId);
};

$scope.noteInit= function(){
  $http({
    method: 'GET',
    url: '/getClient',
  }).then(function(response){
    $scope.client = response.data[0];
console.log("Client info is...");
    console.log($scope.client);
  });


  $http({
    method: 'GET',
    url: '/caseMet',
  }).then(function(response){
    console.log("Now, for case meta information we are receiving...");
    $scope.caseMeta = response.data[0];
    console.log($scope.caseMeta);
  });

  $http({
    method: 'GET',
    url: '/caseDet',
  }).then(function(response){
    console.log("Now, for case note content we are receiving...");
    $scope.casenotes = response.data;
    console.log($scope.casenotes);
  });

  $http({
    method: 'GET',
    url: '/noteSee',
  }).then(function(response){
    $scope.noteId = response;
    $noteUpdate();
  });
};

$scope.noteInit();



}]);
