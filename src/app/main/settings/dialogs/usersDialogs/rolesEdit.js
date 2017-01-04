(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogrolesEditController',DialogrolesEditController);

  /** @ngInject */
  function DialogrolesEditController($mdDialog,roleEdit,$apis)
  {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

      function toggleSidenav(sidenavId)
      {
        $mdSidenav(sidenavId).toggle();
      }
    	// dont change above code !
      vm.rolesEdit=roleEdit;
      console.log(vm.rolesEdit);
      vm.submit=submit;

      vm.settingDisabled=false;
      if(vm.rolesEdit.roleName=="Super admin"){
        vm.settingDisabled=true;
      }

      function submit(obj) {
        obj.editable=true;
        console.log(obj);

        var apis = $apis.getApis();
        apis.ifSuccess(function(data){
          console.log(data);
          var toast = $mdToast.simple().content( obj.roleNamez+' role successfully updated').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function() {});
        });
        apis.ifError(function(data){
          console.log(data);
          var toast = $mdToast.simple().content('There was an error, when role updated').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function() {});
        });
        apis.apisPermission('update',obj);

        $mdDialog.hide(obj);

          // var adminEmail = $rootScope.Settings12thdoor.profile.adminEmail;
          // console.log(adminEmail);
          // var allRole = obj;
          // console.log(allRole);

        };

        vm.cancel = function() {
          $mdDialog.cancel();
        };


      }
    })();