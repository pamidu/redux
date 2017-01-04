(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogEditPrefPaymentMethodController',DialogEditPrefPaymentMethodController);

  /** @ngInject */
  function DialogEditPrefPaymentMethodController($scope,$mdDialog,edit)
  {
      // use the below code on all child view controllers
      var vm = this;

      vm.toggleSidenav = toggleSidenav;

      vm.submit=submit;

      function toggleSidenav(sidenavId)
      {
        $mdSidenav(sidenavId).toggle();
      }
      // dont change above code 
      vm.edit=edit;

      vm.paymentMethod=vm.edit.paymentMethod;

      function submit() {
        var objEdit={};
        objEdit.id=vm.edit.id;
        objEdit.paymentMethod=vm.paymentMethod;
        objEdit.activate=vm.edit.activate;
        objEdit.paymentType="Offline";
        $mdDialog.hide(objEdit);
      };

      vm.cancel = function() {
        $mdDialog.cancel();
      };


    }
  })();