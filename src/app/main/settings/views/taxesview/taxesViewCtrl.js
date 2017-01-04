(function()
{
    'use strict';

    angular
    .module('app.settings')
    .controller('taxesViewController',taxesViewController);

    /** @ngInject */
    function taxesViewController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast, $serviceCall, $mdSidenav, $state, msApi, $auth)
    {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

    	function toggleSidenav(sidenavId)
    	{
    		$mdSidenav(sidenavId).toggle();
    	}
    	// dont change above code !
        vm.individualtaxesAdd=individualtaxesAdd;
        vm.individualtaxesEdit=individualtaxesEdit;
        vm.individualtaxesDelete=individualtaxesDelete;
        vm.individualtaxesInactivate=individualtaxesInactivate;
        vm.multipletaxgroupAdd=multipletaxgroupAdd;
        vm.multipletaxgroupEdit=multipletaxgroupEdit;
        vm.multipletaxgroupDelete=multipletaxgroupDelete;
        vm.multipletaxInactivate=multipletaxInactivate;
        vm.saveTax=saveTax;


        function loadSetting(){
            var client =  $serviceCall.setClient("getAll","setting"); // method name and service
            client.ifSuccess(function(data){ 
                console.log(data[0]);
                vm.Settings12thdoor=data[0];
                $rootScope.individualTaxes=vm.Settings12thdoor.taxes.individualTaxes;
                $rootScope.multipletaxGroup=vm.Settings12thdoor.taxes.multipleTaxGroup;

            });
            client.ifError(function(data){ 
                notifications.toast("There was an error, when data loading", "error");
            })

            client.skip(0); 
            client.take(10); 
            client.orderby();
            client.getReq();
        }
        loadSetting();

        function saveTax(){
                 var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
                client.ifSuccess(function(data){  //sucess  
                    var toast = $mdToast.simple().content('Successfully saved Taxes').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                });
                client.ifError(function(data){ //false
                  var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
                  $mdToast.show(toast).then(function() {});
              })
                client.tab('taxes');
                client.postReq(vm.Settings12thdoor.taxes);
            }

            function individualtaxesAdd(ev) {
                $mdDialog.show({
                    controller: 'DialogindividualtaxController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/settings/dialogs/taxDialogs/individualTaxes.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })
                .then(function(answer) {
                    vm.Settings12thdoor.taxes.individualTaxes.push(answer);

                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            };

            function individualtaxesEdit(individualtax,ev) {
                $mdDialog.show({
                    controller: 'DialogindividualtaxEditController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/settings/dialogs/taxDialogs/individualTaxesEdit.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: { individualtax: individualtax },
                    clickOutsideToClose:true
                })
                .then(function(answer) {
                    for (var i = vm.Settings12thdoor.taxes.individualTaxes.length - 1; i >= 0; i--) {
                        if ( vm.Settings12thdoor.taxes.individualTaxes[i].taxID == answer.taxID) { 
                            vm.Settings12thdoor.taxes.individualTaxes[i]=answer;
                            break;
                        }
                    }

                    for(var i=0; i<vm.Settings12thdoor.taxes.multipleTaxGroup.length; i++){
                        console.log(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes);
                        for(var j=0; j<vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes.length; j++){
                            console.log(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].taxName);
                            if(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].taxName==answer.taxName){
                                vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].taxName=answer.taxName;
                                vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].rate=answer.rate;
                                vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].activate=answer.activate;
                                vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].compound=answer.compound;
                            }
                        }
                    }

                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            };

            function individualtaxesDelete(indiTax,index){
                vm.Settings12thdoor.taxes.individualTaxes.splice(index, 1);

            }
            function individualtaxesInactivate(data,index){
                console.log(index);
                if(data.activate){
                    data.activate = false;
                    data.labelIndividualTaxStatus="Activate";
                    vm.Settings12thdoor.taxes.individualTaxes[index].labelIndividualTaxStatus="Activate";
                    for(var i=0; i<vm.Settings12thdoor.taxes.multipleTaxGroup.length; i++){
                        console.log(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes);
                        for(var j=0; j<vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes.length; j++){
                            console.log(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].taxName);
                            if(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].taxName==data.taxName){
                                vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].labelIndividualTaxStatus=data.labelIndividualTaxStatus;
                                vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].activate=data.activate;
                            }
                        }
                    }

                    
                }else{
                    data.activate = true;
                    data.labelIndividualTaxStatus="Inactivate";
                    vm.Settings12thdoor.taxes.individualTaxes[index].labelIndividualTaxStatus="Inactivate";
                    for(var i=0; i<vm.Settings12thdoor.taxes.multipleTaxGroup.length; i++){
                        console.log(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes);
                        for(var j=0; j<vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes.length; j++){
                            console.log(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].taxName);
                            if(vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].taxName==data.taxName){
                                vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].labelIndividualTaxStatus=data.labelIndividualTaxStatus;
                                vm.Settings12thdoor.taxes.multipleTaxGroup[i].individualTaxes[j].activate=data.activate;
                            }
                        }
                    }
                    
                }


            }

            function multipletaxgroupAdd(ev) {
                $mdDialog.show({
                    controller: 'DialogmultipletaxgroupController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/settings/dialogs/taxDialogs/multipletaxgroup.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })
                .then(function(answer) {
                    vm.Settings12thdoor.taxes.multipleTaxGroup.push(answer);
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            };

            function multipletaxgroupEdit(multipletaxgroup,ev) {
                $mdDialog.show({
                    controller: 'DialogmultipletaxgroupEditController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/settings/dialogs/taxDialogs/multipletaxgroupEdit.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: { multipletaxgroup: multipletaxgroup },
                    clickOutsideToClose:true
                })
                .then(function(answer) {
                    console.log(answer);
                    for (var i = 0; i < vm.Settings12thdoor.taxes.multipleTaxGroup.length; i++){
                        if (vm.Settings12thdoor.taxes.multipleTaxGroup[i].multipleTaxGroupID == answer.multipleTaxGroupID) { 
                            vm.Settings12thdoor.taxes.multipleTaxGroup[i]=answer;
                            break;
                        }
                    };

                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            };

            function multipletaxgroupDelete(multiTax,index){
                vm.Settings12thdoor.taxes.multipleTaxGroup.splice(index,1)

            }

            function multipletaxInactivate(data,index){
                if(data.activate){
                    data.activate = false;
                    data.labelMultipleTaxStatus="Activate";
                    vm.Settings12thdoor.taxes.multipleTaxGroup[index].labelMultipleTaxStatus="Activate";


                }else{
                    data.activate = true;
                    data.labelMultipleTaxStatus="Inactivate";
                    vm.Settings12thdoor.taxes.multipleTaxGroup[index].labelMultipleTaxStatus="Inactivate";
                }

            }




        }
    })();