(function()
{
	'use strict';

	angular
	.module('app.settings')
	.controller('projectPreferenceCtrl',projectPreferenceCtrl);

	/** @ngInject */
	function projectPreferenceCtrl($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth)
	{
		// use the below code on all child view controllers
		var vm = this;

		vm.toggleSidenav = toggleSidenav;

		function toggleSidenav(sidenavId)
		{
			$mdSidenav(sidenavId).toggle();
		}
    	// dont change above code !

  
        function loadSetting(){
            var client =  $serviceCall.setClient("getAll","setting"); // method name and service
            client.ifSuccess(function(data){ 
            	console.log(data[0]);
            	vm.Settings12thdoor=data[0];
            });
            client.ifError(function(data){ 
            	var toast = $mdToast.simple().content('There was an error, when data loading').action('OK').highlightAction(false).position("bottom right");
            	$mdToast.show(toast).then(function() {});
            })

            client.skip(0); 
            client.take(1); 
            client.orderby();
            client.getReq();
        }
        loadSetting();

        vm.inactivateTaskProjectrow="Inactivate";
        vm.save=save;
        vm.addtaskProject=addtaskProject;
        vm.edittaskProjectrow=edittaskProjectrow; 
        vm.deletetaskProject=deletetaskProject;
        vm.inactivateTaskProject=inactivateTaskProject;
        
        function save(){
               var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
                client.ifSuccess(function(data){  //sucess  
                    var toast = $mdToast.simple().content('Successfully saved').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                });
                client.ifError(function(data){ //false
                    var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                })
                client.tab('preference');
                client.postReq(vm.Settings12thdoor.preference);
            }

            function addtaskProject(ev){
               $mdDialog.show({
                controller: 'DialogPrefaddtaskProjectController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/projectDialog/addtaskProject.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
               .then(function(answer) {
                   vm.Settings12thdoor.preference.project.task.push(answer);
               }, function() {
                vm.status = 'You cancelled the dialog.';
            });

           };

           function edittaskProjectrow(edit,ev){
            $mdDialog.show({
                controller: 'DialogEditPrefaddtaskProjectController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/preferenceDialogs/projectDialog/edittaskProject.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { edit: edit },
                clickOutsideToClose:true,
            })
            .then(function(answer) {
                for (var i =  vm.Settings12thdoor.preference.project.task.length - 1; i >= 0; i--){
                    if ( vm.Settings12thdoor.preference.project.task[i].id == answer.id) { 
                     vm.Settings12thdoor.preference.project.task[i]=answer;
                     console.log(vm.Settings12thdoor.preference.project.task);
                     break;
                 }

             }

         }, function() {
            vm.status = 'You cancelled the dialog.';
        });

        };

        function deletetaskProject(units, index){  
        vm.Settings12thdoor.preference.project.task.splice(index, 1);
     };

     function inactivateTaskProject(data,index){
         for (var i =  vm.Settings12thdoor.preference.project.task.length - 1; i >= 0; i--){
            if ( vm.Settings12thdoor.preference.project.task[i].id == data.id) {
             if(data.activate){
                data.activate = false;
                vm.inactivateTaskProjectrow="Activate";
                vm.Settings12thdoor.preference.project.task[i].activate=false;
            }else{
                data.activate = true;
                vm.inactivateTaskProjectrow="Inactivate";
                vm.Settings12thdoor.preference.project.task[i].activate=true;
            }
        }
    }

};

}

})();