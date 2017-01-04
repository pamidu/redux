  (function ()
{
    'use strict';

    angular
        .module('app.contacts')
        .controller('DialogControllerEditSupplier', DialogControllerEditSupplier);

    /** @ngInject */
   // customerController.$inject = ['$mdDialog','$serviceCall','profileID'];

    function DialogControllerEditSupplier($mdDialog,$serviceCall,profileID,supplierEditService,$mdToast,favouriteStar,favouriteStarNo)
    {

      var vm=this;

      vm.editCustomer = editCustomer;

      vm.onChange = onChange;

      vm.querySearchShipping = querySearchShipping;

      vm.querySearch = querySearch;

      //vm.loadCountries = loadCountries;

      vm.cancelDialog = cancelDialog;

      vm.addressChange = addressChange;

      loadPro();
      loadCountries();

      var client =  $serviceCall.setClient("getProfileByKey","profile"); // method name and service
       client.ifSuccess(function(data){  
        console.log(data);

         var profileLog = {
              profileID    : profileID,
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

          var editImage = [];

          vm.showBilling = true;

            console.log(data.email);

            vm.contact.profileName=data.profileName;
            vm.contact.email=data.email;
            vm.contact.firstName=data.firstName;
            vm.contact.lastName=data.lastName;
            vm.contact.billingAddress.street=data.billingAddress.street;
            vm.contact.billingAddress.city=data.billingAddress.city;            
            vm.contact.billingAddress.state=data.billingAddress.state;
            vm.contact.billingAddress.zip=data.billingAddress.zip;
            vm.contact.billingAddress.country= data.billingAddress.country;
            vm.contact.fax=data.fax;
            vm.contact.mobile=data.mobile;
            vm.contact.phone=data.phone;
            vm.contact.website=data.website;
            vm.contact.status=data.status;
            vm.contact.age=data.age;
            vm.contact.NIC=data.NIC;
            vm.contact.notes=data.notes;
           // vm.contact.country=data.country;

           vm.contact.favouriteStar=favouriteStar;
           vm.contact.favouriteStarNo=favouriteStarNo;


            vm.selectedItem=data.billingAddress.country;

            vm.contact.shippingAddress.s_street=data.shippingAddress.s_street;
            vm.contact.shippingAddress.s_city=data.shippingAddress.s_city;            
            vm.contact.shippingAddress.s_state=data.shippingAddress.s_state;
            vm.contact.shippingAddress.s_zip=data.shippingAddress.s_zip;
           // vm.contact.shippingAddress.s_country= data.shippingAddress.s_country;

            vm.selectedItemShipping=data.shippingAddress.s_country;

            console.log(vm.contact);            


    })
    client.ifError(function(data){ 
    console.log("error loading profile data")
    })
    client.uniqueID(profileID); 
    client.postReq();


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

   function addressChange(){          
              vm.showShipping = !vm.showShipping;
              vm.showBilling = !vm.showBilling;
          }



   vm.allCountries = [];

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




    function editCustomer(val){

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

              if(vm.selectedItem != null)
                vm.contact.billingAddress["country"] = vm.selectedItem.country;
                if(vm.selectedItemShipping != null)
                  if(vm.selectedItemShipping.country == undefined){
                    vm.contact.shippingAddress["s_country"] = vm.selectedItemShipping;
                  }else{
                    vm.contact.shippingAddress["s_country"] = vm.selectedItemShipping.country;
                  }

                var editImage = [];

                vm.contact.profileID= profileID;

                //vm.contact.favouriteStar = false;
                //vm.contact.status = "Active";
               // vm.contact.favouriteStarNo = 1;
                vm.contact.deleteStatus = false;
               // vm.contact.createDate = new Date();
                vm.contact.profileClass = "Supplier";
                vm.contact.profileType = "Supplier";
                vm.contact.modifyDate = new Date();
                


                val.profileLog = {
                        profileID    : profileID,
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

                     // vm.contact.deleteStatus=false;

                      var serviceObj = {
                        "appName" : "Contacts",
                        "permissionType":"edit",
                        "profile" : val,
                        "image" : editImage
                    } 

                    var jasonObj = JSON.stringify(serviceObj);

                    var client =  $serviceCall.setClient("updateProfile","process"); // method name and service
                    client.ifSuccess(function(data){


                      supplierEditService.removeArray(0);
                      supplierEditService.setArray(val);
                       
                       $mdToast.show(
                              $mdToast.simple()
                                .textContent('Supplier Successfully Editted')
                                .position('bottom right')
                                .theme('success-toast')
                                .hideDelay(2000)
                            );
                       $mdDialog.hide(jasonObj);
                      
                  })
                  client.ifError(function(data){ 
                    $mdDialog.show(
                                    $mdDialog.alert()
                                    .parent(angular.element(document.body))
                                    .title('')
                                    .content('error updating')
                                    .ariaLabel('Alert Dialog Demo')
                                    .ok('OK')
                                    .targetEvent()
                                );
                  })
                  
                  client.postReq(jasonObj);

           }

      }

      function cancelDialog(){
        $mdDialog.cancel();
      }
   

    }






  })();


 

