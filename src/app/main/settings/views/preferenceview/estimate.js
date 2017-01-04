(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('estimatePreferenceCtrl',estimatePreferenceCtrl);

	/** @ngInject */
	function estimatePreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
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
        vm.addcusfieldsEstimate=addcusfieldsEstimate;
        vm.editestimatecusFieldsrow=editestimatecusFieldsrow;
        vm.deleteestimatecusfieldsrow=deleteestimatecusfieldsrow;
        
         function save(){
             
            var str3=vm.Settings12thdoor.preference.estimatePref.defaultNote.toString();
            var res3= str3.replace(new RegExp('\n', 'g'), '\\n');
            vm.Settings12thdoor.preference.estimatePref.defaultNote=res3;

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
        
        
        function addcusfieldsEstimate(ev){
               $mdDialog.show({
                controller: 'DialogPrefCusfieldEstimateController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/estimateDialog/addCusfieldsEstimate.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                   vm.Settings12thdoor.preference.estimatePref.cusFiel.push(answer);

               }, function() {
                vm.status = 'You cancelled the dialog.';
            });
            
        };
        
        function editestimatecusFieldsrow(edit,ev){
              $mdDialog.show({
                controller: 'DialogEditPrefICusfieldEstimateController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/estimateDialog/editCusfieldsEstimate.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { edit: edit },
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                for (var i = vm.Settings12thdoor.preference.estimatePref.cusFiel.length - 1; i >= 0; i--){
                    if (vm.Settings12thdoor.preference.estimatePref.cusFiel[i].id == answer.id) { 
                        vm.Settings12thdoor.preference.estimatePref.cusFiel[i]=answer;
                        console.log(vm.Settings12thdoor.preference.estimatePref.cusFiel);
                        break;
                    }

                }

            }, function() {
                vm.status = 'You cancelled the dialog.';
            });
        };
        
        function deleteestimatecusfieldsrow(estimateCusField,index){
            vm.Settings12thdoor.preference.estimatePref.cusFiel.splice(index, 1);
        };
          

    }

})();