(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('expensePreferenceCtrl',expensePreferenceCtrl);

	/** @ngInject */
	function expensePreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
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
        vm.addexpensecategory=addexpensecategory;
        vm.editexpensecategoryrow=editexpensecategoryrow;
        vm.deleteexpensecategory=deleteexpensecategory;
        vm.inaactivateexpenseee=inaactivateexpenseee;
        vm.inactivateexpenseCat="Inactivate";
        
        vm.addcusfieldsExpense=addcusfieldsExpense;
        vm.editcusFieldsexpenserow=editcusFieldsexpenserow;
        vm.deletcusfieldsexpense=deletcusfieldsexpense;
        
         function save(){
               var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
                client.ifSuccess(function(data){  //sucess  
                    var toast = $mdToast.simple().content('Successfully saved').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                });
                client.ifError(function(data){ //false
                    var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                })
                client.tab('preference');
                client.postReq(vm.Settings12thdoor.preference);
            };
        
        function addexpensecategory(ev){
             $mdDialog.show({
                controller: 'DialogPrefAddExpenseCategoryController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/expenseDialog/addExpenseCat.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                   vm.Settings12thdoor.preference.expensePref.expenseCategories.push(answer);

               }, function() {
                vm.status = 'You cancelled the dialog.';
            });
        };
        
        function editexpensecategoryrow(edit,ev){
            
             $mdDialog.show({
                controller: 'DialogEditPrefExpenseCategoryController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/expenseDialog/editExpenseCat.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { edit: edit },
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                for (var i =  vm.Settings12thdoor.preference.expensePref.expenseCategories.length - 1; i >= 0; i--){
                    if ( vm.Settings12thdoor.preference.expensePref.expenseCategories[i].id == answer.id) { 
                     vm.Settings12thdoor.preference.expensePref.expenseCategories[i]=answer;
                     console.log(vm.Settings12thdoor.preference.expensePref.expenseCategories);
                     break;
                 }

             }

         }, function() {
            vm.status = 'You cancelled the dialog.';
        });
            
        };
        
        function deleteexpensecategory(expenseCat,index){
             vm.Settings12thdoor.preference.expensePref.expenseCategories.splice(index, 1);
        };
        
        function inaactivateexpenseee(data){
            
            for (var i = vm.Settings12thdoor.preference.expensePref.expenseCategories.length - 1; i >= 0; i--) {
              if(vm.Settings12thdoor.preference.expensePref.expenseCategories[i].id==data.id){
                  if(data.activate){
                    data.activate = false;
                    vm.inactivateexpenseCat="Activate";
                    vm.Settings12thdoor.preference.expensePref.expenseCategories[i].activate=false;
                }else{
                    data.activate = true;
                    vm.inactivateexpenseCat="Inactivate";
                    vm.Settings12thdoor.preference.expensePref.expenseCategories[i].activate=true;
                }
              }
            }
            
        };
        
        function addcusfieldsExpense(ev){
                   $mdDialog.show({
                controller: 'DialogPrefCusfieldExpenseController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/expenseDialog/addCusfieldsExpense.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                   vm.Settings12thdoor.preference.expensePref.cusFiel.push(answer);

               }, function() {
                vm.status = 'You cancelled the dialog.';
            });
        };
        
        function editcusFieldsexpenserow(edit,ev){
            $mdDialog.show({
                controller: 'DialogEditPrefCusfieldExpenseController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/expenseDialog/editCusfieldsExpense.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { edit: edit },
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                for (var i =  vm.Settings12thdoor.preference.expensePref.cusFiel.length - 1; i >= 0; i--){
                    if ( vm.Settings12thdoor.preference.expensePref.cusFiel[i].id == answer.id) { 
                     vm.Settings12thdoor.preference.expensePref.cusFiel[i]=answer;
                     console.log(vm.Settings12thdoor.preference.expensePref.cusFiel);
                     break;
                 }

             }

         }, function() {
            vm.status = 'You cancelled the dialog.';
        });
               
        };
        
        function deletcusfieldsexpense(item,index){
            vm.Settings12thdoor.preference.expensePref.cusFiel.splice(index, 1);
        };
        
        
        

        

    }

})();