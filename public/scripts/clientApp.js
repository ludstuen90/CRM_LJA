var CRMLJA = angular.module('CRMLJA', []);


CRMLJA.controller('Ctrl', function ($scope) {
   $scope.msg = 'hello, world.';
});

CRMLJA.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});

CRMLJA.controller('contentArea', ['$scope', '$http', '$window', function($scope, $http, $window){

$scope.editClientInfo = function(){
  $window.location.href = '/editClientInfo';
};


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
    $scope.statusOfTheCase = 'open';
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

$scope.insurerEdit = function(indexParam){
  console.log("Insureredit click received with param of ", indexParam);
insurerEdit = {
  insureId: indexParam
};

  $http({
    method: 'POST',
    url: '/sendInsure',
    data: insurerEdit
  }).then(function(){
    $window.location.href= '/insureEdit';
  });
};


$scope.getClients();

$scope.updateCaseDisplay = function(){
  console.log($scope.statusOfTheCase);
  if(($scope.statusOfTheCase)=='closed'){
    $http({
      method: 'GET',
      url: '/getClosedCases',
    }).then(function(response){
  console.log(response.data);
  $scope.cases = response.data;
});
  } else if (($scope.statusOfTheCase)== 'open'){
    $http({
      method: 'GET',
      url: '/getOpenCases'
    }).then(function(response){
      console.log(response.data);
      $scope.cases = response.data;
    });
    console.log('cats!');
  } else {
    $http({
      method: 'GET',
      url: '/getCanceledCases'
    }).then(function(response){
      console.log(response.data);
      $scope.cases = response.data;

    });
  }
};



}]);

CRMLJA.controller('searchPage', ['$scope', '$http', '$window', function($scope, $http, $window){

        $scope.test = function(){
          console.log("Search page works!");
        };

        $scope.nextPage = function(){
          console.log('made it to next page');
          $window.location.href = '/360';
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
            $scope.statusOfTheCase=  $scope.caseMeta.status;
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

        $scope.caseStatus = function(){
          console.log('hit on case status received');
          $scope.caseMeta.status = $scope.statusOfTheCase;
          var caseStatusSend = {
            status: $scope.caseMeta.status
          };

          $http({
            method: 'POST',
            url: '/caseStatusUpdate',
            data: caseStatusSend
          }).then(function(){
            $window.location.href = '/360';

          });

        };




}]);


CRMLJA.controller('caseNotes', ['$scope', '$http', '$window', '$filter', function($scope, $http, $window, $filter){
$scope.casenotes=[];
$scope.noteId = 0;


      $scope.seeNote= function(noteId){
        console.log("received a note click request of ", noteId);
        noteView = {
          view: noteId
        };

          $scope.toNotes = function(){
              console.log('Request received to go to notes');
            };
              $http({
                method: 'POST',
                url: '/noteView',
                data: noteView
              }).then(function(){
                $http({
                  method: 'GET',
                  url: '/noteSee',
                }).then(function(response){
                  $scope.noteId = response.data;
                  console.log('after request, we declare noteId' , $scope.noteId);
                  $scope.findNote();
                });
              });

              $scope.toNotes();
      };

      $scope.findNote = function() {
        for (var i=0; i<$scope.casenotes.length; i++){
          console.log('at position ', i, 'the scope is', $scope.casenotes[i].id, 'and the noteId is ', $scope.noteId);
          if ($scope.casenotes[i].id === $scope.noteId) {
            console.log('long form', $scope.casenotes[i].note);
            $scope.currentNote = $scope.casenotes[i].note;
            $scope.currentTitle = $scope.casenotes[i].title;
            console.log('marshalled variable', $scope.currentNote);
          }
        }
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
          console.log('casenotes is now!', $scope.casenotes);
          $http({
            method: 'GET',
            url: '/noteSee',
          }).then(function(response){
            $scope.noteId = response.data;
            console.log('after request, we declare noteId' , $scope.noteId);
            $scope.findNote();
          });
            });


      };

      $scope.noteInit();
      // $scope.seeNote(casenotes[2].id);

}]);


CRMLJA.controller('caseCreate', ['$scope', '$http', '$window', function($scope, $http, $window){
      $http({
        method: 'GET',
        url: '/getClient',
      }).then(function(response){
        $scope.client = response.data[0];
        console.log("Client info is...");
        console.log($scope.client);
      });


  $scope.caseCreate = function(){
    var caseCreate = {
      title: $scope.title,
      author: $scope.author,
      assigned: $scope.assignedTo,
      claimNo: $scope.claimNo,
      resumen: $scope.resumen
    };
    console.log(caseCreate);


    $http({
      method: 'POST',
      url: '/newCase',
      data: caseCreate
    }).then(function(){

      $http({
        method:'GET',
        url: '/getLastVal',
      }).then(function(){
        $window.location.href = '/case';

      });


      // $http({
      //   method: 'GET',
      //   url: '/noteSee',
      // }).then(function(response){
      //   $scope.noteId = response.data;
        console.log('finished case create');
        // $scope.findNote();
      // });
    });
  };
}]);


CRMLJA.controller('addNote', ['$scope', '$http', '$window', function($scope, $http, $window){
      $scope.initial = function(){
        $http({
          method: 'GET',
          url: '/getClient',
        }).then(function(response){
          $scope.client = response.data[0];
        console.log("Client info is...");
          console.log($scope.client);
        });
      };

      $scope.initial();



      $http({
        method: 'GET',
        url: '/caseMet',
      }).then(function(response){
        console.log("Now, for case meta information we are receiving...");
        $scope.caseMeta = response.data[0];
        console.log($scope.caseMeta);
      });

      $scope.noteSubmit= function(){
        var newNote = {
          noteTitle: $scope.createNoteTitle,
          noteContents: $scope.addedNote,
          noteAuthor: $scope.createNoteAuthor
        };


        $http({
          method: 'POST',
          url: '/newCaseNote',
          data: newNote
        }).then(function(){
            $window.location.href = '/caseNoteView';
        });

        console.log('note title is ', $scope.createNoteTitle, 'the author is ', $scope.createNoteAuthor, ' and the body is ', $scope.addedNote);

      };
}]);


CRMLJA.controller('insureEdit', ['$scope', '$http', '$window', function($scope, $http, $window){
$scope.thisInsurer = 0;
$scope.specificInsure= '';




$scope.receiveInsurerInfo = function(){
  console.log('received request at specificInsure');
  $http({
    method: 'GET',
    url: '/specificInsure',
  }).then(function(response){
    console.log(response);
    $scope.specificInsure = response.data;
    console.log($scope.specificInsure);
    console.log($scope.specificInsure[0]);
  });
};
$scope.getInsureId = function(){
  $http({
    method: 'GET',
    url: '/getInsureId'
  }).then(function(response){
    console.log('Insure ID is ' , response.data);
    $scope.thisInsurer = response.data;
    $scope.receiveInsurerInfo();
  });
};

  $scope.initial = function(){
    $http({
      method: 'GET',
      url: '/getClient',
    }).then(function(response){
      $scope.client = response.data[0];
    console.log("Client info is...");
      console.log($scope.client);
      $scope.getInsureId();
    });
  };

$scope.saveInsure= function(){
  console.log($scope.specificInsure );
  console.log($scope.specificInsure[0].first_name);

  $http({
    method: 'GET',
    url: '/removeInsurer'
  }).then(function(){
    $http({
      method: 'POST',
      url: '/addInsurer',
      data: $scope.specificInsure[0]
    }).then(function(){
      $window.location.href = '/360';
    });
});
};



$scope.addInsurance = function(){
  $http({
    method: 'POST',
    url: '/addInsurer',
    data: $scope.specificInsure[0]
  }).then(function(){
    $window.location.href = '/360';
  });

};

$scope.deleteInsure = function() {
  console.log('we have made it to delete insure');
  if (confirm("Are you sure you want to delete this record? This action can NOT be undone.")){
    if ('yes' === prompt("If you still want to delete, type 'yes' into the box below. Hint: No quotes needed.")){
      alert("Provider has been deleted.");
      $http({
        method:'GET',
        url: '/removeInsurer'
      }).then(function(){
        $window.location.href = '/360';
      });
    } else{
      alert("Sorry, record not deleted. Either your text input didn't match 'yes', or you cancelled the transaction.");
    }
  } else {
  }
};
  $scope.initial();
}]);



CRMLJA.controller('clientEdit', ['$scope', '$http', '$window', function($scope, $http, $window){
$scope.initCaseEdit = function(){
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
$scope.initCaseEdit();

$scope.saveClientEdit = function(){
  console.log('hit at client edit received');
  var objectToSend = $scope.client;
  console.log(objectToSend);
  $http({
    method: 'POST',
    url: '/updateClientInfos',
    data: objectToSend
  }).then(function(){
    console.log('success');
    $window.location.href = '/360';

  });
};
}]);


// LOG IN CONTROLLER BELOW


CRMLJA.controller('UserController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    $scope.userName;

    // This happens after page load, which means it has authenticated if it was ever going to
    // NOT SECURE
    $http.get('/user').then(function(response) {
        if(response.data) {
            $scope.userName = response.data.username;
            console.log('User Data: ', $scope.userName);
        } else {
            $window.location.href = '/index.html';
        }
    });
}]);
