(function()
{
    'use strict';

    angular
    .module('app.settings')
    .controller('profileViewController',profileViewController);

    /** @ngInject */
    function profileViewController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdToast,$serviceCall, $mdSidenav, $state, msApi, $auth,fileUploader,$imageUploader,$apis)
    {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

    	function toggleSidenav(sidenavId)
    	{
    		$mdSidenav(sidenavId).toggle();
    	}
    	// dont change above code !

        vm.addcusfieldsProfile=addcusfieldsProfile;
        vm.editCusfieldsProfile=editCusfieldsProfile;
        vm.deleteInvoiceCusfieldsrow=deleteInvoiceCusfieldsrow;
        vm.saveProfile=saveProfile;
        vm.uploadImage=uploadImage;
        vm.host=$apis.getHost();
        console.log(vm.host);

        function loadSetting(){
            var client =  $serviceCall.setClient("getAll","setting"); // method name and service
            client.ifSuccess(function(data){
                
                console.log(data[0]);
                vm.Settings12thdoor=data[0];
                if(vm.Settings12thdoor.profile.companyLogo.uniqueCode!=''){
                    vm.uploadFile = vm.host+'/apis/media/tenant/twelthdoor/'+vm.Settings12thdoor.profile.companyLogo.uniqueCode;
                }
                else{
                     vm.uploadFile=vm.Settings12thdoor.profile.companyLogo.imageUrl;
                }
            
                vm.Settings12thdoor.profile.transactionEnd=new Date(vm.Settings12thdoor.profile.transactionEnd);
                vm.Settings12thdoor.profile.transactionStart=new Date(vm.Settings12thdoor.profile.transactionStart);

                var temp =(moment.utc(vm.Settings12thdoor.profile.transactionStart)); 
                var tempE=(moment.utc(vm.Settings12thdoor.profile.transactionEnd));

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

        function saveProfile(){
             
            if(vm.imageArray!=undefined){
                var client = $imageUploader.setImage(vm.imageArray[0].uniqueCode);
                client.ifSuccess(function(data){ 
                    console.log(data);                   
                });
                client.ifError(function(data){ 
                });
                client.sendImage(vm.imageArray[0]);      
                vm.Settings12thdoor.profile.companyLogo.imageUrl=vm.host+"/apis/media/tenant/twelthdoor/"+vm.imageArray[0].uniqueCode;
                console.log(vm.Settings12thdoor.profile.companyLogo.imageUrl);
            }
            
            //set date using moment
            vm.Settings12thdoor.profile.transactionEnd=moment(vm.Settings12thdoor.profile.transactionEnd).format('YYYY-MM-DD HH:mm:ss');
	        vm.Settings12thdoor.profile.transactionStart = moment(vm.Settings12thdoor.profile.transactionStart).format('YYYY-MM-DD HH:mm:ss')
            
            //check date range...........................
            if (vm.Settings12thdoor.profile.transactionEnd==vm.Settings12thdoor.profile.transactionStart) {
              $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(true)
              .title('Alert').textContent('Financial End Date and Financial Start Date are equals, Please change Financial End Date').ariaLabel('Alert Dialog Demo').ok('Ok!').targetEvent());
            }
             if (vm.Settings12thdoor.profile.transactionEnd < vm.Settings12thdoor.profile.transactionStart) {
              $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(true)
              .title('Alert').textContent('Financial End Date have to bigger than Financial Start Date').ariaLabel('Alert Dialog Demo').ok('Ok!').targetEvent());
            }
           
            if(vm.Settings12thdoor.profile.transactionEnd!=vm.Settings12thdoor.profile.transactionStart || vm.Settings12thdoor.profile.transactionEnd > vm.Settings12thdoor.profile.transactionStart){
                
                var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
                client.ifSuccess(function(data){  //sucess  
                    var toast = $mdToast.simple().content('Successfully saved profile').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                });
                client.ifError(function(data){ //false
                    var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
                    $mdToast.show(toast).then(function() {});
                })
                client.tab('profile');
                
                client.postReq(vm.Settings12thdoor.profile);
            }
            
            
            
                
                


            };

            function uploadImage(image){
                var type=image;

                console.log(type);
                fileUploader.uploadFile(type);
                fileUploader.result(function(arr){
                    console.log(arr);

                    vm.imageArray = [];
                    vm.imageArray = arr;
                    console.log(vm.imageArray);
                    console.log(vm.Settings12thdoor.profile.companyLogo);
                    vm.Settings12thdoor.profile.companyLogo.ID="";
                    vm.Settings12thdoor.profile.companyLogo.appGuid="";
                    vm.Settings12thdoor.profile.companyLogo.appName="SETTING";
                    vm.Settings12thdoor.profile.companyLogo.createUser="",
                    vm.Settings12thdoor.profile.companyLogo.date=vm.imageArray[0].lastModifiedDate;
                    vm.Settings12thdoor.profile.companyLogo.imageUrl="";
                    vm.Settings12thdoor.profile.companyLogo.name=vm.imageArray[0].name;
                    vm.Settings12thdoor.profile.companyLogo.size=vm.imageArray[0].size,
                    vm.Settings12thdoor.profile.companyLogo.type=vm.imageArray[0].type;
                    vm.Settings12thdoor.profile.companyLogo.uniqueCode=vm.imageArray[0].uniqueCode;
                    console.log(vm.Settings12thdoor.profile.companyLogo);


                    loadImage();

                    //}
                })
            };

            function loadImage(){
                var reader = new FileReader();
                console.log(vm.imageArray);
                reader.readAsDataURL(vm.imageArray[0]);
                reader.onload = function () { 
                    vm.uploadFile = reader.result
                    if(!$scope.$$phase) {
                      $scope.$apply()
                  }
              };
              reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        };


        function addcusfieldsProfile(ev) {
            $mdDialog.show({
                controller: 'DialogprofileController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/profileDialogs/addCustomdetailsforProfile.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
            })
            .then(function(answer) {
                vm.Settings12thdoor.profile.cusFiel.push(answer);
            }, function() {
                vm.status = 'You cancelled the dialog.';
            });

        };

        function editCusfieldsProfile(cusFieldsProfileedit,ev) {
            console.log(cusFieldsProfileedit);
            $mdDialog.show({
                controller: 'DialogEditprofileController',
                controllerAs: 'vm',
                templateUrl: 'app/main/settings/dialogs/profileDialogs/editCustomdetailsforProfile.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: { cusFieldsProfileedit: cusFieldsProfileedit },
                clickOutsideToClose:true,
            })
            .then(function(answer) {

                for (var i = vm.Settings12thdoor.profile.cusFiel.length - 1; i >= 0; i--){
                    if (vm.Settings12thdoor.profile.cusFiel[i].id == answer.id) { 
                        vm.Settings12thdoor.profile.cusFiel[i]=answer;
                        console.log(vm.Settings12thdoor.profile.cusFiel);
                        break;
                    }
                }

            }, function() {
                vm.status = 'You cancelled the dialog.';
            });

        };

        function deleteInvoiceCusfieldsrow(cusFieldsprofile, index){  
            vm.Settings12thdoor.profile.cusFiel.splice(index, 1);
        }





    }


})();