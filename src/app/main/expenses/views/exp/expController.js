(function ()
{
	'use strict';

	angular
	.module('app.expenses')
	.controller('expController', expController);

	/** @ngInject */
	function expController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state, $mdToast, msApi, expenseGetAll,$serviceCall,settingSummary)
	{
    console.log('V 6.0.0.6');

    var vm = this;

    vm.contactColors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg', 'green-bg', 'red-bg'];

    vm.expenseSummary = expenseGetAll.result;

    console.log(vm.expenseSummary);

    vm.settingSummary = settingSummary;

    console.log(vm.settingSummary[0].profile.baseCurrency);
    vm.baseCurrency=vm.settingSummary[0].profile.baseCurrency;

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

    vm.resetAllExpenses=resetAllExpenses;

    vm.favouriteExpenses=favouriteExpenses;

    vm.cancelStatus=cancelStatus;

    vm.expensesDelete=expensesDelete;

    vm.all=all;

    vm.paidExpense=paidExpense;

    vm.searchText = "";
    vm.markAs="";
        vm.indexno = 1; // by default it should be order by date in descending order
        vm.DefaultCancel=DefaultCancel;
        vm.starfunc=starfunc;
        vm.testarr=[];
        vm.orderby = "date",
        vm.isAscending = false;
        var page = 1;

        function all(){
          loadAllExpenses('date',false);
        };

        function paidExpense(){
         if(page == 1){
          page = 0;
          vm.pageObj = {
            service : 'expense',
            method : 'getExpenseSummaryByQuery',
            body : {
             "where":"deleteStatus = false AND status = 'Paid' order by date DESC"
           },
           orderby: 'date',
           isAscending : false
         }
         $scope.$broadcast("getPageObj", vm.pageObj);
       }else{
         page = 1;
         loadAllExpenses('date',false);
       };
     };


     vm.testarr = [{
      name: "Starred"
      , id: "favouriteStarNo"
      , src: "img/ic_grade_48px.svg"
      ,upstatus: false
      ,downstatus: false
      ,divider: true
      ,close: false
    }, {
      name: "Date"
      , id: "date"
      ,upstatus: false
      ,downstatus: true
      ,divider: true
      ,close: true
    }, {
      name: "Category"
      , id: "category"
      ,upstatus: false
      ,downstatus: false
      ,divider: false
      ,close: false
    }, {
      name: "Amount"
      , id: "totalValue"
      ,upstatus: false
      ,downstatus: false
      ,divider: false
      ,close: false
    }, {
      name: "Expense No"
      , id: "expenseID"
      ,upstatus: false
      ,downstatus: false
      ,divider: false
      ,close: false
    }, {
      name: "Non-Billable"
      , id: "billable"
      ,upstatus: false
      ,downstatus: false
      ,divider: false
      ,close: false
    }, {
      name: "Billable"
      , id: "billable"
      ,upstatus: false
      ,downstatus: false
      ,divider: false
      ,close: false
    }, {
      name: "Billed"
      , id: "billable"
      ,upstatus: false
      ,downstatus: false
      ,divider: false
      ,close: false
    }, {
      name: "Paid"
      , id: "status"
      ,upstatus: false
      ,downstatus: false
      ,divider: true
      ,close: false
    }, {
      name: "Unpaid"
      , id: "status"
      ,upstatus: false
      ,downstatus: false
      ,divider: true
      ,close: false
    }, {
      name: "Cancelled"
      , id: "status"
      ,upstatus: false
      ,downstatus: false
      ,divider: true
      ,close: false
    }];

    vm.pageObj = {
      service : 'expense',
      method : 'getExpenseSummaryByQuery',
      body : {
        "where": "deleteStatus = 'false' order by 'date'"
      },
      orderby: 'date',
      isAscending : ''
    }
    vm.pageGap = 10;

function resetAllExpenses(){//reset expense data as it is

}

function DefaultCancel(item){
 vm.testarr[1].close = true;
 vm.testarr[vm.indexno].upstatus = false;
 vm.testarr[vm.indexno].downstatus = false;
 item.close = false; 
 vm.indexno = 1; 
 loadAllExpenses(vm.orderby,vm.isAscending);
}

//favouriteStar update
function startFunction(obj){

 if (obj.favouriteStarNo == 1 ) {
  obj.favouriteStarNo = 0;
}
else if (obj.favouriteStarNo == 0){
  obj.favouriteStarNo = 1;
}
obj.expenseID = obj.expenseID;
obj.favouriteStar = !obj.favouriteStar;

var expenseObj = {
  "expense" : obj,
  "image" : "",
  "appName":"Expenses",
  "permissionType" : "edit"
} 
var jsonString = JSON.stringify(expenseObj)

var client =  $serviceCall.setClient("updateExpense","process");
client.ifSuccess(function(data){
  if (obj.favouriteStar) {
    var toast = $mdToast.simple().content('Add To Favourite').action('OK').highlightAction(false).position("bottom right");
    $mdToast.show(toast).then(function() {});
  } else if (!obj.favouriteStar) {
    var toast = $mdToast.simple().content('Remove from Favourite').action('OK').highlightAction(false).position("bottom right");
    $mdToast.show(toast).then(function() {});
  };
});
client.ifError(function(data){
  $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Error Occure while Adding to Favourite').ariaLabel('').ok('OK').targetEvent(data));
})
client.postReq(jsonString);

}


    // pass sort object and index number
    function starfunc(item, index){ 
      console.log(item);
      if (item.id =="favouriteStarNo") { 
        item.upstatus == false;
        item.downstatus = false;
        vm.testarr[vm.indexno].upstatus = false;
        vm.testarr[vm.indexno].downstatus = false;
        vm.testarr[vm.indexno].close = false;
        item.close = true;
        vm.indexno = index; 
        vm.orderby = "favouriteStarNo";
        vm.isAscending = true;
        loadAllExpenses(vm.orderby,vm.isAscending);

      } 
      else if (item.id == "billable" || item.id == "status") {

        item.upstatus == false; // hide current up icon
        item.downstatus = false; // hide current down icon
        vm.testarr[vm.indexno].downstatus = false; // hide previous down icon
        vm.testarr[vm.indexno].upstatus = false; // hide previous up icon
        vm.testarr[vm.indexno].close = false; // hide previous close icon
        item.close = true;
        vm.indexno = index;
        vm.orderby = item.id;
        vm.isAscending = false;
        //loadAllExpenses(vm.orderby,vm.isAscending);
        if(item.id=="status"){
          vm.pageObj = {
            service : 'expense',
            method : 'getExpenseSummaryByQuery',
            body : {
             "where":"deleteStatus = false AND status = '"+item.name+"' order by date DESC"
           },
           orderby: 'date',
           isAscending : vm.isAscending
         }
         $scope.$broadcast("getPageObj", vm.pageObj);
       }
       if(item.id=="billable"){
        vm.pageObj = {
          service : 'expense',
          method : 'getExpenseSummaryByQuery',
          body : {
           "where":"deleteStatus = false AND  billable = '"+item.name+"' order by date DESC"
         },
         orderby: 'date',
         isAscending : vm.isAscending
       }
       $scope.$broadcast("getPageObj", vm.pageObj);

     }


   }
   else {
    if (item.upstatus == false && item.downstatus == false) {
      item.upstatus = !item.upstatus;
      item.close = true;

      if ($scope.indexno != index) {
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
          loadAllExpenses(vm.orderby,vm.isAscending);

        }
        if (item.downstatus) { 
          vm.orderby = item.id;
          vm.isAscending = false;
          loadAllExpenses(vm.orderby,vm.isAscending);

        }
      }

    }


    function loadAllExpenses(orderby,isAscending){
      var whereClause;
      if (orderby == "" || orderby == "date"){
        if (isAscending)
          whereClause = "deleteStatus = 'false' order by date";
        else
          whereClause = "deleteStatus = 'false' order by date DESC";
      }
      else{
        if (isAscending) 
          whereClause = "deleteStatus = 'false' order by "+orderby+", date DESC";
        else
          whereClause = "deleteStatus = 'false' order by "+orderby+" DESC, date DESC";       
      }

      vm.pageObj = {
        service : 'expense',
        method : 'getExpenseSummaryByQuery',
        body : {
          "where": whereClause
        },
        orderby: '',
        isAscending : ''
      }

      $scope.$broadcast("getPageObj", vm.pageObj);
    }

    function loadAllExpensewithBody(body){

      vm.pageObj = {
        service : 'expense',
        method : 'getExpenseSummaryByQuery',
        body : body,
        orderby: '',
        isAscending : ''
      }

      $scope.$broadcast("getPageObj", vm.pageObj);

    }

//sort favoutite expense 
function favouriteExpenses(){
  if(page == 1){
    page = 0;

    loadAllExpensewithBody({"where": "deleteStatus = false AND favouriteStar = true order by createDate DESC"});
  }else{
   page = 1;
   loadAllExpenses('date',false);
 };
}

//cancel expense
function cancelStatus(obj){

  obj.status = "Cancelled";

  var expenseObj = {
    "expense" : obj,
    "image" : "",
    "appName":"Expenses",
    "permissionType" : "cancel"
  } 

  var jsonString = JSON.stringify(expenseObj)

  var client =  $serviceCall.setClient("updateExpense","process");
  client.ifSuccess(function(data){
    if (obj.status) {
      var toast = $mdToast.simple().content('Status Change to '+obj.status+'').action('OK').highlightAction(false).position("bottom right");
      $mdToast.show(toast).then(function() {});
      loadAllExpenses('date',false);
    } 
  });
  client.ifError(function(data){
    $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Error Occure while change status').ariaLabel('').ok('OK').targetEvent(data));
  })
  client.postReq(jsonString);
}

//delete expense
function expensesDelete(obj){

  obj.deleteStatus = true;

  var expenseObj = {
    "expense" : obj,
    "image" : "",
    "appName":"Expenses",
    "permissionType" : "delete"
  } 

  var jsonString = JSON.stringify(expenseObj)

  var client =  $serviceCall.setClient("updateExpense","process");
  client.ifSuccess(function(data){
    if (obj) {
      var toast = $mdToast.simple().content('Expense Successfully Deleted').action('OK').highlightAction(false).position("bottom right");
      $mdToast.show(toast).then(function() {});
      $state.go('app.expenses');
      loadAllExpenses('date',false);
    } 
  });
  client.ifError(function(data){
    $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).content('Error Occure while delete expense').ariaLabel('').ok('OK').targetEvent(data));
  })
  client.postReq(jsonString);
}

        //////////
        init();

        /**
         * Initialize
         */
         function init(){

         }

         function setPrimaryToolBar(){
          vm.primaryToolbarContext = !vm.primaryToolbarContext;
        };

        function toggleChildStates(toggledState){
          $state.go(toggledState);
        };

        //Get Expense By Key
        function getExpenseById(){
                var client =  $serviceCall.setClient("getExpenseByKey","expense"); // method name and service
            client.ifSuccess(function(data){  //success
              console.log(data);
              if (data)
                vm.expenseForUniquekey = data
              console.log(vm.expenseForUniquekey);
                 if (vm.expenseForUniquekey.status == 'Unpaid') { //check the status and deside the menu option active or inactive
                  vm.markAs = "Mark as Paid";
                }else if (vm.expenseForUniquekey.status == 'Paid') {
                  vm.markAs = "Mark as Unpaid";
                }; 

              })
            client.ifError(function(data){ //false
              console.log("error loading product quantity")
            })
            client.uniqueID(vm.currentThread.expenseID); // send projectID as url parameters
            client.getReq();
          }

          function openItem(item)
          {
            // Set the read status on the item
            // item.read = true;
            setPrimaryToolBar();

            // Assign thread as the current thread
            vm.currentThread = item;

            $state.go('app.expenses.detail', {itemId: item.expenseID});

            getExpenseById();

          }

        /**
         * Close thread
         */
         function closeThread()
         {
          vm.currentThread = null;

          setPrimaryToolBar();

            // Update the state without reloading the controller
            $state.go('app.expenses');
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
          console.log(vm.expenseSummary);
            // Make sure the current selection is cleared
            // before trying to select new threads
            vm.selectedThreads = [];

            for ( var i = 0; i < vm.expenseSummary.length; i++ )
            {
              if ( angular.isUndefined(key) && angular.isUndefined(value) )
              {
                vm.selectedThreads.push(vm.expenseSummary[i]);
                continue;
              }

              if ( angular.isDefined(key) && angular.isDefined(value) && vm.expenseSummary[i][key] === value )
              {
                vm.selectedThreads.push(vm.expenseSummary[i]);
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
          console.log(thread);
          startFunction(thread);
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