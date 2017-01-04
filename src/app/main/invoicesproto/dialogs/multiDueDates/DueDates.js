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
    	vm.famount = item;
    	 var newfamount = angular.copy(item)
    	vm.testarr = [];
    	vm.addItem = addItem;
    	vm.AddDueDates = AddDueDates;
    	vm.askDate = false;
    	vm.dateArray = {};
    	vm.dateArray = MultipleDudtesService.getArry();
    	vm.editMultipleDuedates = [];
    	vm.editMultipleDuedates = MultipleDudtesService.getArry()
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
    		var arrr = [];
            var perCount = 0;
            var focus = 0;
             for (var i = 0; i <= vm.testarr.length - 1; i++) {
                 perCount += parseInt(vm.testarr[i].percentage);
                var numbers = parseInt(vm.testarr[i].count) + 1;
                focus = 'checkfocus' + (parseInt(vm.testarr[i].count) + 1).toString();
            };

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

    	vm.DueAmount  = function(cn, index){
    		$scope.showPercentage = false;
	        var calc = 0;
	        var tot = 0;
	        if(cn.dueDate == ""){
	            $scope.askDate = true;
	        }
	        for (var i = vm.testarr.length - 1; i >= 0; i--) {
	            vm.showPercentage = false;
	            calc += parseFloat(vm.testarr[i].percentage);
	            tot = parseFloat(calc).toFixed(2);
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
    		vm.testarr.splice(vm.testarr.indexOf(cc), 1);
    	}

    	//===================================================
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
	        	dateArray.splice(dateArray.indexOf(newVals), 1);
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