(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogPrefICustomerCusfieldContactController',DialogPrefICustomerCusfieldContactController);

  /** @ngInject */
  function DialogPrefICustomerCusfieldContactController($scope,$mdDialog)
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
      
     function submit() {
       
      var number = Math.random();
      var obj={};
      obj.id=number;
      obj.labelShown=vm.labelShown;
      obj.inputType=vm.inputType;
      obj.fields=vm.fields;
      obj.type=vm.type;
      $mdDialog.hide(obj);
      
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };


  }
})();