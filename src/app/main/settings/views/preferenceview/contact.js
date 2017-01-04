(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('contactPreferenceCtrl',contactPreferenceCtrl);

	/** @ngInject */
	function contactPreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
	{
		// use the below code on all child view controllers
		var vm = this;

		vm.toggleSidenav = toggleSidenav;

		function toggleSidenav(sidenavId)
		{
			$mdSidenav(sidenavId).toggle();
		}
    	// dont change above code !

        vm.addcustomercusfieldsContact=addcustomercusfieldsContact;
        vm.editcustomercusfieldsContact=editcustomercusfieldsContact;
        vm.deletcustomercusfieldscontact=deletcustomercusfieldscontact;
        vm.addsuppliercusfieldsContact=addsuppliercusfieldsContact;
        vm.editsuppliercusfieldsContact=editsuppliercusfieldsContact;
        vm.deletsuppliercusfieldscontact=deletsuppliercusfieldscontact;


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
                })
                client.tab('preference');
                client.postReq(vm.Settings12thdoor.preference);
            }

            function addcustomercusfieldsContact(ev){
               $mdDialog.show({
                controller: 'DialogPrefICustomerCusfieldContactController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/contactDialog/addCustomdetailsforCustomerContact.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                   vm.Settings12thdoor.preference.contactPref.customerCusFiel.push(answer);

               }, function() {
                vm.status = 'You cancelled the dialog.';
            });

           };

           function editcustomercusfieldsContact(edit,ev){
               $mdDialog.show({
                controller: 'DialogEditPrefICustomerCusfieldContactController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/contactDialog/editCustomdetailsforCustomerContact.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { edit: edit },
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                for (var i = vm.Settings12thdoor.preference.contactPref.customerCusFiel.length - 1; i >= 0; i--){
                    if (vm.Settings12thdoor.preference.contactPref.customerCusFiel[i].id == answer.id) { 
                        vm.Settings12thdoor.preference.contactPref.customerCusFiel[i]=answer;
                        console.log(vm.Settings12thdoor.preference.contactPref.customerCusFiel);
                        break;
                    }

                }

            }, function() {
                vm.status = 'You cancelled the dialog.';
            });

           };

           function deletcustomercusfieldscontact(customercusFieldscontact, index){  
            vm.Settings12thdoor.preference.contactPref.customerCusFiel.splice(index, 1);
        }

        function addsuppliercusfieldsContact(ev){
           $mdDialog.show({
            controller: 'DialogPrefISupplierCusfieldContactController',
            controllerAs: 'vm',
            templateUrl: 'app/main/settings/dialogs/preferenceDialogs/contactDialog/addsuppliercusfieldsContact.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
        })
           .then(function(answer) {
               vm.Settings12thdoor.preference.contactPref.supplierCusFiel.push(answer);

           }, function() {
            vm.status = 'You cancelled the dialog.';
        });

       };

       function editsuppliercusfieldsContact(edit,ev){
           $mdDialog.show({
            controller: 'DialogEditPrefISupplierCusfieldContactController',
            controllerAs: 'vm',
            templateUrl: 'app/main/settings/dialogs/preferenceDialogs/contactDialog/editsuppliercusfieldsContact.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: { edit: edit },
            clickOutsideToClose:true,
        })
           .then(function(answer) {
            for (var i = vm.Settings12thdoor.preference.contactPref.supplierCusFiel.length - 1; i >= 0; i--){
                if (vm.Settings12thdoor.preference.contactPref.supplierCusFiel[i].id == answer.id) { 
                    vm.Settings12thdoor.preference.contactPref.supplierCusFiel[i]=answer;
                    console.log(vm.Settings12thdoor.preference.contactPref.supplierCusFiel);
                    break;
                }

            }

        }, function() {
            vm.status = 'You cancelled the dialog.';
        });

       };

       function deletsuppliercusfieldscontact(supplierField,index){
        vm.Settings12thdoor.preference.contactPref.supplierCusFiel.splice(index, 1);

    }









}

})();