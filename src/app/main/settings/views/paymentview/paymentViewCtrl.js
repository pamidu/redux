(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('paymentsViewController',paymentsViewController);

  /** @ngInject */
  function paymentsViewController($scope, $rootScope, $document, $mdDialog, $mdToast, $mdMedia, $serviceCall, $mdSidenav, $state, msApi, $auth, $apis)
  {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

    	function toggleSidenav(sidenavId)
    	{
    		$mdSidenav(sidenavId).toggle();
    	}
       // dont change above code !
      
      //call paymentgateway whether register or not..........................................................
      function paymentgatewayRegisterStatus(){
        var client =  $serviceCall.setClient("connectedGateways","setting"); 
        client.ifSuccess(function(data){ 
          console.log(data);
          if(data.data.length!=0){
              vm.rejectbtnDisabled=false;
              vm.registerbtnDisabled=true;
              vm.registered=true;
          }

        });
        client.ifError(function(data){ 
          console.log("There was an error, when connected Gateways", "error");
        })
        client.getReq();
      };
      paymentgatewayRegisterStatus();

      vm.activepayment=activepayment;
      vm.registerOlinePayment=registerOlinePayment;
      vm.rejectOnlinePayment=rejectOnlinePayment;
      vm.rejectbtnDisabled=true;
      vm.registerbtnDisabled=false;
    
      function loadSetting(){
        var client =  $serviceCall.setClient("getAll","setting"); 
        client.ifSuccess(function(data){ 
          console.log(data[0]);
          vm.Settings12thdoor=data[0];

        });
        client.ifError(function(data){ 
          console.log("There was an error, when data loading", "error");
        })

        client.skip(0); 
        client.take(1); 
        client.orderby();
        client.getReq();
      }
      loadSetting();

      function savePayments(data){
          console.log(data);
          vm.onlinePay=data;
          
            if(vm.onlinePay.activate==true){
              vm.label='activated';
              var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
                client.ifSuccess(function(data){  //sucess  
                  var toast = $mdToast.simple().content('Successfully ' +vm.onlinePay.name+' '+vm.label).action('OK').highlightAction(false).position("bottom right");
                  $mdToast.show(toast).then(function() {});
                });
                client.ifError(function(data){ //false
                  var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
                  $mdToast.show(toast).then(function() {});
                })
                client.tab('payments');
                client.postReq(vm.Settings12thdoor.payments);
          }
          else{
              vm.label='Inactivated';
               var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
                client.ifSuccess(function(data){  //sucess  
                  var toast = $mdToast.simple().content('Successfully ' +vm.onlinePay.name+' '+vm.label).action('OK').highlightAction(false).position("bottom right");
                  $mdToast.show(toast).then(function() {});
                });
                client.ifError(function(data){ //false
                  var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
                  $mdToast.show(toast).then(function() {});
                })
                client.tab('payments');
                client.postReq(vm.Settings12thdoor.payments);
          }        
        }
      
//      function saveConfigs(onlinePayments){
//          console.log(onlinePayments);
//          console.log(vm.Settings12thdoor.payments);
//                 var client =  $serviceCall.setClient("singleupdate","setting"); // method name and service
//                client.ifSuccess(function(data){  //sucess  
//                  var toast = $mdToast.simple().content('Successfully saved '+onlinePayments + ' configs').action('OK').highlightAction(false).position("bottom right");
//                  $mdToast.show(toast).then(function() {});
//                });
//                client.ifError(function(data){ //false
//                  var toast = $mdToast.simple().content('There was an error saving the data').action('OK').highlightAction(false).position("bottom right");
//                  $mdToast.show(toast).then(function() {});
//                })
//                client.tab('payments');
//                client.postReq(vm.Settings12thdoor.payments);
//              }

              function activepayment(data){
                console.log(data.name);

                for (var i = vm.Settings12thdoor.payments.length - 1; i >= 0; i--) {
                  if(vm.Settings12thdoor.payments[i].name==data.name){
                    if(data.activate){
                        data.activate=false;
                        var element = document.getElementById(data.name);
                        element.setAttribute("class", "");
                        data.label="activate";
                        vm.Settings12thdoor.payments[i].label="activate";
                        vm.Settings12thdoor.payments[i].activate=false;
                        vm.availableInactivate=true;
                        break;
                    }
                   
                  else{
                      
                    if(vm.registered==true){
                            data.activate=true;
                    var element = document.getElementById(data.name);
                    element.setAttribute("class", "tintImage");
                    data.label="Inactivate";
                    vm.Settings12thdoor.payments[i].label="Inactivate";
                    vm.Settings12thdoor.payments[i].activate=true;
                    vm.availableactivate=true;
                       }
                       else{
                        $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Alert')
                        .textContent('You should register with '+data.name)
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Ok!')
                        .targetEvent()
                        );
                        break;
                    }
                   
                  }

                };

              };
                  
            if(vm.availableactivate==true){
                 savePayments(data);
            }
            if(data.activate==false){
                
                if(vm.availableInactivate==true){
                savePayments(data);
                }
           
            }
            
              
            }

//            function saveConfig(onlinepay,ev){
//              console.log(onlinepay);
//              $mdDialog.show({
//                controller: 'DialogOnlinePaymentConfigSetController',
//                controllerAs: 'vm',
//                templateUrl: 'app/main/settings/dialogs/paymentDialogs/onlinePaymentConfiguration.html',
//                parent: angular.element(document.body),
//                targetEvent: ev,
//                locals: { onlinepay: onlinepay },
//                clickOutsideToClose:true
//              })
//              .then(function(answer) {
//
//                for (var i = vm.Settings12thdoor.payments.length - 1; i >= 0; i--) {
//                  if(vm.Settings12thdoor.payments[i].name==answer.name){
//                    console.log(vm.Settings12thdoor.payments[i].name);
//                    vm.Settings12thdoor.payments[i].secret_key=answer.secret_key;
//                    vm.Settings12thdoor.payments[i].publishable_key=answer.publishable_key;
//                    vm.Settings12thdoor.payments[i].API_UserName=answer.API_UserName;
//                    vm.Settings12thdoor.payments[i].API_Password=answer.API_Password;
//                    vm.Settings12thdoor.payments[i].API_Signature=answer.API_Signature;
//                    vm.Settings12thdoor.payments[i].privateKey=answer.privateKey;
//                    vm.Settings12thdoor.payments[i].publishableKey=answer.publishableKey;
//                    vm.Settings12thdoor.payments[i].sellerId=answer.sellerId;
//                    console.log(vm.Settings12thdoor.payments);
//
//                  }
//                }
//                saveConfigs(answer.name);
//
//              }, function() {
//                $scope.status = 'You cancelled the dialog.';
//              });
//            }
        
            function registerOlinePayment(data){
                console.log(data);
                window.location.replace($apis.getHost()+'/dushmantha/payment-partial.php');
                
            };
      
            function rejectOnlinePayment(data,index){
                console.log(data);
                vm.paymentgatewayName=data.name;
                var client =  $serviceCall.setClient("deactiveAcc","setting"); 
                client.ifSuccess(function(data){ 
                  console.log(data);
                    if(data.status==true){
                      vm.rejectbtnDisabled=true;
                      vm.registerbtnDisabled=false;
                      var toast = $mdToast.simple().content('Successfully deactivated stripe account').action('OK').highlightAction(false).position("bottom right");
                      $mdToast.show(toast).then(function() {});
                        
                    }
                    
                });
                client.ifError(function(data){ 
                  console.log("There was an error, when deactive Account", "error");
                })
                client.getReq();
            };

          }
        })();