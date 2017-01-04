(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogEditPrefreciptcusfieldsInventoryController',DialogEditPrefreciptcusfieldsInventoryController);

  /** @ngInject */
  function DialogEditPrefreciptcusfieldsInventoryController($scope,$mdDialog,edit)
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
    	// dont change above code !
      vm.edit=edit;

      vm.button="Edit";
      vm.type=vm.edit.type;
      console.log(vm.type);
      vm.labelShown=vm.edit.labelShown;
      vm.inputType=vm.edit.inputType;
      vm.fields=vm.edit.fields;



      function submit() {

        var objEdit={};
        if(vm.type=='textBox'){
          objEdit.id=vm.edit.id;
          objEdit.labelShown=vm.labelShown;
          objEdit.inputType=vm.inputType;
          objEdit.fields=[];
          objEdit.type=vm.type;
          console.log(objEdit);
          $mdDialog.hide(objEdit);
        }
        else{
          objEdit.id=vm.edit.id;
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