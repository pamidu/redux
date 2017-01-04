(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('invoicePreferenceCtrl',invoicePreferenceCtrl);

	/** @ngInject */
	function invoicePreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
	{
		// use the below code on all child view controllers
		var vm = this;

		vm.toggleSidenav = toggleSidenav;

		function toggleSidenav(sidenavId)
		{
			$mdSidenav(sidenavId).toggle();
		}
    	// dont change above code !

        vm.addcusfieldsInvoice=addcusfieldsInvoice;
        vm.editCusfieldsInvoice=editCusfieldsInvoice;
        vm.deleteinvoicecusfieldsrow=deleteinvoicecusfieldsrow;

        function loadSetting(){
            var client =  $serviceCall.setClient("getAll","setting"); // method name and service
            client.ifSuccess(function(data){ 
            	console.log(data[0]);
            	vm.Settings12thdoor=data[0];
                 loadingCurrentInvoiceSequence();
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
            
             var client =  $serviceCall.setClient("validateNewSequence","setting"); // method name and service
            client.ifSuccess(function(data){ 
            console.log(data);
                if(data.isSuccess==true){

                    //Start replace \n to \\n.............................................................
                    var str =vm.Settings12thdoor.preference.invoicePref.defaultNote.toString();
                    var res= str.replace(new RegExp('\n', 'g'), '\\n');
                    vm.Settings12thdoor.preference.invoicePref.defaultNote=res;

                    var str2=vm.Settings12thdoor.preference.invoicePref.offlinePayments.toString();
                    var res2= str2.replace(new RegExp('\n', 'g'), '\\n');
                    vm.Settings12thdoor.preference.invoicePref.offlinePayments=res2;
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
                else{
                    var toast = $mdToast.simple().content(data.message).action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                }
                   
            });
            client.ifError(function(data){ 
            	var toast = $mdToast.simple().content('There was an error, when validate sequence').action('OK').highlightAction(false).position("bottom right");
            	$mdToast.show(toast).then(function() {});
            })

            client.prefix(vm.Settings12thdoor.preference.invoicePref.invoicePrefix); 
            client.sequence(vm.Settings12thdoor.preference.invoicePref.invoiceSequence); 
            client.preference('invoicePref');
            client.getReq();
            
            
  
        }

            function addcusfieldsInvoice(ev) {
                $mdDialog.show({
                    controller: 'DialogPrefInvoiceController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/settings/dialogs/preferenceDialogs/invoiceDialog/addCustomdetailsforInvoice.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                })
                .then(function(answer) {
                    vm.Settings12thdoor.preference.invoicePref.cusFiel.push(answer);

                }, function() {
                    vm.status = 'You cancelled the dialog.';
                });

            };

            function editCusfieldsInvoice(cusFieldsInvoiceEdit,ev) {
                $mdDialog.show({
                    controller: 'DialogEditPrefInvoiceController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/settings/dialogs/preferenceDialogs/invoiceDialog/editCustomdetailsforInvoice.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: { cusFieldsInvoiceEdit: cusFieldsInvoiceEdit },
                    clickOutsideToClose:true,
                })
                .then(function(answer) {
                    for (var i = vm.Settings12thdoor.preference.invoicePref.cusFiel.length - 1; i >= 0; i--){
                        if (vm.Settings12thdoor.preference.invoicePref.cusFiel[i].id == answer.id) { 
                            vm.Settings12thdoor.preference.invoicePref.cusFiel[i]=answer;
                            console.log(vm.Settings12thdoor.preference.invoicePref.cusFiel);
                            break;
                        }
                    }

                }, function() {
                    vm.status = 'You cancelled the dialog.';
                });

            };

            function deleteinvoicecusfieldsrow(){
                vm.Settings12thdoor.preference.invoicePref.cusFiel.splice(index, 1);
            }


            function loadingCurrentInvoiceSequence(){
                console.log(vm.Settings12thdoor.preference);
                console.log(vm.Settings12thdoor.preference.invoicePref.invoicePrefix);
                vm.prefix=vm.Settings12thdoor.preference.invoicePref.invoicePrefix;
                vm.sequence=vm.Settings12thdoor.preference.invoicePref.invoiceSequence;
                console.log(vm.prefix);
                console.log(vm.sequence);

                var client = $serviceCall.setClient("getNextNo","invoice");
                client.ifSuccess(function(data){
                    console.log(data);
                    if(data.length!=0){

                     var client = $serviceCall.setClient("getNextNo","invoice");
                     client.ifSuccess(function(data){

                        var res = data.substring(3);

                        var str=res.toString();

                        var num = 0;
                        var seq = ""; 

                        if(str.startsWith("0")){
                            for(var i=0; str.length > i; i++){
                                if(str.charAt(i) != '0') break;
                                else seq += "0";
                            }
                            var temp = parseInt(str) - 1;
                            num = seq + temp;
                        }
                        else num = parseInt(str) - 1;

                        var createdInvoicesCount=num.toString();
                        vm.Settings12thdoor.preference.invoicePref.invoiceSequence=createdInvoicesCount;
                        console.log(vm.Settings12thdoor.preference.invoicePref.invoiceSequence);

                    });
                     client.ifError(function(data){
                        console.log("error loading invoice sequence")
                    })
                     client.pattern(vm.prefix+vm.sequence);
                     client.getReq();

                 }

             });
                client.ifError(function(data){
                    console.log("error loading invoice sequence")
                })
                client.pattern(vm.prefix+vm.sequence);
                client.getReq();


            }
           


            

        }

    })();