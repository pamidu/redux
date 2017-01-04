(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogEditPrefProductCatController',DialogEditPrefProductCatController);

  /** @ngInject */
  function DialogEditPrefProductCatController($scope,$mdDialog,edit)
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
      vm.productCategory=vm.edit.productCategory;

      function submit() {
       var obj={};
       obj.id=vm.edit.id;
       obj.productCategory=vm.productCategory;
       obj.activate=vm.edit.activate;
       $mdDialog.hide(obj);
     };

     vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
})();