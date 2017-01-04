(function ()
{
    'use strict';

    angular
    .module('app.contacts')
    .controller('customerComposeController', customerComposeController);

    /** @ngInject */
    function customerComposeController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state,$mdToast,$serviceCall)
    {
        var vm = this;
        vm.toggleChildStates = toggleChildStates;

        vm.loadingItems = false;

        vm.currentThread = null;

        vm.selectedThreads = [];

        vm.submit=submit; 

        vm.querySearchShipping = querySearchShipping;

        vm.querySearch = querySearch;

        vm.loadPro = loadPro;

        vm.onChange = onChange;

        vm.cancel = cancel;

        vm.addressChange = addressChange;

        //vm.selectedItemChange = selectedItemChange;

        loadPro();
        loadCountries();

        vm.contact = {};

        function toggleChildStates(toggledState){
            $state.go(toggledState);
        };

        vm.contact = {
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
            "image"           : [],
            "age"             : "",
            "NIC"             : "",
            "notes"           : ""
          }


          vm.showBilling = true;

          //__________define Address fields________

          vm.contact["billingAddress"] = {
            city    : "",
            country : "",
            state   : "",
            street  : "",
            zip     : ""
          };
          vm.contact["shippingAddress"] = {
            s_city    : "",
            s_country : "",
            s_state   : "",
            s_street  : "",
            s_zip     : ""
          };
        //========================================

        //________________toggle button to change address_____
          function addressChange(){
          
              vm.showShipping = !vm.showShipping;
              vm.showBilling = !vm.showBilling;
          }

          //______________Copy shipping Address to Billing Address__________________________________________________________
          var cb = false;
          function onChange(cb){

            vm.contact.shippingAddress["s_street"] = vm.contact.billingAddress["street"];
            vm.contact.shippingAddress["s_city"] = vm.contact.billingAddress["city"];
            if (vm.selectedItem != null) {
              vm.contact.shippingAddress["s_country"] = vm.selectedItem.country;
            }
            vm.contact.shippingAddress["s_zip"] = vm.contact.billingAddress["zip"];
            vm.contact.shippingAddress["s_state"] = vm.contact.billingAddress["state"];
            vm.selectedItemShipping = vm.selectedItem.country 
            if (cb == false) {
              vm.contact.shippingAddress["s_street"] = "";
              vm.contact.shippingAddress["s_city"] = "";
              vm.contact.shippingAddress["s_country"] = "";
              vm.contact.shippingAddress["s_zip"] = "";
              vm.contact.shippingAddress["s_state"] = "";
              vm.selectedItemShipping=null;
              vm.searchText1="";
            }
        }

        vm.allCountries = [];
        vm.allCountriesForBilling=[];

        function querySearchShipping(query) {
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

        function querySearch(query) {
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
                  //vm.allCountriesForBilling=[]
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


        // function selectedItemChange(selectedItem){
        //   console.log(selectedItem);
        // }
          

        function submit(){


          if(!vm.contact.email || vm.contact.email == ""){
             $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .content('Please add a valid email to proceed.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent()
              );

           }else if(vm.contact.profileName == ""){
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .content('Please add Company Name to proceed.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent()
              );

           }else{

            vm.contact.profileLog = {
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
                vm.contact.billingAddress["country"] = vm.selectedItem.country;
                if(vm.selectedItemShipping != null)
                  if(vm.selectedItemShipping.country == undefined){
                    vm.contact.shippingAddress["s_country"] = vm.selectedItemShipping;
                  }else{
                    vm.contact.shippingAddress["s_country"] = vm.selectedItemShipping.country;
                  }
                  
                  vm.contact.favouriteStar = false;
                  vm.contact.status = "Active";
                  vm.contact.favouriteStarNo = 1;
                  vm.contact.deleteStatus = false;
                  vm.contact.createDate = new Date();
                  vm.contact.profileClass = "Customer";
                  vm.contact.profileType = "Customer";
                  vm.contact.modifyDate = new Date();

                  var profileObj={};

                  profileObj={
                    "profile": vm.contact,
                    "image"  : vm.contact.image,
                    "appName" : "Contacts",
                    "permissionType":"add"
                  }

                var jsonString = JSON.stringify(profileObj) 

                var client =  $serviceCall.setClient("saveProfile","process"); // method name and service
                client.ifSuccess(function(data){   
                     console.log(data);
                  $mdToast.show(
                    $mdToast.simple()
                      .textContent('Customer Successfully Registerd')
                      .position('bottom right')
                      .theme('success-toast')
                      .hideDelay(2000)
                  );
                 $state.go("app.contacts.customer");
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
          $state.go('app.contacts.customer');
        }

        
        
    }
})();