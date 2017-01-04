(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('inventoryPreferenceCtrl',inventoryPreferenceCtrl);

	/** @ngInject */
	function inventoryPreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
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
        vm.addreciptcusfieldsInventory=addreciptcusfieldsInventory;
        vm.editreciptcusFieldsinventoryrow=editreciptcusFieldsinventoryrow;
        vm.deletreciptcusfieldsinventory=deletreciptcusfieldsinventory;
        
        vm.addissuescusfieldsInventory=addissuescusfieldsInventory;
        vm.editissuecusFieldsinventoryrow=editissuecusFieldsinventoryrow;
        vm.deletissuecusfieldsinventory=deletissuecusfieldsinventory;
        
        
        function save(){
                //Start replace \n to \\n.............................................................
                var str =vm.Settings12thdoor.preference.inventoryPref.defaultNote.toString();
                var res= str.replace(new RegExp('\n', 'g'), '\\n');
                vm.Settings12thdoor.preference.inventoryPref.defaultNote=res;
                //End replace \n to \\n.............................................................
            
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

            function addreciptcusfieldsInventory(ev){
               $mdDialog.show({
                controller: 'DialogPrefreciptcusfieldsInventoryController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/inventoryDialog/addReciptCusfieldsInventory.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                   vm.Settings12thdoor.preference.inventoryPref.reciptCusFiel.push(answer);
               }, function() {
                vm.status = 'You cancelled the dialog.';
            });

           };

           function editreciptcusFieldsinventoryrow(edit,ev){
            $mdDialog.show({
                controller: 'DialogEditPrefreciptcusfieldsInventoryController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/inventoryDialog/editReciptCusfieldsInventory.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { edit: edit },
                clickOutsideToClose:true,
            })
            .then(function(answer) {
                for (var i =  vm.Settings12thdoor.preference.inventoryPref.reciptCusFiel.length - 1; i >= 0; i--){
                    if ( vm.Settings12thdoor.preference.inventoryPref.reciptCusFiel[i].id == answer.id) { 
                     vm.Settings12thdoor.preference.inventoryPref.reciptCusFiel[i]=answer;
                     console.log(vm.Settings12thdoor.preference.inventoryPref.reciptCusFiel);
                     break;
                 }

             }

         }, function() {
            vm.status = 'You cancelled the dialog.';
        });
        }

        function deletreciptcusfieldsinventory(recipCusFiel, index){  
         vm.Settings12thdoor.preference.inventoryPref.reciptCusFiel.splice(index, 1);
     }

function addissuescusfieldsInventory(ev){
   $mdDialog.show({
    controller: 'DialogPrefIssueCusFielController',
    controllerAs: 'vm',
    templateUrl: 'app/main/settings/dialogs/preferenceDialogs/inventoryDialog/addIssueCusFiel.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true,
})
   .then(function(answer) {
       vm.Settings12thdoor.preference.inventoryPref.issueCusFiel.push(answer);
   }, function() {
    vm.status = 'You cancelled the dialog.';
});

};

function editissuecusFieldsinventoryrow(edit,ev){
    $mdDialog.show({
        controller: 'DialogEditPrefIssueCusFielController',
        controllerAs: 'vm',
        templateUrl: 'app/main/settings/dialogs/preferenceDialogs/inventoryDialog/editIssueCusFiel.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: { edit: edit },
        clickOutsideToClose:true,
    })
    .then(function(answer) {
        for (var i =  vm.Settings12thdoor.preference.inventoryPref.issueCusFiel.length - 1; i >= 0; i--){
            if ( vm.Settings12thdoor.preference.inventoryPref.issueCusFiel[i].id == answer.id) { 
             vm.Settings12thdoor.preference.inventoryPref.issueCusFiel[i]=answer;
             console.log(vm.Settings12thdoor.preference.inventoryPref.issueCusFiel);
             break;
         }

     }

 }, function() {
    vm.status = 'You cancelled the dialog.';
});

}

function deletissuecusfieldsinventory(units, index){  
 vm.Settings12thdoor.preference.inventoryPref.issueCusFiel.splice(index, 1);
}


}

})();