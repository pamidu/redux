(function ()
{
    'use strict';

    angular
    .module('app.contacts')
    .controller('supplierComposeController', supplierComposeController);

    /** @ngInject */
    function supplierComposeController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state,$mdToast,$serviceCall)
    {
        var vm = this;
        vm.toggleChildStates = toggleChildStates;

        vm.loadingItems = false;

        vm.currentThread = null;

        vm.selectedThreads = [];

        vm.submit=submit;

        vm.querySearch1 = querySearch1;

        vm.querySearch = querySearch;

        vm.loadPro = loadPro;

        vm.onChange = onChange;

        vm.cancel = cancel;

        vm.addressChange = addressChange;

        loadPro();
        loadCountries();


        function toggleChildStates(toggledState){
            $state.go(toggledState);
        };


        
        function toggleChildStates(toggledState){
            $state.go(toggledState);
        };

        vm.supplier = {
            "profileName"     : "",
            "email"           : "",
            "firstName"       : "",
            "lastName"        : "",
            "billingAddress"  : {},
            "shippingAddress" : {},
            "phone"           : "",
            "mobile"          : "",
            "fax"             : "",
            "website"         : "",
            "profileLog"      : {},
            "status"          : "",
            "profileID"       : "",
            "deleteStatus"    : "",
            "favouriteStar"   : "",
            "favouriteStarNo" : "",
            "createDate"      : "",
            "profileClass"    : "",
            "profileType"     : "",
            "profileCategory" : "",
            "lastTranDate"    : "",
            "modifyDate"      : "",
            "createUser"      : "",
            "modifyUser"      : "",
            "adminMail"       : "",
            "image"           : []
          }

          //__________define Address fields________

          vm.supplier["billingAddress"] = {
            city    : "",
            country : "",
            state   : "",
            street  : "",
            zip     : ""
          };
          vm.supplier["shippingAddress"] = {
            s_city    : "",
            s_country : "",
            s_state   : "",
            s_street  : "",
            s_zip     : ""
          };
        //========================================

        vm.showBilling = true;

        //________________toggle button to change address_____
          function addressChange(){
          
              vm.showShipping = !vm.showShipping;
              vm.showBilling = !vm.showBilling;
          }

          //______________Copy shipping Address to Billing Address__________________________________________________________
          var cb = false;

          function onChange(cb){

            vm.supplier.shippingAddress["s_street"] = vm.supplier.billingAddress["street"];
            vm.supplier.shippingAddress["s_city"] = vm.supplier.billingAddress["city"];
            if (vm.selectedItem != null) {
              vm.supplier.shippingAddress["s_country"] = vm.selectedItem.country;
            }
            vm.supplier.shippingAddress["s_zip"] = vm.supplier.billingAddress["zip"];
            vm.supplier.shippingAddress["s_state"] = vm.supplier.billingAddress["state"];
            vm.selectedItem1 = vm.selectedItem.country 
            if (cb == false) {
              vm.supplier.shippingAddress["s_street"] = "";
              vm.supplier.shippingAddress["s_city"] = "";
              vm.supplier.shippingAddress["s_country"] = "";
              vm.supplier.shippingAddress["s_zip"] = "";
              vm.supplier.shippingAddress["s_state"] = "";
              vm.selectedItemShipping=null;
              vm.searchText1="";
            }
        }

         vm.allCountries = [];

        function querySearch(query) {
            vm.results = [];

                for (var i = 0, len = vm.allCountries.length; i < len; ++i) {
                   
                    if (vm.allCountries[i].country.startsWith(query.toLowerCase()) ) {
                        vm.results.push(vm.allCountries[i]);
                    }
                }
                return vm.results;
            }

        function loadCountries(){
          var client =  $serviceCall.setClient("getCountries","profile"); // method name and service
          client.ifSuccess(function(data){   
            if(data.length > 0){
               for (var i = data.length - 1; i >= 0; i--) {
                 vm.allCountries.push({
                  country: data[i].country_name.toLowerCase() + ", " +  data[i].country_code
                 })
               }
            }
          })
          client.ifError(function(data){ 
          
          })
          client.postReq();
        }

        function querySearch1(query) {
            vm.results = [];
            
                for (var i = vm.allCountriesForBilling.length - 1; i >= 0; i--) {

                    if (vm.allCountriesForBilling[i].country.startsWith(query.toLowerCase())) {
                        vm.results.push(vm.allCountriesForBilling[i]);
                    }
                }
                return vm.results;
        }

        function loadPro(){
          var client =  $serviceCall.setClient("getCountries","profile"); // method name and service
          client.ifSuccess(function(data){  
           console.log(data)
                if(data.length > 0){
                  vm.allCountriesForBilling=[]
                  for (var i = data.length - 1; i >= 0; i--) {
                    vm.allCountriesForBilling.push({
                      country: data[i].country_name.toLowerCase() + ", " +  data[i].country_code
                    })
                  }
                }
          })
          client.ifError(function(data){ 
          
          })
          
          client.postReq();
        }


        function submit(){


          if(!vm.supplier.email || vm.supplier.email == ""){
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .content('Please add a valid email to proceed.')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );

          }else if(vm.supplier.profileName == ""){
            $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.body))
              .content('Please add Company Name to proceed.')
              .ariaLabel('Alert Dialog Demo')
              .ok('OK')
              .targetEvent()
            );

          }else{

            vm.supplier.profileLog = {
                    profileID    : "",
                    logID        : "-888",
                    type         : "Activity",
                    description  : "",
                    UIHeight     : "30px",
                    status       : "Active",
                    userName     : "",
                    lastTranDate : new Date(),
                    createDate   : new Date(),
                    modifyDate   : new Date(),
                    createUser   : "",
                    modifyUser   : ""
                  }


                if(vm.selectedItem != null)
                vm.supplier.billingAddress["country"] = vm.selectedItem.country;
                if(vm.selectedItem1 != null)
                  if(vm.selectedItem1.country == undefined){
                    vm.supplier.shippingAddress["s_country"] = vm.selectedItem1;
                  }else{
                    vm.supplier.shippingAddress["s_country"] = vm.selectedItem1.country;
                  }
                  
                  vm.supplier.favouriteStar = false;
                  vm.supplier.status = "Active";
                  vm.supplier.favouriteStarNo = 1;
                  vm.supplier.deleteStatus = false;
                  vm.supplier.createDate = new Date();
                  vm.supplier.profileClass = "Supplier";
                  vm.supplier.profileType = "Supplier";
                  vm.supplier.modifyDate = new Date();

                  var profileObj={};

                  profileObj={
                    "profile": vm.supplier,
                    "image"  : vm.supplier.image,
                    "appName" : "Contacts",
                    "permissionType":"add"

                  }

                var jsonString = JSON.stringify(profileObj) 

                var client =  $serviceCall.setClient("saveProfile","process"); // method name and service
                client.ifSuccess(function(data){   
                     console.log(data);
                  $mdToast.show(
                    $mdToast.simple()
                      .textContent('Supplier Successfully Registerd')
                      .position('bottom right')
                      .theme('success-toast')
                      .hideDelay(2000)
                  );
                 $state.go("app.contacts.supplier");
                })
                client.ifError(function(data){ 
                    $mdDialog.show(
                      $mdDialog.alert()
                      .parent(angular.element(document.body))
                      .content('There was an error saving the data.')
                      .ariaLabel('Alert Dialog Demo')
                      .ok('OK')
                      .targetEvent()
                    );
                })
                
                client.postReq(jsonString);

          }

        }

        function cancel(){
          $state.go('app.contacts.supplier');
        }
    }
})();