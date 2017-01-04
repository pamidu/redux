(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogPrefProductCatController',DialogPrefProductCatController);

  /** @ngInject */
  function DialogPrefProductCatController($scope,$mdDialog)
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
       obj.productCategory=vm.productCategory;
       obj.activate=true;
       $mdDialog.hide(obj);
     };

     vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
})();