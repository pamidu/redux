(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('usersViewController',usersViewController);

  /** @ngInject */
  function usersViewController($scope, $rootScope, $document, $mdDialog, $mdMedia,$mdToast, $serviceCall, $mdSidenav, $state, msApi, $auth, $apis, $window)
  {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

    	function toggleSidenav(sidenavId)
    	{
    		$mdSidenav(sidenavId).toggle();
    	}
    	// dont change above code !

      vm.acceptUser=acceptUser;
      vm.inviteUsers=inviteUsers;
      vm.inviteUsersEdit=inviteUsersEdit;
      vm.deleteUserRow=deleteUserRow;
      vm.roles=roles;
      vm.rolesEdit=rolesEdit;
      vm.deleteRole=deleteRole;
      vm.saveUser=saveUser;
      
      vm.pendingInvi=[];
      function loadSetting(){
        var client =  $serviceCall.setClient("getAll","setting"); 
        client.ifSuccess(function(data){ 
          console.log(data[0]);
          vm.Settings12thdoor=data[0];
          console.log(vm.Settings12thdoor.users.user);
          $rootScope.roles=vm.Settings12thdoor.users.roles;
          console.log($rootScope.roles);
            vm.pendingInviterUserEmail=[];
            
          //check pending invited user............................................
          var apis = $apis.getApis();
          apis.ifSuccess(function(data){
            console.log(data);
              vm.pendingInvi=data.AddUserRequests;
              
              for (var i = data.AddUserRequests.length - 1; i >= 0; i--){           
                for(var j = vm.Settings12thdoor.users.user.length - 1; j >= 0; j--){
                    if(data.AddUserRequests[i].Email==vm.Settings12thdoor.users.user[j].inviteUserEmail){
                        console.log(vm.Settings12thdoor.users.user[j]);
                        vm.Settings12thdoor.users.user.splice(j,1);
                        console.log(vm.Settings12thdoor.users.user);
                    }
                }
                
            }
              
          });
          apis.ifError(function(data){
            console.log(data);
            var toast = $mdToast.simple().content('There was an error').action('OK').highlightAction(false).position("bottom right");
            $mdToast.show(toast).then(function() {});
          })
          apis.authReq('GetAllPendingTenantRequests');
        //..............................................
            
        });
        client.ifError(function(data){ 
         var toast = $mdToast.simple().content('There was an error, when data loading').action('OK').highlightAction(false).position("bottom right");
         $mdToast.show(toast).then(function() {});
       })

        client.skip(0); 
        client.take(1); 
        client.orderby();
        client.getReq();
      };
      loadSetting();

      function saveUser(){
                    var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
                client.ifSuccess(function(data){  //sucess  
                  var toast = $mdToast.simple().content('Successfully saved users and roles').action('OK').highlightAction(false).position("bottom right");
                  $mdToast.show(toast).then(function() {});
                });
                client.ifError(function(data){ //false
                  var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
                  $mdToast.show(toast).then(function() {});
                })
                client.tab('users');
                client.postReq(vm.Settings12thdoor.users);

              };

//invite user
function inviteUsers(ev) {
  $mdDialog.show({
    controller: 'DialogusersController',
    controllerAs: 'vm',
    templateUrl: 'app/main/settings/dialogs/usersDialogs/inviteUser.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true
  })
  .then(function(answer) {

    vm.Settings12thdoor.users.user.push(answer);
    vm.saveUser();
      loadSetting();
  }, function() {
    $scope.status = 'You cancelled the dialog.';
  });
};

//edit Invite user
function inviteUsersEdit(edituserDetails,ev) {
  $mdDialog.show({
    controller: 'DialogusersEditController',
    controllerAs: 'vm',
    templateUrl: 'app/main/settings/dialogs/usersDialogs/inviteUserEdit.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    locals: { edituserDetails: edituserDetails },
    clickOutsideToClose:true
  })
  .then(function(answer) {
    console.log(answer.inviteUserEmail);
    for (var i = vm.Settings12thdoor.users.user.length - 1; i >= 0; i--) {
      if(vm.Settings12thdoor.users.user[i].inviteUserEmail==answer.inviteUserEmail){
        console.log(vm.Settings12thdoor.users.user[i]);
        vm.Settings12thdoor.users.user[i]=answer;
        vm.saveUser();
      }
      
    }
    
  }, function() {
    $scope.status = 'You cancelled the dialog.';
  });
};

function deleteUserRow(loadInviteUser , index ){
  console.log(loadInviteUser);

  var apis = $apis.getApis();
  apis.ifSuccess(function(data){
    console.log(data);

    vm.ownerEmail=data.Email;

    if(loadInviteUser.inviteUserEmail == vm.ownerEmail){
      $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.body))
        .content('Cannot Delete This User')
        .ariaLabel('Alert Dialog Demo')
        .ok('OK')
        );
    }
    else{
     var confirm = $mdDialog.confirm()
     .title('Do you wish to delete ' +loadInviteUser.firstName+ ' ?')
     .content('')
     .ariaLabel('')
     .targetEvent()
     .ok('Ok')
     .cancel('Cancel');

     $mdDialog.show(confirm).then(function() {
      var apis = $apis.getApis();
      apis.ifSuccess(function(data){
        console.log(data);
        var toast = $mdToast.simple().content( loadInviteUser.firstName+' user successfully deleted').action('OK').highlightAction(false).position("bottom right");
        $mdToast.show(toast).then(function() {});
      });
      apis.ifError(function(data){
        console.log(data);
        var toast = $mdToast.simple().content('There was an error, when user deleted').action('OK').highlightAction(false).position("bottom right");
        $mdToast.show(toast).then(function() {});
      })
      apis.authReq('RemoveUser',loadInviteUser.inviteUserEmail);

    //    for (var j = vm.Settings12thdoor.users.user.length - 1; j >= 0; j--) {
    //   if(vm.Settings12thdoor.users.user[j].inviteUserEmail==loadInviteUser.inviteUserEmail){
    //     console.log(vm.Settings12thdoor.user.user[j]);
    //     vm.Settings12thdoor.users.roles.splice(j, 1);
    //   }
    // }
    vm.Settings12thdoor.users.user[index].activate=false;
    vm.Settings12thdoor.users.user.splice(index, 1);
    vm.saveUser();

  });
   }
   

 });

  apis.ifError(function(data){
    console.log(data);
    var toast = $mdToast.simple().content('There was an error, when load admin details').action('OK').highlightAction(false).position("bottom right");
    $mdToast.show(toast).then(function() {});
  });
  console.log(window.location.hostname);
  apis.getSession('GetSession',window.location.hostname);

}

//add roles
function roles(ev) {
  $mdDialog.show({
    controller: 'DialogrolesController',
    controllerAs: 'vm',
    templateUrl: 'app/main/settings/dialogs/usersDialogs/roles.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true
  })
  .then(function(answer) {

    vm.Settings12thdoor.users.roles.push(answer);
    vm.saveUser();
  }, function() {
    $scope.status = 'You cancelled the dialog.';
  });
};

//add roles
function rolesEdit(roleEdit,ev) {
  $mdDialog.show({
    controller: 'DialogrolesEditController',
    controllerAs: 'vm',
    templateUrl: 'app/main/settings/dialogs/usersDialogs/rolesEdit.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    locals: { roleEdit: roleEdit },
    clickOutsideToClose:true
  })
  .then(function(answer) {
    for (var i = vm.Settings12thdoor.users.roles.length - 1; i >= 0; i--) {
     if (vm.Settings12thdoor.users.roles[i].id == answer.id) { 
      vm.Settings12thdoor.users.roles[i]=answer;
      break;
    }
  }
  vm.saveUser();
}, function() {
  $scope.status = 'You cancelled the dialog.';
});
};

function deleteRole(role,index){
  for (var i = vm.Settings12thdoor.users.user.length - 1; i >= 0; i--) {
    console.log(vm.Settings12thdoor.users.user[i].role[0].roleName);
    if(vm.Settings12thdoor.users.user[i].role[0].id==role.id){
      $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('You Cannot delete this role. If you want to remove this role ,you have to delete user bound with perticular role').ariaLabel('').ok('OK').targetEvent());
      break;
    }
    else{
     for (var j = vm.Settings12thdoor.users.roles.length - 1; j >= 0; j--) {
      if(vm.Settings12thdoor.users.roles[j].id==role.id){
        console.log(vm.Settings12thdoor.users.roles[j]);
        vm.Settings12thdoor.users.roles.splice(j, 1);
      }
    }
  } 
}
vm.saveUser();
}

//GetPendingTenantRequest....................................................................
function GetPendingTenantRequests(){

  var apis = $apis.getApis();
  apis.ifSuccess(function(data){
    console.log(data);
    vm.getPendingUser=data;
  });
  apis.ifError(function(data){
  //console.log('Pending Request Cannot Display');
  var toast = $mdToast.simple().content('Pending Request Cannot Display').action('OK').highlightAction(false).position("bottom right");
  $mdToast.show(toast).then(function() {});
})
      //   $http.get("http://" + window.location.hostname + "/auth/tenant/GetPendingTenantRequest")
      //   .success(function(data){
      //     vm.getPendingUser=data;
      //     console.log($scope.getPendingUser);
      // }).error(function(){
      //     console.log(data);
      // });

      apis.authReq('GetPendingTenantRequest','');
    }

    GetPendingTenantRequests();

    function acceptUser(getPendingUserDetails,ev) { 
      $mdDialog.show({
        controller: 'DialogPendingUserController',
        controllerAs: 'vm',
        templateUrl: 'app/main/settings/dialogs/usersDialogs/setPendingUser.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: { getPendingUserDetails: getPendingUserDetails },
        clickOutsideToClose:true
      })
      .then(function(answer) {
        vm.Settings12thdoor.users.user.push(answer);
        vm.saveUser();
        for (var j = vm.getPendingUser.length - 1; j >= 0; j--){
            if(vm.getPendingUser[j].Email==answer.inviteUserEmail){
                console.log(vm.getPendingUser[j].Email);
                 vm.getPendingUser.splice(j,1);
            }
        }
      }, function() {
        $scope.status = 'You cancelled the dialog.';
      });

    };
  }
})();