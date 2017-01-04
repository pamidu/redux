(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('productPreferenceCtrl',productPreferenceCtrl);

	/** @ngInject */
	function productPreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
	{
		// use the below code on all child view controllers
		var vm = this;

		vm.toggleSidenav = toggleSidenav;

		function toggleSidenav(sidenavId)
		{
			$mdSidenav(sidenavId).toggle();
		}
    	// dont change above code !

        vm.addUnits=addUnits;
        vm.editunitsrow=editunitsrow;
        vm.deleteUnits=deleteUnits;
        vm.inactivateUnitsOfMeasure=inactivateUnitsOfMeasure;
        vm.inactivateUnitsOfMeasurelabel="Inactivate";

        vm.inactivateproductbrand=inactivateproductbrand;
        vm.addProductbrand=addProductbrand;
        vm.deleteproductBrand=deleteproductBrand;
        vm.editproductBrandrow=editproductBrandrow;
        vm.inactivateproductbrandlabel="Inactivate";

        vm.editProductcaterow=editProductcaterow;
        vm.deleteProductcaterow=deleteProductcaterow;
        vm.inactivateproductcate=inactivateproductcate;
        vm.addProductcategory=addProductcategory;
        vm.inactivateproductcatelabel="Inactivate";

        vm.addcusfieldsProduct=addcusfieldsProduct;
        vm.editcusfieldsProduct=editcusfieldsProduct;
        vm.deletcusfieldsproduct=deletcusfieldsproduct;

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

            function addUnits(ev){
               $mdDialog.show({
                controller: 'DialogPrefaddUnitsController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/productDialog/addUnitsOfMeasure.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                   vm.Settings12thdoor.preference.productPref.units.push(answer);
               }, function() {
                vm.status = 'You cancelled the dialog.';
            });

           };

           function editunitsrow(edit,ev){
            $mdDialog.show({
                controller: 'DialogEditPrefaddUnitController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/productDialog/editUnitsOfMeasure.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { edit: edit },
                clickOutsideToClose:true,
            })
            .then(function(answer) {
                for (var i =  vm.Settings12thdoor.preference.productPref.units.length - 1; i >= 0; i--){
                    if ( vm.Settings12thdoor.preference.productPref.units[i].id == answer.id) { 
                     vm.Settings12thdoor.preference.productPref.units[i]=answer;
                     console.log(vm.Settings12thdoor.preference.productPref.units);
                     break;
                 }

             }

         }, function() {
            vm.status = 'You cancelled the dialog.';
        });

        }

        function deleteUnits(units, index){  
         vm.Settings12thdoor.preference.productPref.units.splice(index, 1);
     }

     function inactivateUnitsOfMeasure(data,index){
         for (var i =  vm.Settings12thdoor.preference.productPref.units.length - 1; i >= 0; i--){
            if ( vm.Settings12thdoor.preference.productPref.units[i].id == data.id) {

             if(data.activate){
                data.activate = false;
                vm.inactivateUnitsOfMeasurelabel="Activate";
                vm.Settings12thdoor.preference.productPref.units[i].activate=false;
            }else{
                data.activate = true;
                vm.inactivateUnitsOfMeasurelabel="Inactivate";
                vm.Settings12thdoor.preference.productPref.units[i].activate=true;
            }
        }
    }
    console.log(vm.Settings12thdoor.preference.productPref.units);

}

function addProductbrand(ev){
   $mdDialog.show({
    controller: 'DialogPrefproductBrandController',
    controllerAs: 'vm',
    templateUrl: 'app/main/settings/dialogs/preferenceDialogs/productDialog/addProductBrand.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true,
})
   .then(function(answer) {
       vm.Settings12thdoor.preference.productPref.productBrands.push(answer);
   }, function() {
    vm.status = 'You cancelled the dialog.';
});

};

function editproductBrandrow(edit,ev){
    $mdDialog.show({
        controller: 'DialogEditPrefproductBrandController',
        controllerAs: 'vm',
        templateUrl: 'app/main/settings/dialogs/preferenceDialogs/productDialog/editProductBrand.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: { edit: edit },
        clickOutsideToClose:true,
    })
    .then(function(answer) {
        for (var i =  vm.Settings12thdoor.preference.productPref.productBrands.length - 1; i >= 0; i--){
            if ( vm.Settings12thdoor.preference.productPref.productBrands[i].id == answer.id) { 
             vm.Settings12thdoor.preference.productPref.productBrands[i]=answer;
             console.log(vm.Settings12thdoor.preference.productPref.productBrands);
             break;
         }

     }

 }, function() {
    vm.status = 'You cancelled the dialog.';
});

}

function deleteproductBrand(units, index){  
 vm.Settings12thdoor.preference.productPref.productBrands.splice(index, 1);
}

function inactivateproductbrand(data,index){
 for (var i =  vm.Settings12thdoor.preference.productPref.productBrands.length - 1; i >= 0; i--){
    if ( vm.Settings12thdoor.preference.productPref.productBrands[i].id == data.id) {

     if(data.activate){
        data.activate = false;
        vm.inactivateproductbrandlabel="Activate";
        vm.Settings12thdoor.preference.productPref.productBrands[i].activate=false;
    }else{
        data.activate = true;
        vm.inactivateproductbrandlabel="Inactivate";
        vm.Settings12thdoor.preference.productPref.productBrands[i].activate=true;
    }
}
}
console.log(vm.Settings12thdoor.preference.productPref.productBrands);

}

function addProductcategory(ev){
   $mdDialog.show({
    controller: 'DialogPrefProductCatController',
    controllerAs: 'vm',
    templateUrl: 'app/main/settings/dialogs/preferenceDialogs/productDialog/addProductCategories.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true,
})
   .then(function(answer) {
       vm.Settings12thdoor.preference.productPref.productCategories.push(answer);
   }, function() {
    vm.status = 'You cancelled the dialog.';
});

};

function editProductcaterow(edit,ev){
    $mdDialog.show({
        controller: 'DialogEditPrefProductCatController',
        controllerAs: 'vm',
        templateUrl: 'app/main/settings/dialogs/preferenceDialogs/productDialog/editProductCategories.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: { edit: edit },
        clickOutsideToClose:true,
    })
    .then(function(answer) {
        for (var i =  vm.Settings12thdoor.preference.productPref.productCategories.length - 1; i >= 0; i--){
            if ( vm.Settings12thdoor.preference.productPref.productCategories[i].id == answer.id) { 
             vm.Settings12thdoor.preference.productPref.productCategories[i]=answer;
             console.log(vm.Settings12thdoor.preference.productPref.productCategories);
             break;
         }

     }

 }, function() {
    vm.status = 'You cancelled the dialog.';
});

}

function deleteProductcaterow(units, index){  
 vm.Settings12thdoor.preference.productPref.productCategories.splice(index, 1);
}

function inactivateproductcate(data,index){
 for (var i =  vm.Settings12thdoor.preference.productPref.productCategories.length - 1; i >= 0; i--){
    if ( vm.Settings12thdoor.preference.productPref.productCategories[i].id == data.id) {

     if(data.activate){
        data.activate = false;
        vm.inactivateproductcatelabel="Activate";
        vm.Settings12thdoor.preference.productPref.productCategories[i].activate=false;
    }else{
        data.activate = true;
        vm.inactivateproductcatelabel="Inactivate";
        vm.Settings12thdoor.preference.productPref.productCategories[i].activate=true;
    }
}
}
console.log(vm.Settings12thdoor.preference.productPref.productCategories);

}

function addcusfieldsProduct(ev){
   $mdDialog.show({
    controller: 'DialogPrefCusfieldProductController',
    controllerAs: 'vm',
    templateUrl: 'app/main/settings/dialogs/preferenceDialogs/productDialog/addCusfieldProduct.html',
    parent: angular.element(document.body),
    targetEvent: ev,
    clickOutsideToClose:true,
})
   .then(function(answer) {
       vm.Settings12thdoor.preference.productPref.cusFiel.push(answer);
   }, function() {
    vm.status = 'You cancelled the dialog.';
});

};

function editcusfieldsProduct(edit,ev){
    $mdDialog.show({
        controller: 'DialogEditPrefCusfieldProductController',
        controllerAs: 'vm',
        templateUrl: 'app/main/settings/dialogs/preferenceDialogs/productDialog/editCusfieldProduct.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals: { edit: edit },
        clickOutsideToClose:true,
    })
    .then(function(answer) {
        for (var i =  vm.Settings12thdoor.preference.productPref.cusFiel.length - 1; i >= 0; i--){
            if ( vm.Settings12thdoor.preference.productPref.cusFiel[i].id == answer.id) { 
             vm.Settings12thdoor.preference.productPref.cusFiel[i]=answer;
             console.log(vm.Settings12thdoor.preference.productPref.cusFiel);
             break;
         }

     }

 }, function() {
    vm.status = 'You cancelled the dialog.';
});

}

function deletcusfieldsproduct(units, index){  
 vm.Settings12thdoor.preference.productPref.cusFiel.splice(index, 1);
}




}

})();