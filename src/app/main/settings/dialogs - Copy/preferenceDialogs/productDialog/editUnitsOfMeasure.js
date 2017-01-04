(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogEditPrefaddUnitController',DialogEditPrefaddUnitController);

  /** @ngInject */
  function DialogEditPrefaddUnitController($scope,$mdDialog,edit)
  {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

      vm.submit=submit;

      function toggleSidenav(sidenavId)
      {
        $mdSidenav(sidenavId).toggle();
      }
    	// dont change above code !

      vm.edit=edit;
      vm.unitsOfMeasurement=vm.edit.unitsOfMeasurement;
      console.log(vm.edit.id);


      function submit() {

        var objEdit={};
        objEdit.id=vm.edit.id;
        objEdit.unitsOfMeasurement=vm.unitsOfMeasurement;
        objEdit.activate=vm.edit.activate;
        $mdDialog.hide(objEdit);
      };

      vm.cancel = function() {
        $mdDialog.cancel();
      };


    }
  })();