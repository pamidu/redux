(function ()
{
    'use strict';

    angular
        .module('app.contacts')
        .controller('customerController', customerController);

    /** @ngInject */
    customerController.$inject = ['$scope', '$rootScope', '$document', '$mdDialog', '$mdMedia', '$mdSidenav', '$state', 'msApi', 'Customer','$serviceCall','$mdToast','$stateParams','contactEditService'];

    function customerController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state, msApi, Customer,$serviceCall,$mdToast,$stateParams,contactEditService)
    {
        console.log("Version 6.1.0.17");
        var vm = this;

        vm.contactColors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg', 'green-bg', 'red-bg'];

        vm.customerSummaryData=Customer.result;

        vm.primaryToolbarContext = true;

        vm.toggleChildStates = toggleChildStates;

        vm.loadingItems = false;

        vm.currentThread = null;

        vm.selectedThreads = [];

        vm.openItem = openItem;

        vm.closeThread = closeThread;

        vm.isSelected = isSelected;

        vm.toggleSelectThread = toggleSelectThread;

        vm.selectThreads = selectThreads;

        vm.deselectThreads = deselectThreads;

        vm.toggleSelectThreads = toggleSelectThreads;

        vm.setThreadStatus = setThreadStatus;

        vm.toggleThreadStatus = toggleThreadStatus;

        vm.showAdvancedEditDialog = showAdvancedEditDialog;

        vm.changeStatus = changeStatus;

        vm.starfunc = starfunc;

        vm.ContactDelete = ContactDelete;

        vm.invoice = invoice;

        vm.recurringPRofile = recurringPRofile;

        vm.estimate = estimate;

        vm.creditNote = creditNote;

        vm.payment = payment;

        vm.inventoryIssued = inventoryIssued;

        vm.View360 = View360;

        vm.loadLegerData = loadLegerData;

        //vm.product = product;

        vm.filterFavourite = filterFavourite;

        vm.filterActive = filterActive;

        vm.sortAll = sortAll;

        vm.invoicePaymentLink = invoicePaymentLink;

         vm.pageObj = {
           service : 'profile',
            method : 'getAllByQuery',
            orderby: '',
            isAscending : 'false',
            class : 'Customer',
            body : {
                "where": "deleteStatus = false AND profileClass = 'Customer' order by createDate DESC"
            }
            
        } 

        vm.pageGap=10;
        vm.indexno=1;


        init();

        /**
         * Initialize
         */
        function init()
        {
        
        }

        // function product(val){
        //   var passingDataProduct={
        //         itemID : val.profileID,
        //         profileID : "profile"
        //     }
        //     $state.go('app.products.compose',passingDataProduct);
        // }

        function View360(val){
          var passingData360={
                itemID : val.profileID,
                profileID : "profile"
            }
            $state.go('app.360view',passingData360);
        }

        function invoice(val){        
            var passingDataContact = {
                itemID : val.profileID,
                profileID : "profile"
            }
            
            $state.go('app.invoices.compose',passingDataContact);
        }

        function recurringPRofile(val){        
             var passingDatarecurringPRofile = {
                itemID : val.profileID,
                profileID : "profile"
            }
            $state.go('app.invoices.compose',passingDatarecurringPRofile);
        }

        function estimate(val){        
            var passingDataestimate = {
                itemID : val.profileID,
                profileID : "profile"
            }
              $state.go('app.estimates',passingDataestimate);
        }
      

        function creditNote(val){        
            var passingDatacreditNote = {
                itemID : val.profileID,
                profileID : "profile"
            }
            $state.go('app.creditnotes',passingDatacreditNote);
        }

        function payment(val){        
            var passingData = {
                itemID : val.profileID,
                profileID : "profile"
            }
            $state.go('app.payments.compose',passingData);
        }

        function inventoryIssued(val){        
            var passingDataInventory = {
                itemID : val.profileID,
                profileID : "profile"
            }           
            $state.go('app.inventory.grnCompose',passingDataInventory);
        }


        function invoicePaymentLink(dt){
            if (dt.legerType == "Invoice") {
            var invoice = {
                 itemID : dt.profileID,
                profileID : "profile"
            }
            $state.go('app.invoices.compose',invoice);
            

        } else if (dt.legerType == "Payment") {
            var payment = {
                itemID : dt.profileID,
                profileID : "profile"
            }
            $state.go('app.payments.compose',payment);

        }
        }      


       vm.testarr = [{
            name: "Starred",
            id: "favouriteStarNo",
            src: "img/ic_grade_48px.svg",
            upstatus: false,
            downstatus: false,
            divider: true,
            close: false
          }, {
            //name: vm.sortName,
            name:"Customer",
            id: "profileName",
            upstatus: false,
            downstatus: false,
            divider: false,
            close: false
          }, {
           // name: vm.sortEmail,
            name: "Email",
            id: "email",
            upstatus: false,
            downstatus: false,
            divider: false,
            close: false
          }, 
          // {
          //  // name: vm.sortPerson,
          //   name : "Customer",
          //   id: "firstName",
          //   upstatus: false,
          //   downstatus: false,
          //   divider: true,
          //   close: false
          // },
           {
            name: "Active",
            id: "status",
            upstatus: false,
            downstatus: false,
            divider: false,
            close: false
          }, {
            name: "Inactive",
            id: "status",
            upstatus: false,
            downstatus: false,
            divider: false,
            close: false
          }];


          function starfunc(item, index){
       // pass sort object and index number       
            if (item.id === "favouriteStarNo") { 
                item.upstatus = false;
                item.downstatus = false;
                vm.testarr[vm.indexno].upstatus = false;
                vm.testarr[vm.indexno].downstatus = false;
                vm.testarr[vm.indexno].close = false;
                item.close = true;
                vm.indexno = index; 
                vm.orderby = "favouriteStarNo";
                vm.isAscending = true;
                
                loadAllCustomers(vm.orderby,vm.isAscending);
                
                

              }else if(item.id === "status"){
                item.upstatus == false;     // hide current up icon
                item.downstatus = false;    // hide current down icon
                vm.testarr[vm.indexno].downstatus = false;  // hide previous down icon
                vm.testarr[vm.indexno].upstatus = false;    // hide previous up icon
                vm.testarr[vm.indexno].close = false;       // hide previous close icon
                item.close = true;
                vm.indexno = index;

                vm.orderby = "status";
                if (item.name=="Active") 
                    vm.isAscending = true;
                else if (item.name=="Inactive") 
                    vm.isAscending = false;

               
                loadAllCustomers(vm.orderby,vm.isAscending); 

                
                
              } else {
                if (item.upstatus == false && item.downstatus == false) {
                  item.upstatus = !item.upstatus;
                  item.close = true;

                  if (vm.indexno != index) {
                    vm.testarr[vm.indexno].upstatus = false; // hide previous up icon
                    vm.testarr[vm.indexno].downstatus = false; // hide previous down icon
                    vm.testarr[vm.indexno].close = false; // hide previous close icon
                    vm.indexno = index;
                  }
                } else {
                  item.upstatus = !item.upstatus;
                  item.downstatus = !item.downstatus;
                  item.close = true;
                } 

                if (item.upstatus) { 
                  vm.orderby = item.id;
                  vm.isAscending = true;
                 
                  loadAllCustomers(vm.orderby,vm.isAscending);

                  
                  
                  vm.sortSelected = true;
                }
                if (item.downstatus) { 
                  vm.orderby = item.id;
                  vm.isAscending = false;
                 
                loadAllCustomers(vm.orderby,vm.isAscending);                
                  
                  vm.sortSelected = false;
                }
              }

            }
            // sort function end 


            function loadAllCustomers(orderby,Isascending){
               var whereClause;
              if (orderby == "" || orderby == "createDate"){
                if (vm.sortSelected)
                  whereClause = "deleteStatus = 'false' order by createDate";
                else
                  whereClause = "deleteStatus = 'false' order by createDate DESC";
              }
              else{
                if (Isascending) 
                  whereClause = "deleteStatus = 'false' order by "+orderby+", createDate DESC";
                else
                  whereClause = "deleteStatus = 'false' order by "+orderby+" DESC, createDate DESC";       
              }
              vm.pageObj = {
                service : 'profile',
                method : 'getAllByQuery',
                body : {
                    "where": whereClause
                },
                orderby: '',
                isAscending : ''
        }

        $scope.$broadcast("getPageObj", vm.pageObj);

        }

        function defaultCancel(item) {
        
          vm.testarr[vm.indexno].upstatus = false;
          vm.testarr[vm.indexno].downstatus = false;
          item.close = false;    
          vm.orderby = "createDate",
          vm.isAscending = false;       
          loadAllCustomers(vm.orderby,vm.isAscending);        
      }


      function favouriteFunction(favFuncForm){
          
        // change the favouriteStar to  opposite boolean value 
        // change the favouriteStarNo 1 or 0 
        if (favFuncForm.favouriteStarNo == 1)
            favFuncForm.favouriteStarNo = 0;

        else if (favFuncForm.favouriteStarNo == 0)
            favFuncForm.favouriteStarNo = 1;

        favFuncForm.favouriteStar = !favFuncForm.favouriteStar;


        favFuncForm.profileLog = {
            profileID: "",
            logID: "-888",
            type: "",
            description: "",
            UIHeight: "",
            status: "",
            userName: "",
            lastTranDate: "",
            createDate: "",
            modifyDate: "",
            createUser: "",
            modifyUser: ""
        }

        var favFuncObj = {
            "appName": "Contacts",
            "permissionType": "edit",
            "profile": favFuncForm,
            "image": favFuncForm.image
        }

        var jsonString = JSON.stringify(favFuncObj);


        var client =  $serviceCall.setClient("updateProfile","process"); // method name and service
        client.ifSuccess(function(data){   
              if (favFuncForm.favouriteStar) {
                var toast = $mdToast.simple()
                    .content('Add To Favourite')
                    .action('OK')
                    .highlightAction(false)
                    .position("bottom right");
                favFuncForm.favouriteStarNo = 0;
                $mdToast.show(toast).then(function() {});
            } else {
                var toast = $mdToast.simple()
                    .content('Remove from Favourite')
                    .action('OK')
                    .highlightAction(false)
                    .position("bottom right");
                favFuncForm.favouriteStarNo = 1;
                $mdToast.show(toast).then(function() {});
            }
        })
        client.ifError(function(data){ 
         console.log(data)
            var toast = $mdToast.simple()
                .content('Error Occure while Adding to Favourite')
                .action('OK')
                .highlightAction(false)
                .position("bottom right");
            $mdToast.show(toast).then(function() {});
        })
        
        client.postReq(jsonString);
      }

      function filterFavourite(){   

        var whereClause = "favouriteStarNo = '0' AND profileClass = 'Customer' order by lastTranDate DESC"

        vm.pageObj = {
            service : 'profile',
            method : 'getAllByQuery',
            body : {"where" : whereClause},
            orderby: '',
            isAscending : ''
        }

        $scope.$broadcast("getPageObj", vm.pageObj)


      }

      function filterActive(){

        var whereClause = "status = 'Active' AND profileClass = 'Customer' order by lastTranDate DESC"

        vm.pageObj = {
            service : 'profile',
            method : 'getAllByQuery',
            body : {"where" : whereClause},
            orderby: '',
            isAscending : ''
        }

        $scope.$broadcast("getPageObj", vm.pageObj)

      }

      function sortAll(){

            var whereClause = "profileClass = 'Customer' order by lastTranDate DESC"

            vm.pageObj = {
                service : 'profile',
                method : 'getAllByQuery',
                body : {"where" : whereClause},
                orderby: '',
                isAscending : ''
            }

            $scope.$broadcast("getPageObj", vm.pageObj)
            
            }


              //_______________Change status of the contact______________________________________________

    function changeStatus(statusChangeForm){
    
                if (statusChangeForm.status == "Active") {
                    statusChangeForm.status = "Inactive";
                }
                else if (statusChangeForm.status == "Inactive") {
                    statusChangeForm.status = "Active";
                }
            

            statusChangeForm.profileLog = {
                profileID: "",
                logID: "-888",
                type: "",
                description: "",
                UIHeight: "",
                status: "",
                userName: "",
                lastTranDate: "",
                createDate: "",
                modifyDate: "",
                createUser: "",
                modifyUser: ""
            }

            var statusObj = {
                "appName": "Contacts",
                "permissionType": "edit",
                "profile": statusChangeForm,
                "image": statusChangeForm.image
            }

            //changeStatus(statusChangeForm);
            var jsonString = JSON.stringify(statusObj);



            var client =  $serviceCall.setClient("updateProfile","process"); // method name and service
            client.ifSuccess(function(data){  
            })
            client.ifError(function(data){ 
              $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Error Occure while changing the status')
                    .ariaLabel('')
                    .ok('OK')
                    .targetEvent()
                );
                //changeStatus(obj);
            })
            client.postReq(jsonString);
        }
        //================================================================================================

    //___________________________DELETE CONTACT________________________________________________________
    function ContactDelete(deleteform, ev){

        var confirm = $mdDialog.confirm()
            .parent(angular.element(document.body))
            .title('')
            .content('Are You Sure You Want To Delete This Record? This process is not reversible')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {

            deleteform.profileLog = {
                profileID: "",
                logID: "-888",
                type: "",
                description: "",
                UIHeight: "",
                status: "",
                userName: "",
                lastTranDate: "",
                createDate: "",
                modifyDate: "",
                createUser: "",
                modifyUser: ""
            }
            var serviceObj = {
                "appName": "Contacts",
                "permissionType": "delete",
                "profile": deleteform,
                "image": deleteform.image
            }
            deleteform.deleteStatus = true;
            var jsonString = JSON.stringify(serviceObj);
            console.log(serviceObj);
            if (deleteform.status == "Inactive") {



            var client =  $serviceCall.setClient("updateProfile","process"); // method name and service
            client.ifSuccess(function(data){
              $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .content('Record Successfully Deleted')
                        .ariaLabel('')
                        .ok('OK')
                        .targetEvent()
                    );
                    $state.go($state.current, {}, {
                        reload: true
                    });  
            })
            client.ifError(function(data){ 
               $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.body))
                        .content('Error Occured while deleting contact')
                        .ariaLabel('')
                        .ok('OK')
                        .targetEvent()
                    );
            })
            client.postReq(jsonString);

            } else {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('')
                    .content('Unable to delete customer due to transactions. Please inactivate to disable for future transactions.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                );
            }
        })
    }


function showAdvancedEditDialog(ev, uniqueID, favouriteStarNo, favouriteStar){
  
    $mdDialog.show({
      controller: 'DialogControllerEditCustomer',
      controllerAs: 'vm',
      templateUrl: 'app/main/contacts/dilaogs/editDialogBoxCustomer.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      locals:{
        profileID : uniqueID,
        favouriteStar : favouriteStar,
        favouriteStarNo : favouriteStarNo
      }
      
    })
    .then(function(answer) {
      //$scope.status = 'You said the information was "' + answer + '".';



    }, function() {
      
    });
  };

  function loadSettingDataForLeger(){
     var client = $serviceCall.setClient("getAllByQuery","setting");
            client.ifSuccess(function(data){
                console.log(data[0].profile);

                var profileData=data[0].profile;

                vm.companyName=profileData.companyName;
                vm.street=profileData.street;
                vm.city=profileData.city;
                vm.state=profileData.state;
                vm.country=profileData.country;
                vm.phoneNo=profileData.phoneNo;
                vm.website=profileData.website;
                vm.adminEmail=profileData.adminEmail;
                vm.baseCurrency=profileData.baseCurrency;

                vm.companylogo = data[0].profile.companyLogo.imageUrl;

                               
            });
            client.ifError(function(data){

            });
            client.postReq({"setting":"profile"})

  }

  function loadProfileDataForLerger(){
        var client =  $serviceCall.setClient("getProfileByKey","profile"); // method name and service
       client.ifSuccess(function(data){  
        console.log(data);
      

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
            "image"           : []
          }

          var editImage = [];
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
            vm.contact.billingAddress=data.billingAddress; 
                  


    })
    client.ifError(function(data){ 
    console.log("error loading profile data")
    })
    client.uniqueID($state.params.itemID); 
    client.postReq();
  }

  function loadLegerDataForLeger(){
        vm.legerDetail = [];
        var client =  $serviceCall.setClient("getLegerAllByProfile","leger");
        client.ifSuccess(function(data){   

            var data = data;   
            vm.invoices=data.invoices.toFixed(2);
            vm.payments=data.payments.toFixed(2);
            vm.credits=data.credits.toFixed(2);
            vm.balanceBF=data.balanceBF.toFixed(2);
            vm.balanceDue=data.balanceDue.toFixed(2);
            vm.dateFrom=data.dateFrom;
            vm.dateTo=data.dateTo;
            vm.legerDetail = data.detail;
            console.log(vm.legerDetail);
            vm.customerSummary = data.summary;
            vm.periodDate = data;                   

        })
        client.ifError(function(data){ 
             console.log(data)
            $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.body))
                .title()
                .content('There was an error retreving the data.')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                .targetEvent()
            );
        })
        client.uniqueID($state.params.itemID);
        client.skip(0);
        client.take(10);
        client.postReq();
  }

   function loadLegerData(){
    loadSettingDataForLeger();
    loadLegerDataForLeger();
    loadProfileDataForLerger();
   }


        function setPrimaryToolBar(){
            vm.primaryToolbarContext = !vm.primaryToolbarContext;
        };

        function toggleChildStates(toggledState){
            $state.go(toggledState);
        };

        function openItem(item)
        {
            // Set the read status on the item
            // item.read = true;

            setPrimaryToolBar();

            // Assign thread as the current thread
            vm.currentThread = item;

            $state.go('app.contacts.customer.detail', {
                itemID : item.profileID,
                status : item.profileClass
            });

        }

        /**
         * Close thread
         */
        function closeThread()
        {
            vm.currentThread = null;

            setPrimaryToolBar();

            // Update the state without reloading the controller
            $state.go('app.contacts.customer');
        }

        /**
         * Return selected status of the thread
         *
         * @param thread
         * @returns {boolean}
         */
        function isSelected(thread)
        {
            return vm.selectedThreads.indexOf(thread) > -1;
        }

        /**
         * Toggle selected status of the thread
         *
         * @param thread
         * @param event
         */
        function toggleSelectThread(thread, event)
        {
            if ( event )
            {
                event.stopPropagation();
            }

            if ( vm.selectedThreads.indexOf(thread) > -1 )
            {
                vm.selectedThreads.splice(vm.selectedThreads.indexOf(thread), 1);
            }
            else
            {
                vm.selectedThreads.push(thread);
            }
        }

        /**
         * Select threads. If key/value pair given,
         * threads will be tested against them.
         *
         * @param [key]
         * @param [value]
         */
        function selectThreads(key, value)
        {
            // Make sure the current selection is cleared
            // before trying to select new threads
            vm.selectedThreads = [];

            for ( var i = 0; i < vm.items.length; i++ )
            {
                if ( angular.isUndefined(key) && angular.isUndefined(value) )
                {
                    vm.selectedThreads.push(vm.items[i]);
                    continue;
                }

                if ( angular.isDefined(key) && angular.isDefined(value) && vm.items[i][key] === value )
                {
                    vm.selectedThreads.push(vm.items[i]);
                }
            }
        }

        /**
         * Deselect threads
         */
        function deselectThreads()
        {
            vm.selectedThreads = [];
        }

        /**
         * Toggle select threads
         */
        function toggleSelectThreads()
        {
            if ( vm.selectedThreads.length > 0 )
            {
                vm.deselectThreads();
            }
            else
            {
                vm.selectThreads();
            }
        }

        /**
         * Set the status on given thread, current thread or selected threads
         *
         * @param key
         * @param value
         * @param [thread]
         * @param [event]
         */
        function setThreadStatus(key, value, thread, event)
        {
            // Stop the propagation if event provided
            // This will stop unwanted actions on button clicks
            if ( event )
            {
                event.stopPropagation();
            }

            // If the thread provided, do the changes on that
            // particular thread
            if ( thread )
            {
                thread[key] = value;
                return;
            }

            // If the current thread is available, do the
            // changes on that one
            if ( vm.currentThread )
            {
                vm.currentThread[key] = value;
                return;
            }

            // Otherwise do the status update on selected threads
            for ( var x = 0; x < vm.selectedThreads.length; x++ )
            {
                vm.selectedThreads[x][key] = value;
            }
        }




        /**
         * Toggle the value of the given key on given thread, current
         * thread or selected threads. Given key value must be boolean.
         *
         * @param key
         * @param thread
         * @param event
         */
        function toggleThreadStatus(key, thread, event)
        {

            favouriteFunction(thread);
            //changeStatus(thread);
            // Stop the propagation if event provided
            // This will stop unwanted actions on button clicks
            if ( event )
            {
                event.stopPropagation();
            }

            // If the thread provided, do the changes on that
            // particular thread
            if ( thread )
            {
                if ( typeof(thread[key]) !== 'boolean' )
                {
                    return;
                }

                thread[key] = !thread[key];
                return;
            }

            // If the current thread is available, do the
            // changes on that one
            if ( vm.currentThread )
            {
                if ( typeof(vm.currentThread[key]) !== 'boolean' )
                {
                    return;
                }

                vm.currentThread[key] = !vm.currentThread[key];
                return;
            }

            // Otherwise do the status update on selected threads
            for ( var x = 0; x < vm.selectedThreads.length; x++ )
            {
                if ( typeof(vm.selectedThreads[x][key]) !== 'boolean' )
                {
                    continue;
                }

                vm.selectedThreads[x][key] = !vm.selectedThreads[x][key];
            }
        }
    }
})();


  angular
  .module('app.contacts')
  .factory('contactEditService', contactEditService);
    contactEditService.$inject = [];

    function contactEditService(){

        var contactArray=[];

        return {
            setArray: function(newVal) {
                contactArray.push(newVal);
                return contactArray;
            },
            removeArray: function(newVals) {
                contactArray.splice(newVals, 1);
                return contactArray;
            },
            getArray: function(){
                return contactArray;
            }
        }
    }