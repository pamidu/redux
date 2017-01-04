(function ()
{
    'use strict';
    angular
        .module('app.invoices')
        .controller('multiDueDatesCtrl', multiDueDatesCtrl);

    /** @ngInject */
    function multiDueDatesCtrl($scope, $rootScope, $focus, item, MultipleDudtesService, $serviceCall, $mdToast, $document, $mdDialog, $mdMedia, $mdSidenav, $state)
    {
    	var vm = this;
    	vm.cancel = cancel;
    	vm.famount = 0;
        vm.showcal = 0;
    	vm.famount = item;
    	 var newfamount = angular.copy(item)
    	vm.testarr = [];
    	vm.addItem = addItem;
    	vm.AddDueDates = AddDueDates;
    	vm.askDate = false;
        vm.editDueDates = false;
    	vm.dateArray = {};
    	vm.dateArray = MultipleDudtesService.getArry();
    	vm.editMultipleDuedates = [];
    	vm.editMultipleDuedates = angular.copy(MultipleDudtesService.getArry());
        if(vm.editMultipleDuedates.length > 1){
           vm.editMultipleDuedates.val = vm.editMultipleDuedates.val.sort(function(a, b) {
                return new Date(a.dueDate) - new Date(b.dueDate)
            })  
        }
        
        vm.removeeditArray  = removeeditArray;
    	console.log(vm.dateArray)
    	vm.testarr = [{
                dueDate: '',
                percentage: '',
                dueDatePrice: '',
                paymentStatus: 'Unpaid',
                balance: vm.famount,
                count: 1,
                uniqueKey: 'checkfocus1'
            }]; 
    	//vm.famount = InvoiceService.calculateNetAMount(vm.ship);

    	//=======Close Dialog====================
    	function cancel(){
          console.log("asdsd")
    		$mdDialog.cancel();
    	}

    	//=======================================
    	function addItem(){
            if(vm.askDate == false){
        		var arrr = [];
                var perCount = 0;
                var focus = 0;
                 for (var i = 0; i <= vm.testarr.length - 1; i++) {
                    perCount += parseInt(vm.testarr[i].percentage);
                    var numbers = parseInt(vm.testarr[i].count) + 1;
                    focus = 'checkfocus' + (parseInt(vm.testarr[i].count) + 1).toString();
                };
                if (perCount >= 100) {} else if (perCount < 100) {
                    vm.testarr.push({
                    dueDate: '',
                    percentage: '',
                    dueDatePrice: '',
                    paymentStatus: 'Unpaid',
                    balance: parseFloat(vm.famount - newfamount).toFixed(2),
                    count: numbers,
                    uniqueKey: focus
                    });
                }
            }

    	}
    	//====================================================
    	function AddDueDates (){
    		if(vm.askDate == false){
	    		var calc = 0;
	    		var checkArr = [];
	            $rootScope.checkArr = angular.copy(vm.testarr);
	            for (var i = vm.testarr.length - 1; i >= 0; i--) {
	                calc += parseFloat(vm.testarr[i].percentage);
	                MultipleDudtesService.calDateArray({
	                    invoiceNo : "",
	                    dueDate: vm.testarr[i].dueDate,
	                    percentage: vm.testarr[i].percentage,
	                    dueDatePrice: parseFloat(vm.testarr[i].dueDatePrice).toFixed(2),
	                    paymentStatus: "Unpaid",
	                    balance: parseFloat(vm.testarr[i].dueDatePrice).toFixed(2),
	                    peymentTerm : "",
	                    createDate   : new Date(),
	                    modifyDate   : new Date(),
	                    createUser   : "",
	                    modifyUser   : "",
	                    ccount: vm.testarr[i].count,
	                    uniqueKey: vm.testarr[i].uniqueKey
	                });
	            };
	            if (calc == 100) {
	                $mdDialog.cancel();
	            } 
    		}
           
    	}
    	//==================================================
        vm.showTotal = 0;
    	vm.DueAmount  = function(cn, index){
    		$scope.showPercentage = false;
	        var calc = 0;
            vm.showTotal = 0;
	        var tot = 0;
	        if(cn.dueDate == ""){
	            vm.askDate = true;
	        }
	        for (var i = vm.testarr.length - 1; i >= 0; i--) {
	            vm.showPercentage = false;
                vm.showTotal += (parseFloat(vm.famount * cn.percentage) / 100);
	            calc += parseFloat(vm.testarr[i].percentage);
	            tot = parseFloat(calc);
                vm.showcal = parseFloat(100  - tot);
	            if (tot > 100) {
	                vm.showPercentage = true;
	            }
	        }
	        newfamount = (parseFloat(vm.famount * cn.percentage) / 100);
	        vm.testarr[index] = {
	            dueDate: cn.dueDate,
	            percentage: cn.percentage,
	            dueDatePrice: newfamount,
	            balance: newfamount,
	            count: cn.count,
	            uniqueKey: cn.uniqueKey
	        }
	        $focus(cn.uniqueKey);
    	}
    	//==================================================
    	vm.removeItem = removeItem;
    	function removeItem(val, index){
    		vm.testarr.splice(vm.testarr.indexOf(val), 1);
    	}

    	//===================================================

        function removeeditArray(cc, index){
            var tt = index + 1;
            var deletedP = 0;
            var editArr = vm.editMultipleDuedates.val;
            if (editArr.length > 1) {
                vm.editMultipleDuedates.val.splice(vm.editMultipleDuedates.val.indexOf(cc), 1);

                if (editArr.length >= tt) {
                    deletedP = parseInt(editArr[index].percentage) + parseInt(cc.percentage);
                    editArr[index] = {
                        dueDate: editArr[index].dueDate,
                        percentage: deletedP,
                        dueDatePrice: parseInt(editArr[index].dueDatePrice + cc.dueDatePrice),
                        balance: parseInt(editArr[index].balance) + parseInt(cc.balance),
                        count: editArr[index].count,
                        paymentStatus: editArr[index].paymentStatus,
                        uniqueKey: editArr[index].uniqueKey
                    }
                } else if (editArr.length < tt) {
                    deletedP = parseInt(editArr[index - 1].percentage) + parseInt(cc.percentage);
                    editArr[index - 1] = {
                        dueDate: editArr[index - 1].dueDate,
                        percentage: deletedP,
                        dueDatePrice: parseInt(editArr[index - 1].dueDatePrice) + parseInt(cc.dueDatePrice),
                        balance: parseInt(editArr[index - 1].balance) + parseInt(cc.balance),
                        count: editArr[index - 1].count,
                        paymentStatus: editArr[index - 1].paymentStatus,
                        uniqueKey: editArr[index - 1].uniqueKey
                    }
                }
            }
            vm.editDueDates = true;
        }

        //===================================================
        vm.EditDueAmount = EditDueAmount;
        function EditDueAmount(cn, index){
            vm.percentageError = false;
            vm.showPercentage = false;
            var tota = 0;
            var tot = 0;
            if(cn.DueDate == ""){
                vm.askDate = true;
            }
            for (var i = vm.editMultipleDuedates.val.length - 1; i >= 0; i--) {
                vm.showPercentage = false;
                tota += parseFloat(vm.editMultipleDuedates.val[i].percentage)
                tot = parseFloat(tota).toFixed(2);
            }

            if(tot>100){
                 vm.showPercentage = true;
            }

            vm.cal = 0;
            vm.editDueDates = true;
            newfamount = (parseFloat(vm.famount * cn.percentage) / 100);
            vm.editMultipleDuedates.val[index] = {
                dueDate: cn.dueDate,
                percentage: cn.percentage,
                dueDatePrice: parseFloat(newfamount).toFixed(2),
                balance: parseFloat(newfamount).toFixed(2),
                count: cn.count,
                paymentStatus: 'Unpaid',
                uniqueKey: cn.uniqueKey
            }
            $focus(cn.uniqueKey);
        }
        //==================================================
        vm.addEditDueDates = addEditDueDates;
        function addEditDueDates(){
            if(vm.askDate == false){
                var perCount = 0;
                vm.focus = 0;
                for (var i = 0; i <= vm.editMultipleDuedates.val.length - 1; i++) {
                    perCount += parseInt(vm.editMultipleDuedates.val[i].percentage);
                    var numbers = parseInt(vm.editMultipleDuedates.val[i].count) + 1;
                    vm.focus = 'checkfocus' + (parseInt(vm.editMultipleDuedates.val[i].count) + 1).toString();
                };
                if (perCount >= 100) {

                } else if (perCount < 100) {
                    vm.editMultipleDuedates.val.push({
                        dueDate: '',
                        percentage: '',
                        dueDatePrice: '',
                        paymentStatus: 'Unpaid',
                        balance: parseFloat(vm.famount - newfamount).toFixed(2),
                        count: numbers,
                        uniqueKey: $scope.focus
                    });
                } 
            }
        }
        //============================================

        vm.UpdateDueDates = UpdateDueDates;

        function UpdateDueDates(){
            if(vm.askDate == false){
                vm.calc = 0;
                var amountT = 0;
                $rootScope.checkArr = [];
                $rootScope.checkArr = angular.copy(vm.editMultipleDuedates);
                $scope.oldPercentage = 0;
                for (var i = 0; i < vm.editMultipleDuedates.val.length; i++) {
                    amountT += parseFloat(vm.editMultipleDuedates.val[i].percentage);
                }

                if (amountT == 100) {
                    MultipleDudtesService.removeAllTheDates(0);
                    console.log(MultipleDudtesService.getArry());
                    for (var i = vm.editMultipleDuedates.val.length - 1; i >= 0; i--) {
                        MultipleDudtesService.setDateArray(vm.editMultipleDuedates.val[i])
                    }
                    // for (var i = $rootScope.dateArray.val.length - 1; i >= 0; i--) {
                    //     $rootScope.dateArray.val.splice($rootScope.dateArray.val.indexOf($rootScope.dateArray.val[i]), 1)
                    // }
                    //$rootScope.dateArray.val = $scope.editMultipleDuedates;
                    $mdDialog.hide();
                } else {
                   vm.percentageError = true;

                }
            }
        }
    }
})();

(function ()
{
    'use strict';
    angular
        .module('app.invoices')
        .factory('MultipleDudtesService', MultipleDudtesService);

    /** @ngInject */
    function MultipleDudtesService($rootScope)
    {
    	var dateArray = {
        val: []
	    };
	    var getDateArr = {
	        val: []
	    };
	    //$rootScope.showmsg = false;
	    return {
	        setDateArray: function(newVal) {
	            dateArray.val.push(newVal);
	            return dateArray;
	        },
	        removeDateArray: function(newVals, index) {
	        	dateArray.val.splice(dateArray.val.indexOf(newVals), 1);
	            return dateArray;
	        },
            removeAllTheDates : function(newVals){
                dateArray.val.splice(newVals);
                return dateArray;
            },

	        getArry: function(){
	        	return dateArray;
	        },

	        calDateArray: function(val) {
	            //$rootScope.showmsg = false;
	            var calPercentatge = 0;
	            for (var i = $rootScope.checkArr.length - 1; i >= 0; i--) {
	                calPercentatge += parseFloat($rootScope.checkArr[i].percentage);
	            };
	            if (calPercentatge == 100) {
	                this.setDateArray(val);
	            } else {
	                $rootScope.showmsg = true;
	            }
	        },
	    }
    }
})();