(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('paymentPreferenceCtrl',paymentPreferenceCtrl);

	/** @ngInject */
	function paymentPreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
	{
		// use the below code on all child view controllers
		var vm = this;

		vm.toggleSidenav = toggleSidenav;

		function toggleSidenav(sidenavId)
		{
			$mdSidenav(sidenavId).toggle();
		}
    	// dont change above code !

        vm.addcusfieldsPayment=addcusfieldsPayment;
        vm.editcusfieldsPayment=editcusfieldsPayment;
        vm.deletepaymentcusfieldsrow=deletepaymentcusfieldsrow;

        vm.inactivatepaymentsmethod="Inactivate";
        vm.addPaymentmethod=addPaymentmethod;
        vm.editpaymentmethodrow=editpaymentmethodrow;
        vm.deletepaymentmethodrow=deletepaymentmethodrow;
        vm.inactivatepaymentmethod=inactivatepaymentmethod;

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


            function addcusfieldsPayment(ev){
               $mdDialog.show({
                controller: 'DialogPrefCusfieldPaymentController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/paymentDialog/addCusfieldsPayment.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                   vm.Settings12thdoor.preference.paymentPref.cusFiel.push(answer);

               }, function() {
                vm.status = 'You cancelled the dialog.';
            });

           };

           function editcusfieldsPayment(edit,ev){
               $mdDialog.show({
                controller: 'DialogEditPrefCusfieldPaymentController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/paymentDialog/editCusfieldsPayment.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { edit: edit },
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                for (var i =  vm.Settings12thdoor.preference.paymentPref.cusFiel.length - 1; i >= 0; i--){
                    if ( vm.Settings12thdoor.preference.paymentPref.cusFiel[i].id == answer.id) { 
                     vm.Settings12thdoor.preference.paymentPref.cusFiel[i]=answer;
                     console.log( vm.Settings12thdoor.preference.paymentPref.cusFiel);
                     break;
                 }

             }

         }, function() {
            vm.status = 'You cancelled the dialog.';
        });

           };

           function deletepaymentcusfieldsrow(cusFieldPayemnt, index){  
             vm.Settings12thdoor.preference.paymentPref.cusFiel.splice(index, 1);
         }



         function addPaymentmethod(ev){
           $mdDialog.show({
            controller: 'DialogPrefPaymentMethodController',
            controllerAs: 'vm',
            templateUrl: 'app/main/settings/dialogs/preferenceDialogs/paymentDialog/addPaymentMethod.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
        })
           .then(function(answer) {
               vm.Settings12thdoor.preference.paymentPref.paymentMethods.push(answer);
           }, function() {
            vm.status = 'You cancelled the dialog.';
        });

       };

       function editpaymentmethodrow(edit,ev){
        $mdDialog.show({
            controller: 'DialogEditPrefPaymentMethodController',
            controllerAs: 'vm',
            templateUrl: 'app/main/settings/dialogs/preferenceDialogs/paymentDialog/editPaymentMethod.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: { edit: edit },
            clickOutsideToClose:true,
        })
        .then(function(answer) {
            for (var i =  vm.Settings12thdoor.preference.paymentPref.paymentMethods.length - 1; i >= 0; i--){
                if ( vm.Settings12thdoor.preference.paymentPref.paymentMethods[i].id == answer.id) { 
                 vm.Settings12thdoor.preference.paymentPref.paymentMethods[i]=answer;
                 console.log(vm.Settings12thdoor.preference.paymentPref.paymentMethods);
                 break;
             }

         }

     }, function() {
        vm.status = 'You cancelled the dialog.';
    });

    }

    function deletepaymentmethodrow(payemntMethod, index){  
     vm.Settings12thdoor.preference.paymentPref.paymentMethods.splice(index, 1);
 }

 function inactivatepaymentmethod(data,index){
     for (var i = vm.Settings12thdoor.preference.paymentPref.paymentMethods.length - 1; i >= 0; i--) {
      if(vm.Settings12thdoor.preference.paymentPref.paymentMethods[i].id==data.id){
          if(data.activate){
            data.activate = false;
            vm.inactivatepaymentsmethod="Activate";
            vm.Settings12thdoor.preference.paymentPref.paymentMethods[i].activate=false;
        }else{
            data.activate = true;
            vm.inactivatepaymentsmethod="Inactivate";
            vm.Settings12thdoor.preference.paymentPref.paymentMethods[i].activate=true;
        }
    }
}



}



}

})();