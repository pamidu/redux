(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('recController', recController);

    /** @ngInject */
    function recController($scope, $rootScope, $document, Invoicecopy, $mdDialog, $mdToast, $mdMedia, $serviceCall, $mdSidenav, $state, msApi, Summary, Recurring)
    {
        var vm = this;

        vm.contactColors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg', 'green-bg', 'red-bg'];


        vm.invoiceSummary = Summary.result;

        vm.invoicesRecurring = Recurring.result;

        vm.primaryToolbarContext = true;

        vm.toggleChildStates = toggleChildStates;

        vm.loadingItems = true;

        vm.currentItem = null;

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

        vm.starfunc = starfunc;

         vm.loadRecData = loadRecData;

        vm.defaultCancel = defaultCancel;

        vm.favouriteInvoices = favouriteInvoices;

        vm.editRecInvoice = editRecInvoice;

        vm.cancelRecStatus = cancelRecStatus;

        vm.sortarr = [];


         var page = 1;
            vm.pageObj = {
            service : 'invoice',
            method : 'getRecInvoiceSummaryByQuery',
            body : {
            "where": "deleteStatus = 'false' order by createDate DESC"
            },
            orderby: '',
            isAscending : true
            }
            vm.pageGap = 10;

        //////////

        init().loadSummary();

        /**
         * Initialize
         */
        function init()
        {

          if($state.current.name == "app.invoices.rec.detailView"){
              loadRecData();
          }
          if($state.current.name == "app.invoices.rec.detail"){
              loadRecData();
          }

          var service = {
            loadSummary : loadSummary
          }
          return service;


          function loadSummary(){
             if(vm.invoicesRecurring.length>0){
                for ( var i = 0; i < vm.invoicesRecurring.length; i++ )
                  {
                     vm.invoicesRecurring[i].startDate = new Date( vm.invoicesRecurring[i].startDate); 
                  }
               // Load new items
               vm.items =  vm.invoicesRecurring;  
               console.log(vm.items)
              // Hide the loading screen
              vm.loadingItems = false;

              // Open the item if required
              if ( $state.params.itemId )
              {
                  for ( var i = 0; i < vm.items.length; i++ )
                  {
                      if ( vm.items[i].recurringInvoiceID === $state.params.itemId )
                      {
                          vm.openItem(vm.items[i]);
                          break;
                      }
                  }
              }  
            }
          }
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

            // Assign item as the current item
            vm.currentItem = item;
            
            if(item.status == "Draft"){
              Invoicecopy.setArr(item);
              $state.go('app.invoices.draftRecurringcompose');
            }else{
              $state.go('app.invoices.rec.detail', {itemId: item.recurringInvoiceID});
            }
            

        }

        function cancelRecStatus(){
          var confirm = $mdDialog.confirm()
             .title('Do you wish to cancel Recurring Profle ' + $state.params.itemId + '? ')
             .content('This process is not reversible')
             .ariaLabel('Lucky day')
             .ok('Yes')
             .cancel('No');
         $mdDialog.show(confirm).then(function() {
          vm.inv.status = "Cancelled"
              var recObj = {"recurringInvoice" : vm.inv, "image" :[], "permissionType" : "delete", "appName":"Invoices" };
              //var Invoice = { "permissionType" : "add", "appName":"Invoices"};
              var jsonString = JSON.stringify(recObj);

              var client =  $serviceCall.setClient("updateRecurringInvoice","process");
             client.ifSuccess(function(data){
               vm.orderby = "createDate";
              vm.Isascending = false;
              CheckFullArrayStatus(vm.orderby,vm.isAscending);

              $mdToast.show(
                  $mdToast.simple()
                    .textContent('Invoice Successfully Cancelled')
                    .position('top right' )
                    .hideDelay(3000)
                );

              $state.go('app.invoices.rec');
             });
             client.ifError(function(data){
              console.log("error loading setting data")
             })
             client.uniqueID($state.params.itemId); // send projectID as url parameters
             //client.GRNPattern("GRN0001");
              client.postReq(jsonString);
         })
        }

        /**
         * Close item
         */
        function closeThread()
        {
            vm.currentItem = null;

            setPrimaryToolBar();

            // Update the state without reloading the controller
            $state.go('app.invoices.rec');
            //init().loadSummary();
        }

        /**
         * Return selected status of the item
         *
         * @param item
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
            if ( vm.currentItem )
            {
                vm.currentItem[key] = value;
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
                console.log("zcs")
               
                if (thread.favouriteStarNo == 1)
                thread.favouriteStarNo = 0;

                else if (thread.favouriteStarNo == 0)
                 thread.favouriteStarNo = 1;
              
                thread.favouriteStar = !thread.favouriteStar;
                  var udtateData = {"recurringInvoice" : thread, "image" :[], "permissionType" : "edit", "appName":"Invoices"};
                  var jsonString = JSON.stringify(udtateData);
          
                  var client =  $serviceCall.setClient("updateRecurringInvoice","process");
                 client.ifSuccess(function(data){
                  
                 });
                 client.ifError(function(data){
                  console.log("error ")
                 })
                  client.postReq(jsonString);

                    return;
                }

            // If the current thread is available, do the
            // changes on that one
            if ( vm.currentItem )
            {
                if ( typeof(vm.currentItem[key]) !== 'boolean' )
                {
                    return;
                }

                vm.currentItem[key] = !vm.currentItem[key];
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

         vm.sortarr = [{
      name: "Starred",
      id: "favouriteStarNo",
      src: "img/ic_grade_48px.svg",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    },{
      name: "Draft",
      id: "Draft",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Date",
      id: "Startdate",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Profile No",
      id: "recurringInvoiceID",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Customer",
      id: "profileName",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Amount",
      id: "netAmount",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Billing Frequency",
      id: "billingFrequance",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Occurences",
      id: "occurences",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Draft",
      id: "Draft",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Active",
      id: "status",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Completed",
      id: "status",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }, {
      name: "Cancelled",
      id: "status",
      upstatus: false,
      downstatus: false,
      divider: true,
      close: false
    }]


     vm.latest = '-createDate'; // by default it should be order by date in descending order 
  vm.indexno = 1;

  function starfunc (item, index) { // pass sort object and index number 
      if (item.id === "favouriteStarNo") {
        vm.prodSearch = null;
        item.upstatus == false;
        item.downstatus = false;
        vm.sortarr[vm.indexno].upstatus = false;
        vm.sortarr[vm.indexno].downstatus = false;
        vm.sortarr[vm.indexno].close = false;
        item.close = true;
        vm.indexno = index;
        //SortStarFunc();
       vm.orderby = "!favouriteStarNo";
        vm.Isascending = false;

        CheckFullArrayStatus(vm.orderby,vm.isAscending); 
        // favouriteInvoices(); 

      } else if (item.id == "status") {

        vm.prodSearch = null;
        item.upstatus == false; // hide current up icon
        item.downstatus = false; // hide current down icon
        vm.sortarr[vm.indexno].downstatus = false; // hide previous down icon
        vm.sortarr[vm.indexno].upstatus = false; // hide previous up icon
        vm.sortarr[vm.indexno].close = false; // hide previous close icon
        item.close = true;
        vm.indexno = index;

         getStatus(item.name, item.id);

      }else if(item.id == "Draft"){
         vm.prodSearch = null;
        item.upstatus == false; // hide current up icon
        item.downstatus = false; // hide current down icon
        vm.sortarr[vm.indexno].downstatus = false; // hide previous down icon
        vm.sortarr[vm.indexno].upstatus = false; // hide previous up icon
        vm.sortarr[vm.indexno].close = false; // hide previous close icon
        item.close = true;
        vm.indexno = index;
        LoadDrafts();
      } else {
        if (item.upstatus == false && item.downstatus == false) {
          item.upstatus = !item.upstatus;
          item.close = true;

          if (vm.indexno != index) {
            vm.sortarr[vm.indexno].upstatus = false; // hide previous up icon
            vm.sortarr[vm.indexno].downstatus = false; // hide previous down icon
            vm.sortarr[vm.indexno].close = false; // hide previous close icon
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
            CheckFullArrayStatus(vm.orderby,vm.isAscending); 
          
          
        }
        if (item.downstatus) { 
          vm.orderby = item.id;
          vm.isAscending = false;          
            CheckFullArrayStatus(vm.orderby,vm.isAscending);
          
        }
      }
    }

   function CheckFullArrayStatus (orderby,Isascending){
    var whereClause;
              if (Isascending) 
            whereClause = "deleteStatus = 'false' order by "+orderby+", createDate DESC";
          else
            whereClause = "deleteStatus = 'false' order by "+orderby+" DESC, createDate DESC";          
          
        
        vm.pageObj = {
            service : 'invoice',
            method : 'getRecInvoiceSummaryByQuery',
            body : {
                "where": whereClause
            },
            orderby: '',
            isAscending : ''
        }

        $scope.$broadcast("getPageObj", vm.pageObj);
   }


   function getStatus(name,Isascending){
    var whereClause;
              if (Isascending) 
            whereClause = "deleteStatus = false AND invoiceStatus = '"+name+"' order by createDate DESC";
          else
            whereClause = "deleteStatus = false AND invoiceStatus = '"+name+"' order by createDate DESC";          
          
        
        vm.pageObj = {
            service : 'invoice',
            method : 'getRecInvoiceSummaryByQuery',
            body : {
                "where": whereClause
            },
            orderby: '',
            isAscending : ''
        }

        $scope.$broadcast("getPageObj", vm.pageObj);
   }

   function LoadDrafts(){
     var whereClause;
              // if (Isascending) 
            whereClause = "deleteStatus = false  order by createDate DESC";
          // else
          //   whereClause = "deleteStatus = false  order by createDate DESC";          
    vm.pageObj = {
            service : 'invoice',
            method : 'getRecInvoiceDraftSummaryByQuery',
            body : whereClause,
            orderby: '',
            isAscending : ''
        }

        $scope.$broadcast("getPageObj", vm.pageObj);
   }

   function defaultCancel(item){
    console.log("sad")
    vm.sortarr[vm.indexno].upstatus = false;
   vm.sortarr[vm.indexno].downstatus = false;
    item.close = false;    
        vm.orderby = "createDate",
        vm.isAscending = false;        
        CheckFullArrayStatus(vm.orderby,vm.isAscending);
   }

   vm.removeFilters = removeFilters;

          function removeFilters(){
              vm.items =  vm.invoicesRecurring;
          }


    function GetDataFromService (val){
         vm.pageObj = {
            service : 'invoice',
            method : 'getRecInvoiceSummaryByQuery',
            body : val,
            orderby: '',
            isAscending : ''
        }

        $scope.$broadcast("getPageObj", vm.pageObj);
        }

        function favouriteInvoices(){
            
            GetDataFromService({"where": "deleteStatus = false AND favouriteStar = true order by createDate DESC"});
        
        }

        function loadRecData(){

            vm.primaryToolbarContext = false;
            vm.currentItem  = "ssss";
            
            vm.recInvoice = [];
            LoadSettings()
            var Invoice = { "permissionType" : "add", "appName":"Invoices"};
            var jsonString = JSON.stringify(Invoice);

            var client =  $serviceCall.setClient("getRecurringInvoiceByKey","process");
            client.ifSuccess(function(data){
            var data = data;

            //fillRecview(data)
           vm.inv = {};
           vm.inv = data;
           console.log(vm.inv)
            });
            client.ifError(function(data){
            console.log("error loading setting data")
            })
            client.uniqueID($state.params.itemId); //send projectID as url parameters
            client.postReq(jsonString);
            //===================================================================
            var invData = $serviceCall.setClient("getInvoiceByQuery", "invoice");
            invData.ifSuccess(function(data){
              var data = data;
              console.log(data.result)
              vm.invHistory = data.result;
              // for (var i = data.result.length - 1; i >= 0; i--) {
              //   data.result[i]
              // }
            });
            invData.ifError(function(data){

            });
            invData.skip("0");
            invData.take("10");
            invData.orderby("modifyDate");
            invData.isAscending(false);
            invData.postReq({where :  "recurringInvoiceID = '" + $state.params.itemId +"'"})

            //====================================================================

            //  var client =  $serviceCall.setClient("getRecInvoiceDraftByKey","invoice");
            // client.ifSuccess(function(data){
            // var data = data;

            // //fillRecview(data)
            // vm.rec = {}
            // vm.rec = data;
            // });
            // client.ifError(function(data){
            // console.log("error loading setting data")
            // })
            // client.uniqueID($state.params.itemId); //send projectID as url parameters
            // client.postReq();

         }

        function LoadSettings(){
          var settings = $serviceCall.setClient("getAllByQuery","setting");
            settings.ifSuccess(function(data){
               var profileData = data;
               vm.profData = {};
               
                vm.profData = profileData[0].profile

              if(data[0].profile.companyLogo){
               vm.companylogo = data[0].profile.companyLogo.imageUrl;
               }
               console.log( vm.companylogo)
            });
            settings.ifError(function(data){

            });
            settings.postReq({"setting":"profile"})
        }

         function fillRecview(val){
          val.netAmount = parseFloat(val.netAmount).toFixed(2);
             val.shipping = parseFloat(val.shipping).toFixed(2);
                var calculateDis = 0;
                var totalDiscount = 0;
                var subT = 0
                var itemPrice = 0;

                 vm.products = [];
                vm.products = angular.copy(val.invoiceLines)
                
                 for (var i = vm.products.length - 1; i >= 0; i--) {
                    //itemPrice = parseFloat(vm.products[i].price * vm.products[i].quantity).toFixed(2);
                     subT += parseFloat(vm.products[i].price * vm.products[i].quantity);
                     vm.products[i].price = parseFloat(vm.products[i].price).toFixed(2);
                     val.subTotal =  parseFloat(subT).toFixed(2);
                     vm.products[i].amount = parseFloat(vm.products[i].price * vm.products[i].quantity).toFixed(2);
                     totalDiscount += parseFloat(subT*vm.products[i].discount/100)
                     val.discountAmount = parseFloat(totalDiscount).toFixed(2);
                    
                    }
                    
              val.lastInvoicedetails.lastInvoiceDate = new Date(val.lastInvoicedetails.lastInvoiceDate)
            if(val.status == "Active")
                val.startDate = new Date(val.startDate);
            vm.recInvoice.push(val);
         }
         //=================================================================
         vm.copyRecInvoice = copyRecInvoice;
         function copyRecInvoice(){
          Invoicecopy.setArr(vm.inv);
          $state.go('app.invoices.CopyRecurringcompose')
        }

        function editRecInvoice(){
          Invoicecopy.setArr(vm.inv);
          $state.go('app.invoices.editRecurringcompose')
        }
    }
})();