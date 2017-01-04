(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('editInvCtrl', editInvCtrl);

    function editInvCtrl($scope, $rootScope, Invoicecopy, InvoiceService, $serviceCall, $mdToast, $document, $mdDialog, $mdMedia, $mdSidenav, $state)
    {
    	 var vm = this;

        vm.TDinv = {};

        vm.toggleChildStates = toggleChildStates;
        vm.changeAddress = changeAddress; 
        vm.loadAll = loadAll;
        InvoiceService.removeAll(0);
        InvoiceService.removeTaxArray(0);
        vm.selectedItemChange = selectedItemChange;
       // vm.loadInvNo = loadInvNo;
        // vm.Invprefix = "INV"
        // vm.Invsequence = "0000"
        vm.addProduct = addProduct;
        vm.calculatetotal = calculatetotal;
        vm.CalculateTax = CalculateTax;
        vm.salesTax = 0;
        vm.total = 0;
        vm.finalamount = finalamount;
        vm.famount = 0;
        vm.submit  = submit;
        var ProductArray = [];
        vm.lineItems = [];
        var taxArr = [];
        vm.deleteProduct = deleteProduct;
        vm.editProduct = editProduct;
        vm.addShipping = addShipping;
        vm.MultiDuDates = MultiDuDates;
        vm.taxArray = [];
        vm.TDinv.isCurrencyChanged  = true;
        
        loadAll();
        loadSettings();

        var details = Invoicecopy.getInvArr();
        var invNo = details.invoiceNo;
        loadINVDRaft();
        function loadINVDRaft(){
            var Invoice = { "permissionType" : "add", "appName":"Invoices"};
              var jsonString = JSON.stringify(Invoice);

              var client =  $serviceCall.setClient("getInvoiceDraftByKey","invoice");
              client.ifSuccess(function(data){
                  var data = data;

                  vm.TDinv = data;
                   vm.selectedItem1 = vm.TDinv.profileName;
                    if(vm.TDinv.invoiceLines){
                        for (var i = vm.TDinv.invoiceLines.length - 1; i >= 0; i--) {
                            InvoiceService.setArray(vm.TDinv.invoiceLines[i])
                        }  
                    }
                  
              });
              client.ifError(function(data){
                console.log("error loading setting data")
              })
              client.uniqueID(details.invoiceNo); // send projectID as url parameters
              client.postReq();
        }
        
        
        console.log(details)

         vm.TDinv.startDate = new Date();
            vm.TDinv.shipping = parseFloat(0);
            vm.paymentMethod = [];
            vm.checkpayments = [];
            

             vm.paymentMethod.push({
                paymentmethod: '-',
                paymentType: 'offline',
                activate: "Active"
        })
            vm.paymentMethod.push({
                paymentmethod: 'Offline Payments Only',
                paymentType: 'offline',
                activate: "Active"
        })

        function loadSettings(){
            var settings = $serviceCall.setClient("getAllByQuery","setting");
            settings.ifSuccess(function(data){
               assignSettigsData(data);
            });
            settings.ifError(function(data){

            });
            settings.postReq({"setting":"profile,payments","preference":"invoicePref,paymentPref,productPref,inventoryPref"})
        }


        function assignSettigsData(val){
             vm.Invprefix = val[0].preference.invoicePref.invoicePrefix;
             vm.Invsequence = val[0].preference.invoicePref.invoiceSequence;
            //loadInvNo();

            vm.TDinv.peymentTerm = val[0].preference.invoicePref.defaultPaymentTerms;
            vm.enableShippingCharges = val[0].preference.invoicePref.enableShipping;
            vm.TDinv.allowPartialPayments = val[0].preference.invoicePref.allowPartialPayments;
            vm.TDinv.baseCurrency = val[0].profile.baseCurrency;
            vm.TDinv.changedCurrency = val[0].profile.baseCurrency;


            if(val[0].preference.paymentPref.paymentMethods.length >= 1) {
                    for (var x = val[0].preference.paymentPref.paymentMethods.length - 1; x >= 0; x--) {
                            if (val[0].preference.paymentPref.paymentMethods[x].activate == true) {
                               vm.paymentMethod.push({
                                    paymentmethod: val[0].preference.paymentPref.paymentMethods[x].paymentMethod,
                                    paymentType: val[0].preference.paymentPref.paymentMethods[x].paymentType,
                                    activate: val[0].preference.paymentPref.paymentMethods[x].activate
                                })   
                            }
                        };
                   }
                        for (var y = val[0].payments.length - 1; y >= 0; y--) {
                        if (val[0].payments[y].activate == true) {
                            vm.checkpayments = val[0].payments;
                           vm.paymentMethod.push({
                                paymentmethod: val[0].payments[y].name,
                                paymentType: val[0].payments[y].paymentType,
                                activate: val[0].payments[y].activate
                            })
                        }
                    };
                if(vm.checkpayments.length >= 1){
                    vm.paymentMethod.push({
                            paymentmethod: 'All Online Payment Options',
                            paymentType: 'offline',
                            activate: "Active"
                        })
                }
        }


         $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "Due on Receipt") {
                vm.TDinv.dueDate = new Date();
                vm.dueOnReciept = new Date();
                vm.showdate = false;
            }
        });
         $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "Net 7 days") {
                vm.sevenDays = new Date();
                vm.sevenDays.setDate(vm.sevenDays.getDate() + 7);
                vm.TDinv.dueDate = vm.sevenDays;
                vm.showdate = false;
            }
        });

        $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "Net 14 days") {
                vm.fourteendays = new Date();
                vm.fourteendays.setDate(vm.fourteendays.getDate() + 14);
                vm.TDinv.dueDate = vm.fourteendays;
                vm.showdate = false;
            }
        });

        $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "Net 21 days") {
                vm.twentyOneDays = new Date();
                vm.twentyOneDays.setDate(vm.twentyOneDays.getDate() + 21);
                vm.TDinv.dueDate = vm.twentyOneDays;
                vm.showdate = false;
            }
        });

        $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "Net 30 days") {
                vm.thirtyDays = new Date();
                vm.thirtyDays.setDate(vm.thirtyDays.getDate() + 30);
                vm.TDinv.dueDate = vm.thirtyDays;
                vm.showdate = false;
                //$rootScope.termType = "Net 30 days"
            }
        });

        $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "Net 45 days") {
                vm.fourtyFiveDays = new Date();
                vm.fourtyFiveDays.setDate(vm.fourtyFiveDays.getDate() + 45);
                vm.TDinv.dueDate = vm.fourtyFiveDays;
                vm.showdate = false;
                //$rootScope.termType = "Net 45 days"
            }
        });

        $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "Net 60 days") {
                vm.sixtyDays = new Date();
                vm.sixtyDays.setDate(vm.sixtyDays.getDate() + 60);
                vm.TDinv.dueDate = vm.sixtyDays;
                vm.showdate = false;
            }
        });

        $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "Custom") {
                vm.TDinv.dueDate = "";
                vm.showdate = false;
            }
        });

        $scope.$watch("vm.TDinv.peymentTerm", function() {
            if (vm.TDinv.peymentTerm == "multipleDueDates") {
                //$rootScope.termType = "multipleDueDates"
                vm.showdate = true;
            }
        });
        ProductArray = InvoiceService.getArry();
        function MultiDuDates(){
            if(ProductArray.val.length >= 1){
               $mdDialog.show({
                templateUrl: 'app/main/invoices/dialogs/multiDueDates/MultiDueDates.html',
                controller: 'multiDueDatesCtrl',
                controllerAs: 'vm',
                locals:{
                        item : vm.famount
                    }
            })  
           }else{
             var tt = angular.copy(vm.TDinv.peymentTerm)
           
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('Sorry')
                    .content('Please add a line item to configure multiple due dates')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent()
                ).then(function() { 
                    vm.TDinv.peymentTerm =  tt;
                }, function() {});
          
             }
        }


        
        function toggleChildStates(toggledState){
            $state.go(toggledState);
        };

         //================change address============================
        vm.Billingaddress = true;
        vm.Shippingaddress = false;

          function changeAddress() {
                vm.Billingaddress = !vm.Billingaddress;
                vm.Shippingaddress = !vm.Shippingaddress;
            }

    //=========Load Customer===========================================
     vm.querySearch = querySearch;
     vm.searchText = null;
     var customerNames = [];

     function querySearch(query) {
            vm.enter(query)
            var results = [];
            for (var i = 0, len = customerNames.length; i < len; ++i) {
                    results.push(customerNames[i]);
            }
            return results;
        }


        function loaDCus(val){
          var client = $serviceCall.setClient("getAllByQuery","profile");
             client.ifSuccess(function(data){
                var data = data;
                if(data.result.length >= 1){
               customerNames = [];
                    for (var i = 0, len = data.result.length; i < len; ++i) {
                        customerNames.push({
                            display: data.result[i].profileName,
                            value: data.result[i],
                        });
                    }
                }
                
               });
               client.ifError(function(data){
                console.log("error loading profile data")
               })
               client.skip(0);
               client.take(10);
               client.class("Customer") 
               client.orderby("profileID");
               client.isAscending(true);
               client.postReq(val);  
        }

        function loadAll(){
            loaDCus({where : "status = 'Active' and deleteStatus = false"})
        }

        vm.enter = function(val){
             loaDCus({where : "status = 'Active' and deleteStatus = false and (profileName LIKE" +"'" +val+"%' OR email LIKE"+"'"+val+"%')"})
        }


       function selectedItemChange(obj) {
            console.log(obj)
            if(vm.selectedItem1 == null){
                vm.showEditCustomer = false;
                vm.TDinv.billingAddress = "";
                vm.TDinv.shippingAddress = "";
                vm.TDinv.contactNo = "";
                vm.TDinv.email = "";
            }else{
                vm.showEditCustomer = true;
                vm.TDinv.profileName = obj.value.profileName;
                vm.TDinv.email = obj.value.email;
                vm.TDinv.profileID = obj.value.profileID;
                vm.TDinv.contactNo = obj.value.phone;
                vm.TDinv.billingAddress = obj.value.billingAddress;
                vm.TDinv.shippingAddress = obj.value.shippingAddress;
            }
        };

        //add product Pop up
        function addProduct(ev){
             $mdDialog.show({
                templateUrl: 'app/main/invoices/dialogs/addproduct/addproduct.html',
                targetEvent: ev,
                controller: 'addProdCtrl',
                controllerAs: 'vm'
            }).then(function(val){
                calculatetotal();
            },function(val){

            })
        }

         

        vm.toggleChildStates = toggleChildStates;
        vm.lineItems = ProductArray.val;
        vm.sortableOptions = {
            handle        : '.handle',
            forceFallback : true,
            ghostClass    : 'line-item-placeholder',
            fallbackClass : 'line-item-ghost',
            fallbackOnBody: true,
            sort          : true
        };

        vm.itemOrder = '';

        vm.preventDefault = preventDefault;
        
        function toggleChildStates(toggledState){
            $state.go(toggledState);
        };

        function preventDefault(e){
            e.preventDefault();
            e.stopPropagation();
        };

        vm.taxArray = InvoiceService.getTaxArr();
        function calculatetotal(){
            vm.total = InvoiceService.calculateTotal();
             vm.taxArray = InvoiceService.getTaxArr();
            CalculateTax();
            finalamount();
        }

        function CalculateTax() {
            vm.salesTax = InvoiceService.calculateTax();
        }
            
        function finalamount() {
            if(vm.TDinv.shipping == ""){
                vm.ship = 0
            }else{
                vm.ship = vm.TDinv.shipping;
            }

            vm.famount = InvoiceService.calculateNetAMount(vm.ship);
            // vm.famount = parseFloat(vm.total) + parseFloat(vm.salesTax) +
            //     parseFloat(vm.ship);
        };


        function submit(){
            if(vm.selectedItem1 == null){
               $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .content('Please select a customer to save the invoice')
                  .ariaLabel('Alert Dialog Demo')
                  .ok('OK')
                  .targetEvent()
                ); 
            }else{
                if(vm.TDinv.profileID != ""){
                    if(ProductArray.val.length > 0){
                        if(vm.TDinv.peymentTerm != "" || vm.TDinv.peymentTerm != undefined){
                            successSubmit();  
                        }else{
                           $mdDialog.show(
                          $mdDialog.alert()
                          .parent(angular.element(document.body))
                          .content('Please select a payment term to save the invoice')
                          .ariaLabel('Alert Dialog Demo')
                          .ok('OK')
                          .targetEvent()
                        );  
                        }
                    }else{
                        $mdDialog.show(
                          $mdDialog.alert()
                          .parent(angular.element(document.body))
                          .content('You should add atleast one line Item to save the invoice')
                          .ariaLabel('Alert Dialog Demo')
                          .ok('OK')
                          .targetEvent()
                        ); 
                    }
                }else{
                     $mdDialog.show(
                      $mdDialog.alert()
                      .parent(angular.element(document.body))
                      .content('You should add a existing Customer to save the invoice')
                      .ariaLabel('Alert Dialog Demo')
                      .ok('OK')
                      .targetEvent()
                    );  
                }
                
            }
        }

        function successSubmit(){
            if(vm.TDinv.peymentTerm == "multipleDueDates"){
              var multiDueDates = MultipleDudtesService.getArry();
              for (var i = multiDueDates.val.length - 1; i >= 0; i--) {
                  vm.TDinv.multiDueDates.push({
                        dueDate: multiDueDates.val[i].dueDate,
                        percentage:  multiDueDates.val[i].percentage,
                        dueDatePrice:  multiDueDates.val[i].dueDatePrice,
                        paymentStatus: 'Unpaid',
                        balance:  multiDueDates.val[i].balance,
                        paidAmount : 0
                    });
              }
              console.log(vm.TDinv.multiDueDates)
            }else{
              vm.TDinv.multiDueDates = [{
                        dueDate: vm.TDinv.dueDate,
                        percentage: "0",
                        dueDatePrice: vm.famount,
                        paymentStatus: 'Unpaid',
                        balance: vm.famount,
                        paidAmount : 0
                    }];
  
            }
            
            vm.TDinv.discountPercentage = 0;
            vm.TDinv.exchangeRate = 1;
            vm.TDinv.favouriteStar = false;
            vm.TDinv.favouriteStarNo = 1;
            vm.TDinv.deleteStatus = false;
            vm.TDinv.status = "Invoice";
            vm.TDinv.subTotal =  vm.total;
            vm.TDinv.netAmount = vm.famount;
            vm.TDinv.discountAmount = 0;
            vm.TDinv.salesTaxAmount = vm.salesTax;
            vm.TDinv.invoiceStatus = "Unpaid";
            vm.TDinv.pattern = vm.Invprefix+vm.Invsequence;

            vm.TDinv.invoiceLines = ProductArray.val;
            vm.TDinv.taxAmounts = [];

                var Invoice = {"invoice" : vm.TDinv, "image" :[], "draftInvoiceNo" : vm.TDinv.invoiceNo, "permissionType" : "edit", "appName":"Invoices", "invSequence":"GRN001" };;
                var jsonString = JSON.stringify(Invoice);
               
                var client =  $serviceCall.setClient("saveDraftToInvoice","process");
                client.ifSuccess(function(data){
                    vm.TDinv.invoiceNo = data.ID;
                    $state.go('app.invoices.inv.detailView', {itemId:  vm.TDinv.invoiceNo});

              $mdToast.show(
                  $mdToast.simple()
                    .textContent('Invoice No '+ data.ID +'Successfully Saved')
                    .position('top right' )
                    .hideDelay(3000)
                );
             });
             client.ifError(function(data){
              $mdToast.show(
                  $mdToast.simple()
                    .textContent('Error Saving Invoice')
                    .position('top right' )
                    .hideDelay(3000)
                );
             })
              client.postReq(jsonString);
        }

        function deleteProduct(prod, index){
            InvoiceService.ReverseTax(prod, index);
            InvoiceService.removeArray(prod,index);
            calculatetotal();
        }

        function editProduct(val, index){
             $mdDialog.show({
                templateUrl: 'app/main/invoices/dialogs/addproduct/editProduct.html',
                controller: 'editNewProd',
                controllerAs: 'vm',
                locals:{
                        item : val
                    }
            }).then(function(data){
                console.log(data)
            },function(data){

            })
        }
      
        
        vm.cancel = function(ev){
            var confirm = $mdDialog.confirm()
                    .title('Are you sure you want to delete Invoice draft'+ vm.TDinv.invoiceNo + '? \n This process is not reversible.')
                    .content('')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function() {
                    

            var jsonString = JSON.stringify(vm.TDinv);

            var client =  $serviceCall.setClient("deleteDraft","invoice");
            client.ifSuccess(function(data){
               $state.go('app.invoices.inv'); 

              // $mdToast.show(
              //     $mdToast.simple()
              //       .textContent('Draft Invoice No '+ data.ID +'Successfully Saved')
              //       .position('top right' )
              //       .hideDelay(3000)
              //   );
             });
             client.ifError(function(data){
              $mdToast.show(
                  $mdToast.simple()
                    .textContent('Error Saving Draft Invoice')
                    .position('top right' )
                    .hideDelay(3000)
                );
             })
             client.uniqueID(vm.TDinv.invoiceNo)
              client.postReq(jsonString);
                }, function(){
                 $state.go('app.invoices.inv');
            });
        }

        function addShipping(val){
            finalamount()
        }

        vm.addContact = addContact;

        function addContact(){
            $mdDialog.show({
                templateUrl: 'app/main/invoices/dialogs/contact/addContact.html',
                controller: 'addCusCtrl',
                controllerAs: 'vm'
            }).then(function(data){
                var data = data;
                assignCusData(data);
            }, function(data){

            })
        };

        function assignCusData(val){
            console.log(val)
            var cus = {
                display:val.profileName,
                value : val
            }
            vm.selectedItem1 = val.profileName;
            selectedItemChange(cus)
            
        }

        vm.editContact = editContact;
        function editContact(val){
            
             $mdDialog.show({
                templateUrl: 'app/main/invoices/dialogs/contact/addContact.html',
                controller: 'editCusCtrl',
                controllerAs: 'vm',
                    locals:{
                        item : val.value
                    }
            }).then(function(data){
                var data = data;
                assignCusData(data);
            }, function(data){

            })
        }

        //==========================================
        vm.uploadFile = uploadFile;

        function uploadFile (){
            console.log("ghfhg")
          
            var position = $mdPanel.newPanelPosition()
            .absolute()
            .center()
            .center();
            var animation = $mdPanel.newPanelAnimation(); 
            animation.withAnimation($mdPanel.animation.FADE);
            var config = {
            animation: animation,
            attachTo: angular.element(document.body),
            controller: 'uploadCtrl',
            controllerAs: 'vm',
            templateUrl: 'app/main/invoices/dialogs/uploader/upload.html',
            panelClass: 'dialog-uploader',
            position: position,
            trapFocus: true,
            zIndex: 150,
            clickOutsideToClose: true,
            clickEscapeToClose: true,
            hasBackdrop: true
            };
            $mdPanel.open(config);
            
        }
        //=================================================================
        vm.changeCurrency = changeCurrency;

        function changeCurrency(){
           $mdDialog.show({
                templateUrl: 'app/main/invoices/dialogs/changeCurrency/changeCurrency.html',
                controller: 'changeCurrencyCtrl',
                controllerAs: 'vm',
                locals:{
                    item : "USD"
                }
            }).then(function(data){
                var data = data;
                console.log(data)
                // assignCusData(data);
            }, function(data){

            }) 
        }
       
    }

})();