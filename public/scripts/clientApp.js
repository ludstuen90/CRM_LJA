var CRMLJA = angular.module('CRMLJA', ['ngAnimate', 'ui.bootstrap']);



CRMLJA.controller('Ctrl', function ($scope) {
   $scope.msg = 'hello, world.';
});

CRMLJA.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
});

CRMLJA.controller('contentArea', ['$scope', '$http', '$window', function($scope, $http, $window){
  $scope.clientId = "";

      $scope.editClientInfo = function(){
        $window.location.href = '/editClientInfo';
      };

      $scope.angularWorks = function(){
        console.log('angular works');
      };

    $scope.caseClick = function(index){
      console.log("received request at caseClick of: ");
      console.log(index);
      sessionStorage.setItem("caseId", index);

      // var caseSend = {
      //   case_id: index
      // };

        // $http({
        //   method: 'POST',
        //   url: '/caseParams',
        //   data: caseSend
        // }).then(function(){
        //   console.log('Now we will go to the case');
        //   $scope.toCase();
        //
        // });
      $scope.toCase = function(){
        $window.location.href = '/case';
      };

      $scope.toCase();

};

$scope.updateClient = function(){

        // $http({
        //   method: 'POST',
        //   url: '/sendClient',
        //   data: sendMe
        // }).then(function(){
        //   console.log("We have completed the post");
        //   $scope.getClients();
        //   // $scope.client = response.data[0];
        //   console.log($scope.client);
        // });

        // console.log("before sending to server, searchId is ", sendMe.id);

};

$scope.getClients = function(){
  $scope.clientId = sessionStorage.getItem("clientId");
  console.log('scope . client is ', $scope.clientId);
  if ($scope.clientId == undefined) {
    console.log('woof!');
    $window.location.href= '/search';
  }
        var sendMe = {
          id: $scope.clientId
        };
        console.log('send me is ', sendMe);
    $scope.statusOfTheCase = 'open';
        console.log("get clients was called!");
        $http({
          method: 'POST',
          url: '/getInsurer',
          data: sendMe
        }).then(function(responseIns){
          console.log("response insurer is is...");
          console.log(responseIns.data);
          $scope.insurer=responseIns.data;
        });

        $http({
          method: 'POST',
          url: '/getClient',
          data: sendMe
                }).then(function(response){
          console.log("client response is...");
          console.log(response);
          $scope.client = response.data[0];
          console.log('client scope is ', $scope.client);
                });

        $http({
          method: 'POST',
          url: '/getCases',
          data: sendMe
        }).then(function(responseCas){
          console.log('cases response is');
          $scope.cases=responseCas.data;
          // console.log($scope.cases);

        });
};

$scope.insurerEdit = function(indexParam){
  console.log("Insureredit click received with param of ", indexParam);
  sessionStorage.setItem("insureId", indexParam);
  $window.location.href= '/insureEdit';


  // $http({
  //   method: 'POST',
  //   url: '/sendInsure',
  //   data: insurerEdit
  // }).then(function(){
  //   $window.location.href= '/insureEdit';
  // });
};


$scope.getClients();

$scope.updateCaseDisplay = function(){
  var sendMe = {
    id: $scope.clientId
  };

  console.log(sendMe);

  console.log($scope.statusOfTheCase);
  if(($scope.statusOfTheCase)=='closed'){
    $http({
      method: 'POST',
      url: '/getClosedCases',
      data: sendMe
    }).then(function(response){
  console.log(response.data);
  $scope.cases = response.data;
});
  } else if (($scope.statusOfTheCase)== 'open'){
    $http({
      method: 'POST',
      url: '/getOpenCases',
      data: sendMe
    }).then(function(response){
      console.log(response.data);
      $scope.cases = response.data;
    });
  } else {
    $http({
      method: 'POST',
      url: '/getCanceledCases',
      data: sendMe
    }).then(function(response){
      console.log(response.data);
      $scope.cases = response.data;

    });
  }
};



}]);

CRMLJA.controller('searchPage', ['$scope', '$http', '$window', function($scope, $http, $window){
        $scope.whoUser = function(){
          $http({
            method: 'GET',
            url: '/hello',
          }).then(function(response){
            $scope.username = response.data;
          });
        };

        $scope.whoUser();

        $scope.test = function(){
          console.log("Search page works!");
        };

        $scope.nextPage = function(){
          console.log('made it to next page');
          $window.location.href = '/360';
        };

        $scope.searchClient = function(){
          console.log("We are now searching for...", $scope.clientId);
          sessionStorage.setItem("clientId", $scope.clientId);
          $scope.nextPage();


          // var sendMe = {
          //   id: $scope.clientId
          // };
          // $http({
          //   method: 'POST',
          //   url: '/sendClient',
          //   data: sendMe
          // }).then(function(){
          //   console.log('post call completed.');
          //   // $scope.nextPage();
          // });

        };


$scope.myCases = function(){

var myUser = {
  username: 'null'
};

  $http({
    method: 'POST',
    url: '/getCasesMyUser',
    data: myUser
  }).then(function(){
    $http({
      method: 'GET',
      url: '/getMyCases',
    }).then(function(responseCas){
      $scope.cases=responseCas.data;
      console.log('cases response is', $scope.cases);


      // console.log($scope.cases);
    });
  });


};

$scope.myCases();


$scope.caseClick = function(index){
  console.log("received request at caseClick of: ");
  console.log(index);
  sessionStorage.setItem("caseId", $scope.cases[index].id);


  var caseSend = {
    case_id: $scope.cases[index].id
  };

  var sendMe = {
    id: $scope.cases[index].client_id
  };
      $http({
        method: 'POST',
        url: '/sendClient',
        data: sendMe
      }).then(function(){
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

      });


};



}]);


CRMLJA.controller('cases', ['$scope', '$http', '$window', function($scope, $http, $window){
$scope.clientId = sessionStorage.getItem("clientId");
$scope.caseId = sessionStorage.getItem("caseId");

var clientSend = {
  id: $scope.clientId
};

var caseSend = {
  id: $scope.caseId
};

        $scope.getCases = function(){
          $http({
            method: 'POST',
            url: '/getClient',
            data: clientSend
          }).then(function(response){
            $scope.client = response.data[0];
      console.log("Client info is...");
            console.log($scope.client);
          });


          $http({
            method: 'POST',
            url: '/caseMet',
            data: caseSend
          }).then(function(response){
            console.log("Now, for case meta information we are receiving...");
            $scope.caseMeta = response.data[0];
            console.log($scope.caseMeta);
            $scope.statusOfTheCase=  $scope.caseMeta.status;
          });

          $http({
            method: 'POST',
            url: '/caseDet',
            data: caseSend
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
            status: $scope.caseMeta.status,
            id: $scope.caseId
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

$scope.clientId = sessionStorage.getItem("clientId");
$scope.caseId = sessionStorage.getItem("caseId");

var clientSend = {
  id: $scope.clientId
};

var caseSend = {
  id: $scope.caseId
};

      $scope.seeNote= function(noteId){
        console.log("received a note click request of ", noteId);
        noteView = {
          view: noteId
        };

        sessionStorage.setItem("noteId", noteId);
        $scope.findNote();

          // $scope.toNotes = function(){
          //     console.log('Request received to go to notes');
          //   };
          //     $http({
          //       method: 'POST',
          //       url: '/noteView',
          //       data: noteView
          //     }).then(function(){
          //       $http({
          //         method: 'GET',
          //         url: '/noteSee',
          //       }).then(function(response){
          //         $scope.noteId = response.data;
          //         console.log('after request, we declare noteId' , $scope.noteId);
          //         $scope.findNote();
          //       });
          //     });

              // $scope.toNotes();
      };

      $scope.findNote = function() {
        $scope.noteId = sessionStorage.getItem("noteId");
        for (var i=0; i < $scope.casenotes.length; i++){
          console.log('at position ', i, 'the scope is', $scope.casenotes[i].id, 'and the noteId is ', $scope.noteId);
          if ($scope.casenotes[i].id == $scope.noteId) {
            console.log('long form', $scope.casenotes[i].note);
            $scope.currentNote = $scope.casenotes[i].note;
            $scope.currentTitle = $scope.casenotes[i].title;
            console.log('marshalled variable', $scope.currentNote);
          }
        }
      };

      $scope.noteInit= function(){

        $http({
          method: 'POST',
          url: '/getClient',
          data: clientSend
        }).then(function(response){
          $scope.client = response.data[0];
      console.log("Client info is...");
          console.log($scope.client);
        });
        $http({
          method: 'POST',
          url: '/caseMet',
          data: caseSend
        }).then(function(response){
          console.log("Now, for case meta information we are receiving...");
          $scope.caseMeta = response.data[0];
          console.log($scope.caseMeta);
        });
        $http({
          method: 'POST',
          url: '/caseDet',
          data: caseSend
        }).then(function(response){
          console.log("Now, for case note content we are receiving...");


          $scope.casenotes = response.data;
          console.log('casenotes is now!', $scope.casenotes);
          // $http({
          //   method: 'GET',
          //   url: '/noteSee',
          // }).then(function(response){
          //   $scope.noteId = response.data;
            // console.log('after request, we declare noteId' , $scope.noteId);
            $scope.findNote();
          });
            // });


      };

      $scope.noteInit();
      // $scope.seeNote(casenotes[2].id);

}]);


CRMLJA.controller('caseCreate', ['$scope', '$http', '$window', function($scope, $http, $window){

  $scope.clientId = sessionStorage.getItem("clientId");
  $scope.caseId = sessionStorage.getItem("caseId");

  var clientSend = {
    id: $scope.clientId
  };
          $http({
            method: 'POST',
            url: '/getClient',
            data: clientSend
          }).then(function(response){
            $scope.client = response.data[0];
            console.log('client info is...', $scope.client);

            $http({
              method: 'GET',
              url: '/hello',
            }).then(function(response){
              $scope.username = response.data;
            });
          });
}]);


CRMLJA.controller('addNote', ['$scope', '$http', '$window', function($scope, $http, $window){
$scope.username = '';

$scope.clientId = sessionStorage.getItem("clientId");
$scope.caseId = sessionStorage.getItem("caseId");

console.log('client id is ', $scope.clientId);
console.log('case id is ', $scope.caseId);


var clientSend = {
  id: $scope.clientId
};

var caseSend = {
  id: $scope.caseId
};


      $scope.initial = function(){
        $http({
          method: 'GET',
          url: '/hello',
        }).then(function(response){
          $scope.username = response.data;
        });

        // $http({
        //   method: 'GET',
        //   url: '/getClient',
        // }).then(function(response){
        //   $scope.client = response.data[0];
        // console.log("Client info is...");
        //   console.log($scope.client);
      //   });
      };

      $scope.initial();



      $http({
        method: 'POST',
        url: '/caseMet',
        data: caseSend
      }).then(function(response){
        console.log("Now, for case meta information we are receiving...");
        $scope.caseMeta = response.data[0];
        console.log($scope.caseMeta);
      });

      $scope.noteSubmit= function(){
        var newNote = {
          noteTitle: $scope.createNoteTitle,
          noteContents: $scope.addedNote,
          noteAuthor: $scope.username,
          case_id: $scope.caseId
        };
        console.log('the note we are about to submit is ', newNote);

        $http({
          method: 'POST',
          url: '/newCaseNote',
          data: newNote
        }).then(function(){
          console.log('we made it to the noteView function');
            $window.location.href = '/caseNoteView';
        });

        console.log('note title is ', $scope.createNoteTitle, 'the author is ', $scope.username, ' and the body is ', $scope.addedNote);

      };
}]);


CRMLJA.controller('insureEdit', ['$scope', '$http', '$window', function($scope, $http, $window){
$scope.thisInsurer = 0;
$scope.specificInsure= '';
$scope.insureId = sessionStorage.getItem("insureId");
var insureId = {
  insureId: $scope.insureId
};



$scope.receiveInsurerInfo = function(){
  console.log('received request at specificInsure');
  $http({
    method: 'POST',
    url: '/specificInsure',
    data: insureId
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
    method: 'POST',
    url: '/removeInsurer',
    data: insureId
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
        method:'POST',
        url: '/removeInsurer',
        data: $scope.specificInsure[0]
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


// ##########################    LOG IN CONTROLLER BELOW


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



CRMLJA.controller('LoginController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
  console.log('log in controller loaded');
    $scope.user = {
      username: '',
      password: ''
    };
    $scope.message = '';

    $scope.login = function() {
      console.log('login function clicked');
      if($scope.user.username ==='' || $scope.user.password === '') {
        console.log("this is username: ");
        console.log($scope.user.username);
        $scope.message = "Enter your username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/', $scope.user).then(function(response) {
          if(response.data.username) {
            console.log('success: ', response.data);
            // location works with SPA (ng-route)
            $window.location.href = '/landing';
          } else {
            console.log('Log in attempt was a failure: ', response);
            $scope.message = "Incorrect User Credentials";
          }
        });
      }
    };

    $scope.registerUser = function() {
      if($scope.user.username === '' || $scope.user.password === '') {
        $scope.message = "Choose a username and password!";
      } else {
        console.log('sending to server...', $scope.user);
        $http.post('/register', $scope.user).then(function(response) {
          console.log('success');
          $location.path('/home');
        },
        function(response) {
          console.log('error');
          $scope.message = "Please try again.";
        });
      }
    };
}]);
// ######


CRMLJA.controller('clientEdit', ['$scope', '$http', '$window', function($scope, $http, $window){
var clientSend = {
  id: sessionStorage.getItem("clientId")
};

$scope.initCaseEdit = function(){
       $http({
          method: 'POST',
          url: '/getClient',
          data: clientSend
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



CRMLJA.controller('clientCreate', ['$scope', '$http', '$window', function($scope, $http, $window) {
  $scope.newNote = {
    noteTitle: $scope.createNoteTitle,
    noteContents: $scope.addedNote,
    noteAuthor: $scope.username
  };



$scope.addClient = function() {

var newPerson = {
    fNameNewClient: $scope.fNameNewClient,
    lName: $scope.lName,
    address: $scope.address,
    address2: $scope.address2,
    city: $scope.city,
    state: $scope.state,
    email: $scope.email,
    phone: $scope.phone
  };


  $http({
    method: 'POST',
    url: '/newClientSave',
    data:  newPerson
  }).then(function(){
    $window.location.href = '/administration';

  });
  console.log(newPerson);
};
}]);



CRMLJA.controller('reAssign', ['$scope', '$http', '$window', function($scope, $http, $window) {


  $scope.clientId = sessionStorage.getItem("clientId");
  $scope.caseId = sessionStorage.getItem("caseId");

  var clientSend = {
    id: $scope.clientId
  };

  var caseSend = {
    id: $scope.caseId
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
            method: 'POST',
            url: '/getClient',
            data: clientSend
          }).then(function(response){
            console.log("client response is...");
            console.log(response);
            $scope.client = response.data[0];
            console.log('client scope is ', $scope.client);
            if ($scope.client == null) {
              console.log('woof!');
              $window.location.href= '/search';
            }
          });

          $http({
            method: 'POST',
            url: '/getCases',
            data: caseSend
          }).then(function(responseCas){
            console.log('cases response is');
            $scope.cases=responseCas.data;
            // console.log($scope.cases);

          });
  };

  $scope.getClients();

}]);

angular.module('CRMLJA').controller('TypeaheadCtrl',  function($scope, $http, $window) {


  $scope.caseCreate = function(){
    var caseCreate = {
      title: $scope.title,
      createdby: $scope.username,
      assigned: $scope.selected,
      claimNo: $scope.claimNo,
      resumen: $scope.resumen,
      id: $scope.clientId
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
      }).then(function(response){
          sessionStorage.setItem("caseId", response.data[0].id);
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


  $scope.usersBare = [];

  $scope.pullUsers = function(){
    $http({
      method: 'GET',
      url: '/getUsers'
    }).then(function(response){
      $scope.users = response.data;
      console.log('list of users: ', $scope.users);
    }).then(function(){

      for (var i = 0; i < $scope.users.length; i++) {
        $scope.usersBare.push($scope.users[i].username);
      }

      console.log($scope.usersBare);
    });
  };

  $scope.pullUsers();

  var _selected;

  $scope.selected = undefined;
  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
  // Any function returning a promise object can be used to load values asynchronously
  $scope.getLocation = function(val) {
    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: val,
        sensor: false
      }
    }).then(function(response){
      return response.data.results.map(function(item){
        return item.formatted_address;
      });
    });
  };

  $scope.ngModelOptionsSelected = function(value) {
    if (arguments.length) {
      _selected = value;
    } else {
      return _selected;
    }
  };

  $scope.modelOptions = {
    debounce: {
      default: 500,
      blur: 250
    },
    getterSetter: true
  };

  $scope.statesWithFlags = [{'name':'Alabama','flag':'5/5c/Flag_of_Alabama.svg/45px-Flag_of_Alabama.svg.png'},{'name':'Alaska','flag':'e/e6/Flag_of_Alaska.svg/43px-Flag_of_Alaska.svg.png'},{'name':'Arizona','flag':'9/9d/Flag_of_Arizona.svg/45px-Flag_of_Arizona.svg.png'},{'name':'Arkansas','flag':'9/9d/Flag_of_Arkansas.svg/45px-Flag_of_Arkansas.svg.png'},{'name':'California','flag':'0/01/Flag_of_California.svg/45px-Flag_of_California.svg.png'},{'name':'Colorado','flag':'4/46/Flag_of_Colorado.svg/45px-Flag_of_Colorado.svg.png'},{'name':'Connecticut','flag':'9/96/Flag_of_Connecticut.svg/39px-Flag_of_Connecticut.svg.png'},{'name':'Delaware','flag':'c/c6/Flag_of_Delaware.svg/45px-Flag_of_Delaware.svg.png'},{'name':'Florida','flag':'f/f7/Flag_of_Florida.svg/45px-Flag_of_Florida.svg.png'},{'name':'Georgia','flag':'5/54/Flag_of_Georgia_%28U.S._state%29.svg/46px-Flag_of_Georgia_%28U.S._state%29.svg.png'},{'name':'Hawaii','flag':'e/ef/Flag_of_Hawaii.svg/46px-Flag_of_Hawaii.svg.png'},{'name':'Idaho','flag':'a/a4/Flag_of_Idaho.svg/38px-Flag_of_Idaho.svg.png'},{'name':'Illinois','flag':'0/01/Flag_of_Illinois.svg/46px-Flag_of_Illinois.svg.png'},{'name':'Indiana','flag':'a/ac/Flag_of_Indiana.svg/45px-Flag_of_Indiana.svg.png'},{'name':'Iowa','flag':'a/aa/Flag_of_Iowa.svg/44px-Flag_of_Iowa.svg.png'},{'name':'Kansas','flag':'d/da/Flag_of_Kansas.svg/46px-Flag_of_Kansas.svg.png'},{'name':'Kentucky','flag':'8/8d/Flag_of_Kentucky.svg/46px-Flag_of_Kentucky.svg.png'},{'name':'Louisiana','flag':'e/e0/Flag_of_Louisiana.svg/46px-Flag_of_Louisiana.svg.png'},{'name':'Maine','flag':'3/35/Flag_of_Maine.svg/45px-Flag_of_Maine.svg.png'},{'name':'Maryland','flag':'a/a0/Flag_of_Maryland.svg/45px-Flag_of_Maryland.svg.png'},{'name':'Massachusetts','flag':'f/f2/Flag_of_Massachusetts.svg/46px-Flag_of_Massachusetts.svg.png'},{'name':'Michigan','flag':'b/b5/Flag_of_Michigan.svg/45px-Flag_of_Michigan.svg.png'},{'name':'Minnesota','flag':'b/b9/Flag_of_Minnesota.svg/46px-Flag_of_Minnesota.svg.png'},{'name':'Mississippi','flag':'4/42/Flag_of_Mississippi.svg/45px-Flag_of_Mississippi.svg.png'},{'name':'Missouri','flag':'5/5a/Flag_of_Missouri.svg/46px-Flag_of_Missouri.svg.png'},{'name':'Montana','flag':'c/cb/Flag_of_Montana.svg/45px-Flag_of_Montana.svg.png'},{'name':'Nebraska','flag':'4/4d/Flag_of_Nebraska.svg/46px-Flag_of_Nebraska.svg.png'},{'name':'Nevada','flag':'f/f1/Flag_of_Nevada.svg/45px-Flag_of_Nevada.svg.png'},{'name':'New Hampshire','flag':'2/28/Flag_of_New_Hampshire.svg/45px-Flag_of_New_Hampshire.svg.png'},{'name':'New Jersey','flag':'9/92/Flag_of_New_Jersey.svg/45px-Flag_of_New_Jersey.svg.png'},{'name':'New Mexico','flag':'c/c3/Flag_of_New_Mexico.svg/45px-Flag_of_New_Mexico.svg.png'},{'name':'New York','flag':'1/1a/Flag_of_New_York.svg/46px-Flag_of_New_York.svg.png'},{'name':'North Carolina','flag':'b/bb/Flag_of_North_Carolina.svg/45px-Flag_of_North_Carolina.svg.png'},{'name':'North Dakota','flag':'e/ee/Flag_of_North_Dakota.svg/38px-Flag_of_North_Dakota.svg.png'},{'name':'Ohio','flag':'4/4c/Flag_of_Ohio.svg/46px-Flag_of_Ohio.svg.png'},{'name':'Oklahoma','flag':'6/6e/Flag_of_Oklahoma.svg/45px-Flag_of_Oklahoma.svg.png'},{'name':'Oregon','flag':'b/b9/Flag_of_Oregon.svg/46px-Flag_of_Oregon.svg.png'},{'name':'Pennsylvania','flag':'f/f7/Flag_of_Pennsylvania.svg/45px-Flag_of_Pennsylvania.svg.png'},{'name':'Rhode Island','flag':'f/f3/Flag_of_Rhode_Island.svg/32px-Flag_of_Rhode_Island.svg.png'},{'name':'South Carolina','flag':'6/69/Flag_of_South_Carolina.svg/45px-Flag_of_South_Carolina.svg.png'},{'name':'South Dakota','flag':'1/1a/Flag_of_South_Dakota.svg/46px-Flag_of_South_Dakota.svg.png'},{'name':'Tennessee','flag':'9/9e/Flag_of_Tennessee.svg/46px-Flag_of_Tennessee.svg.png'},{'name':'Texas','flag':'f/f7/Flag_of_Texas.svg/45px-Flag_of_Texas.svg.png'},{'name':'Utah','flag':'f/f6/Flag_of_Utah.svg/45px-Flag_of_Utah.svg.png'},{'name':'Vermont','flag':'4/49/Flag_of_Vermont.svg/46px-Flag_of_Vermont.svg.png'},{'name':'Virginia','flag':'4/47/Flag_of_Virginia.svg/44px-Flag_of_Virginia.svg.png'},{'name':'Washington','flag':'5/54/Flag_of_Washington.svg/46px-Flag_of_Washington.svg.png'},{'name':'West Virginia','flag':'2/22/Flag_of_West_Virginia.svg/46px-Flag_of_West_Virginia.svg.png'},{'name':'Wisconsin','flag':'2/22/Flag_of_Wisconsin.svg/45px-Flag_of_Wisconsin.svg.png'},{'name':'Wyoming','flag':'b/bc/Flag_of_Wyoming.svg/43px-Flag_of_Wyoming.svg.png'}];
  $scope.caseId = sessionStorage.getItem("caseId");




    $scope.caseReassign = function(){
      var newOwner = {
        username: $scope.selected,
        id: $scope.caseId
      };

      $http({
        method: 'POST',
        url: '/caseReassignData',
        data:  newOwner
      }).then(function(){
        console.log('done');
        $window.location.href = '/case';

      });

  console.log($scope.selected);
};
});
