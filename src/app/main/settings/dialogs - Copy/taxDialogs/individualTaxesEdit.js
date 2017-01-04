(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogindividualtaxEditController',DialogindividualtaxEditController);

  /** @ngInject */
  function DialogindividualtaxEditController($rootScope,$mdDialog,individualtax)
  {
      // use the below code on all child view controllers
      var vm = this;

      vm.toggleSidenav = toggleSidenav;

      function toggleSidenav(sidenavId)
      {
        $mdSidenav(sidenavId).toggle();
      }
      // dont change above code !

      vm.submit=submit;
      vm.individualtax=individualtax;
      console.log(vm.individualtax.compound);
      vm.taxName=vm.individualtax.taxName;
      vm.rate=vm.individualtax.rate;
      vm.compound=vm.individualtax.compound;

      function submit(){
        var edit={};
        edit.taxID=vm.individualtax.taxID;
        edit.taxName=vm.taxName;
        edit.rate=vm.rate;
        edit.activate=true;
        edit.compound=vm.compound;
        edit.type="individualtaxes";
        edit.positionID=vm.individualtax.positionID;
        edit.labelIndividualTaxStatus="Inactivate";
        $mdDialog.hide(edit);
      };

      vm.cancel = function() {
        $mdDialog.cancel();
      };


    }
  })();