(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('creditNotePreferenceCtrl',creditNotePreferenceCtrl);

	/** @ngInject */
	function creditNotePreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
	{
		// use the below code on all child view controllers
		var vm = this;

		vm.toggleSidenav = toggleSidenav;

		function toggleSidenav(sidenavId)
		{
			$mdSidenav(sidenavId).toggle();
		}
    	// dont change above code !

    	function loadSetting(){
            var client =  $serviceCall.setClient("getAll","setting"); // method name and service
            client.ifSuccess(function(data){ 
            	console.log(data[0]);
            	vm.Settings12thdoor=data[0];
            });
            client.ifError(function(data){ 
            	var toast = $mdToast.simple().content('There was an error, when data loading').action('OK').highlightAction(false).position("bottom right");
            	$mdToast.show(toast).then(function() {});
            })

            client.skip(0); 
            client.take(1); 
            client.orderby();
            client.getReq();
        }
        loadSetting();
        
        vm.save=save;
        function save(){
            var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
            client.ifSuccess(function(data){  //sucess  
            var toast = $mdToast.simple().content('Successfully saved').action('OK').highlightAction(false).position("bottom right");
            $mdToast.show(toast).then(function() {});
            });
            client.ifError(function(data){ //false
            var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
            $mdToast.show(toast).then(function() {});
            });
            client.tab('preference');
            client.postReq(vm.Settings12thdoor.preference);
        };

        

    }

})();