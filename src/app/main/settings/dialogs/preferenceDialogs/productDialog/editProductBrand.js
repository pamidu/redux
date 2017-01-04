(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogEditPrefproductBrandController',DialogEditPrefproductBrandController);

  /** @ngInject */
  function DialogEditPrefproductBrandController($scope,$mdDialog,edit)
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
      vm.productBrand=vm.edit.productBrand;

      function submit() {
       var number = Math.random();
       var obj={};
       obj.id=vm.edit.id;
       obj.productBrand=vm.productBrand;
       obj.activate=vm.edit.activate;
       $mdDialog.hide(obj);
     };

     vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
})();