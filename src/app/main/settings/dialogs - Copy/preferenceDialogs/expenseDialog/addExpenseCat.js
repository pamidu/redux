(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogPrefAddExpenseCategoryController',DialogPrefAddExpenseCategoryController);

  /** @ngInject */
  function DialogPrefAddExpenseCategoryController($scope,$mdDialog)
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

     function submit() {
       var number = Math.random();
       var obj={};
       obj.id=number;
       obj.expenseCategory=vm.expenseCategory,
       obj.activate=true
       $mdDialog.hide(obj);
     };

     vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
})();