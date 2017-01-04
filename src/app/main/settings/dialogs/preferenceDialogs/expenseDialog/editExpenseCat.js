(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogEditPrefExpenseCategoryController',DialogEditPrefExpenseCategoryController);

  /** @ngInject */
  function DialogEditPrefExpenseCategoryController($scope,$mdDialog,edit)
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

      vm.expenseCategory=vm.edit.expenseCategory;

      function submit() {
        var objEdit={};
        objEdit.id=vm.edit.id;
        objEdit.expenseCategory=vm.expenseCategory;
        objEdit.activate=vm.edit.activate;
        $mdDialog.hide(objEdit);
      };

      vm.cancel = function() {
        $mdDialog.cancel();
      };


    }
  })();