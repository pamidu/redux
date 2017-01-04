(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogEditprofileController',DialogEditprofileController);

  /** @ngInject */
  function DialogEditprofileController($scope,$mdDialog,cusFieldsProfileedit)
  {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

      vm.submit=submit;

      vm.fields=[];

      vm.inputType="";

      function toggleSidenav(sidenavId)
      {
        $mdSidenav(sidenavId).toggle();
      }
    	// dont change above code 
      vm.cusFieldsProfileedit=cusFieldsProfileedit;

      vm.type=vm.cusFieldsProfileedit.type;
      console.log(vm.type);
      vm.labelShown=vm.cusFieldsProfileedit.labelShown;
      vm.inputType=vm.cusFieldsProfileedit.inputType;
      vm.fields=vm.cusFieldsProfileedit.fields;

      function submit() {

        var objEdit={};
        if(vm.type=='textBox'){
          objEdit.id=vm.cusFieldsProfileedit.id;
          objEdit.labelShown=vm.labelShown;
          objEdit.inputType=vm.inputType;
          objEdit.fields=[];
          objEdit.type=vm.type;
          console.log(objEdit);
          $mdDialog.hide(objEdit);
        }
        else{
          objEdit.id=vm.cusFieldsProfileedit.id;
          objEdit.labelShown=vm.labelShown;
          objEdit.inputType="";
          objEdit.fields=vm.fields;
          objEdit.type=vm.type;
          console.log(objEdit);
          $mdDialog.hide(objEdit);
        }

      };

      vm.cancel = function() {
        $mdDialog.cancel();
      };


    }
  })();