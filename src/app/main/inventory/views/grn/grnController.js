(function ()
{
    'use strict';

    angular
        .module('app.inventory')
        .controller('inventoryController', inventoryController);

    /** @ngInject */
    function inventoryController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state, msApi, Received,$serviceCall,$mdToast,$stateParams)
    {
        console.log("Version 6.1.3");
        var vm = this;

        vm.contactColors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg', 'green-bg', 'red-bg'];

        vm.inventoryGRN=Received.result;
        console.log(Received.result);

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

        vm.defaultCancel=defaultCancel;

        vm.starfunc = starfunc;

        vm.loadGRNdetail = loadGRNdetail;

        vm.SeparateAddress = SeparateAddress;

        vm.InventoryObject = InventoryObject;

        vm.deleteInventory = deleteInventory;


        // controller 

        vm.pageObj = {
           service : 'inventory',
            method : 'getGRNSummaryByQuery',
            body : {
                "where": "deleteStatus = 'false' order by 'createdDate'"
            },
            orderby: '',
            isAscending : ''
        } 

        vm.pageGap=10;
        vm.indexno=1;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
        
        }

        function InventoryObject(callback) {
            var InventoryObject = {
                AddressOne: vm.AddressOne,
                AddressTwo: vm.AddressTwo,
                AddressThree: vm.AddressThree,
                AddressFour: vm.AddressFour
            }
            callback(InventoryObject);
        }

        function SeparateAddress(Address) {
            vm.AddressArr = [];
            vm.AddressArr = Address.split(",");
            vm.AddressOne = vm.AddressArr[0];
            vm.AddressTwo = vm.AddressArr[1];
            vm.AddressThree = vm.AddressArr[2];
            vm.AddressFour = vm.AddressArr[3];
        }

        function loadGRNdetail(){ 

            console.log($state.params)     
            vm.historyType = "GRN";

            var client =  $serviceCall.setClient("getGRNByKey","inventory"); 
            client.ifSuccess(function(data){
                console.log("in success");
               // commentfunc.loadComments()
               var lineItems;

                vm.ViewInventory = [];
                vm.ViewInventory.push(data);
                console.log(vm.ViewInventory[0].itemDetails);
                
                vm.NoteType = "RECEIVED";
                vm.InventoryType = "GRN NO.";
                vm.InventoryTypeValue = data.GRNno;
                var customerNames=data.customerNames;
                vm.email=data.email;
                vm.billAddress=data.billAddress;
                
                vm.lineItems=vm.ViewInventory[0].itemDetails;

                 data.createdDate = new Date(data.createdDate)
                 vm.date=data.createdDate;
                
                

                if (isNaN(data.billAddress))
                    vm.FullAddress = "";

                if (isNaN(data.shipAddress))
                    vm.FullAddress = "";
                

                if (data.addressType == "Address") {
                    vm.FullAddress = data.billAddress;
                } else if (data.addressType == "Shipping Address") {
                    vm.FullAddress = data.shipAddress;
                };

                if (vm.FullAddress) {
                    SeparateAddress(vm.FullAddress);
                };  
                
                var cusNamesAutoArr=[];
                var cusNamesAutoArr=customerNames.split(" ");
                var cusNamesAutoArrOne=cusNamesAutoArr[0];
                var cusNamesAutoArrTwo= cusNamesAutoArr[1];
                var cusNamesAutoArrThree= cusNamesAutoArr[2];
                var cusNamesAutoArrFour= cusNamesAutoArr[3];
                var cusNamesAutoArrFive= cusNamesAutoArr[4];

                console.log(cusNamesAutoArrOne);
                if (cusNamesAutoArrOne == "AutoGRN") {
                    vm.customerNamesBindAuto = data.customerNames;
                    vm.customerNamesBind="";
                }else{
                    vm.customerNamesBind=data.customerNames;
                }
                
            })
            client.ifError(function(data){ 
                console.log("error loading data");
            })
            client.uniqueID($state.params.itemID); 
            client.postReq();    
        }


    vm.testarr = [{
      name: "Starred",
      id: "favouriteStarNo",
      Intype: "GRN",
      src: "img/ic_grade_48px.svg",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Date",
      id: "createdDate"
        ,
      upstatus: false,
      downstatus: false,
      divider: false,
      close: false
    }, {
      name: "GRNno",
      id: "GRNno"
        ,
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    },{
      name:"Customer",
      id: "customerNames"
        ,
      upstatus: false,
      downstatus: false,
      divider: false,
      close: false
    },
    {
      name: "Cancelled",
      id: "cancelStatus"
        ,
      upstatus: false,
      downstatus: false,
      divider: false,
      close: false
    }];
  



    function starfunc(item, index){
 

      if (item.id === "favouriteStarNo") { 
        item.upstatus == false;
        item.downstatus = false;
        vm.testarr[vm.indexno].upstatus = false;
        vm.testarr[vm.indexno].downstatus = false;
        vm.testarr[vm.indexno].close = false;
        item.close = true;
        vm.indexno = index; 
        vm.orderby = "favouriteStarNo";

        vm.isAscending = true;        
        loadAllInventoryGRN(vm.orderby,vm.isAscending);
        
        
      }else if(item.id === "cancelStatus"){
        item.upstatus == false;     // hide current up icon
        item.downstatus = false;    // hide current down icon
        vm.testarr[vm.indexno].downstatus = false;  // hide previous down icon
        vm.testarr[vm.indexno].upstatus = false;    // hide previous up icon
        vm.testarr[vm.indexno].close = false;       // hide previous close icon
        item.close = true;
        vm.indexno = index;
        vm.orderby = "cancelStatus";
        vm.isAscending = false;        
        loadAllInventoryGRN(vm.orderby,vm.isAscending); 

        
        
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
            loadAllInventoryGRN(vm.orderby,vm.isAscending); 
          
          
        }
        if (item.downstatus) { 
          vm.orderby = item.id;
          vm.isAscending = false;          
            loadAllInventoryGRN(vm.orderby,vm.isAscending);
          
        }
      }
    }

    function loadAllInventoryGRN(orderby,isAscending){
        var whereClause;
        if (orderby == "" || orderby == "createdDate"){
          if (isAscending)
            whereClause = "deleteStatus = 'false' order by createdDate";
          else
            whereClause = "deleteStatus = 'false' order by createdDate DESC";
        }
        else{
          if (isAscending) 
            whereClause = "deleteStatus = 'false' order by "+orderby+", createdDate DESC";
          else
            whereClause = "deleteStatus = 'false' order by "+orderby+" DESC, createdDate DESC";       
        }
        vm.pageObj = {
            service : 'inventory',
            method : 'getGRNSummaryByQuery',
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
        vm.orderby = "createdDate",
        vm.isAscending = false;       
        loadAllInventoryGRN(vm.orderby,vm.isAscending);
        
  }

  function deleteInventory(deleteform){
            console.log(deleteform);
            deleteform[0].deleteStatus = true;

        var confirm = $mdDialog.confirm()
            .title('Are you sure you wish to proceed')
            .content('This process is not reversible')
            .targetEvent()
            .ok("OK")
            .cancel("Cancel")
        $mdDialog.show(confirm).then(function() {

        // deleteform.inventoryLog = {
        //     inventoryID    : "",
        //     logID        : "-888",
        //     type         : "",
        //     description  : "created by",
        //     UIHeight     : "",
        //     status       : "",
        //     userName     : "",
        //     lastTranDate : "",
        //     createDate   : "",
        //     modifyDate   : "",
        //     createUser   : "",
        //     modifyUser   : ""
        //   }

        var serviceObj = {
            "appName" : "Inventory",
            "permissionType":"delete",
            "inventory" : deleteform[0],
            "image" : ""
          } 
        
        var jsonString = JSON.stringify(serviceObj);

        var client =  $serviceCall.setClient("updateInventory","process"); // method name and service
        client.ifSuccess(function(data){
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Inventory Successfully deleted.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent());
         //$state.go("home.receipt");  
        })
        client.ifError(function(data){ 
        $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('There was an error deleting the data.').ariaLabel('Alert Dialog Demo').ok('OK').targetEvent());
           
        })
        
        client.postReq(jsonString);



        }, function() {}

        )
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

            $state.go('app.inventory.grn.detail', {
                itemID : item.GRNno,
                status : item.inventoryClass
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
            $state.go('app.inventory.grn');
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

    function favouriteFunction(favFuncForm) {

    favFuncForm.GRNno = favFuncForm.GRNno.toString();
    

      if (favFuncForm.favouriteStarNo == 1) {
        favFuncForm.favouriteStarNo = 0;
      } else if (favFuncForm.favouriteStarNo == 0) {
        favFuncForm.favouriteStarNo = 1;
      };

      favFuncForm.inventoryFavourite = !favFuncForm.inventoryFavourite;
      favFuncForm.inventoryClass={inventoryClass:"GRN"};
      // favFuncForm.inventoryLog = {
      //   inventoryID: "",
      //   logID: "-888",
      //   type: "",
      //   description: "",
      //   UIHeight: "",
      //   status: "",
      //   userName: "",
      //   lastTranDate: "",
      //   createDate: "",
      //   modifyDate: "",
      //   createUser: "",
      //   modifyUser: ""
      // }



      var favFuncObj = {
        "appName": "Inventory",
        "permissionType": "edit",
        "inventory": favFuncForm,
        "image": favFuncForm.image
      }
      favFuncObj.inventory.inventoryClass = "GRN";
      var jsonString = JSON.stringify(favFuncObj);

      var client = $serviceCall.setClient("updateInventory", "process"); // method name and service
      client.ifSuccess(function(data) {
        if (favFuncForm.inventoryFavourite) {
          favFuncForm.favouriteStarNo = 0;
          var toast = $mdToast.simple().content('Add To Favourite').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function() {});
          //obj.favouriteStarNo = 0;
        } else if (!(favFuncForm.inventoryFavourite)) {
          favFuncForm.favouriteStarNo = 1;
          var toast = $mdToast.simple().content('Remove from Favourite').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function() {});
          //obj.favouriteStarNo = 1;
        };
      })
      client.ifError(function(data) {
        var toast = $mdToast.simple().content('Error Occure while Adding to Favourite').action('OK').highlightAction(false).position("bottom right");
        $mdToast.show(toast).then(function() {

        });
      })

      client.postReq(jsonString);

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