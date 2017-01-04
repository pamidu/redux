(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('accountsViewController',accountsViewController);

  /** @ngInject */
  function accountsViewController($scope, $rootScope, $document, $mdDialog, $mdMedia, $serviceCall, $mdSidenav, $state, msApi, $auth, $apis)
  {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

    	function toggleSidenav(sidenavId)
    	{
    		$mdSidenav(sidenavId).toggle();
    	}
    	// dont change above code !


    }
  })();