(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('uploadCtrl', uploadCtrl);

    /** @ngInject */
    function uploadCtrl($scope, mdPanelRef, $serviceCall, $mdToast, $document, $mdDialog, $mdMedia, $mdSidenav, $state)
    {
    	var vm = this;
		vm.closeDialog = closeDialog;
		vm.uploadItem = uploadItem;
		vm.files = [];
		
		function closeDialog(){
			mdPanelRef.close();
		}

		function uploadItem(){
			mdPanelRef.close().then(function(mdPanelRef) {
				onClose(vm.files);
			});
			}
		
		function onClose(data){  
			setUniqueCode(data);
		}
		function uniqueCode(){
			var date = new Date();
			var components = [
			date.getYear(),
			date.getMonth(),
			date.getDate(),
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
			];
			return components.join("");
		}
		function setUniqueCode(data){
			if (data.length > 0) {
				vm.brochureFiles = []
				angular.forEach(data,function(obj){
					var extension = obj.lfFile.name.split('.').pop(); 
					obj.lfFile.uniqueCode = uniqueCode() +"." +extension; 
					vm.brochureFiles.push(obj.lfFile);
				});            
			}
		}

    }
})();