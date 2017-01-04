(function ()
{
    'use strict';

    angular
        .module('app.invoices')
        .controller('paymentCtrl', paymentCtrl);

    /** @ngInject */
    function paymentCtrl($scope, item, $http,$rootScope, InvoiceService,$auth, $serviceCall, MultipleDudtesService, $mdToast, $document, $mdDialog, $mdMedia, $state)
    {
    	var vm = this;
        vm.cancel = cancel;
        var invDetails = item;

       
        vm.loadSettings = loadSettings;
        vm.assignSettigsData = assignSettigsData;
        vm.payment ={}
        vm.payment.createDate = new Date();

        vm.paymentTypes = [];

        vm.disablePayment = false;
   vm.showpartialMsg = false;
    //var LoginName = $auth.getSession().Name;
    vm.payment = { 
          "lastTranDate"      :new Date(),
          "uAmount"           :"",
          "aAmount"           :"",
          "invoiceNo"         :invDetails.invoiceNo,
          "paymentComment"    :"", 
          "paymentRef"        :"",
          "paymentMethod"     :"",
          "recievedAmount"    :"",
          "bankCharges"       :"",
          "favoriteStar"      :false,
          "favouriteStarNo"   :1,
          "fullAmount"        :"",
          "receiptID"         :"",
          "paymentStatus"     :"active",
          "profileID"         :invDetails.profileID,
          "profileAddress"    :invDetails.billingAddress,
          "profileEmail"      :invDetails.email,
          "profileName"       :invDetails.profileName,
          "uploadImage"       :[],
          "customField"       :[],
          "pattern"           :"",
          "baseCurrency"      :"",
          "createDate"        : new Date(),
          "token"             : ""
        }

            vm.checkpayments = [];
            

             vm.paymentTypes.push({
                paymentmethod: '-',
                paymentType: 'offline',
                activate: "Active"
        })


              if(item.paymentMethod == ""){

        }else{
            vm.payment.paymentMethod = item.paymentMethod;
        }
           
        loadSettings();
         function loadSettings(){
            var settings = $serviceCall.setClient("getAllByQuery","setting");
            settings.ifSuccess(function(data){
               assignSettigsData(data);
            });
            settings.ifError(function(data){

            });
            settings.postReq({"setting":"profile,payments","preference":"paymentPref,invoicePref"})
        }

        function assignSettigsData(val){
            vm.payment.baseCurrency = val[0].profile.baseCurrency.toLowerCase();
            vm.payment.pattern = val[0].preference.paymentPref.paymentPrefix + val[0].preference.paymentPref.paymentSequence;
            vm.allowPatialPay =  val[0].preference.invoicePref.allowPartialPayments;
            if(val[0].preference.paymentPref.paymentMethods.length >= 1) {
                    for (var x = val[0].preference.paymentPref.paymentMethods.length - 1; x >= 0; x--) {
                            if (val[0].preference.paymentPref.paymentMethods[x].activate == true) {
                               vm.paymentTypes.push({
                                    paymentmethod: val[0].preference.paymentPref.paymentMethods[x].paymentMethod,
                                    paymentType: val[0].preference.paymentPref.paymentMethods[x].paymentType,
                                    activate: val[0].preference.paymentPref.paymentMethods[x].activate
                                })   
                            }
                        };
                   }
                        for (var y = val[0].payments.length - 1; y >= 0; y--) {
                        if (val[0].payments[y].activate == true) {
                            vm.checkpayments = val[0].payments;
                           vm.paymentTypes.push({
                                paymentmethod: val[0].payments[y].name,
                                paymentType: val[0].payments[y].paymentType,
                                activate: val[0].payments[y].activate
                            })
                        }
                    };
            
        }



        function cancel(){
            $mdDialog.cancel();
        }

         vm.maxDate = new Date();

         vm.payment.paymentLog = {  
             userName       :"",
             lastTranDate   :new Date(),
             createDate     :new Date(),
             modifyDate     :"",
             createUser     :"",
             modifyUser     :"",
             UIHeight       :"30px;",
             type           :"activity",
             description    :"payment added by"+"",
             status         :"Active",
             logID          :""
          }


          vm.getPayment = getPayment;
          vm.confirmOk = confirmOk;

        function getPayment(obj){
            if(obj == "stripe"){
                var payment = $serviceCall.setClient("getPaymentKeys","setting");
                payment.ifSuccess(function(data){
               var data = data;
                if (data)
                    vm.publishKey = data.publishable_key.replace('\\u000','');
                    console.log(vm.publishKey)
                    vm.config = {
                        publishKey:  vm.publishKey,
                        title: '12thdoor',
                        description: "for connected business",
                        logo: 'img/small-logo.png',
                        label: 'New Card',
                    }
                });
                payment.ifError(function(data){

                });
                payment.appName(obj);
                payment.getReq();
            }
        }

        function confirmOk(ev, val){
            if(vm.allowPatialPay == true){
                if(val.paymentMethod == "" || val.paymentMethod == undefined ){

            }else if(val.paymentMethod == "stripe"){

                    if(vm.config == undefined){
                        vm.getPayment("stripe");
                    }
                
                $rootScope.$broadcast("call_stripe",ev,vm.config ,function(){                     
                    
                }) 
                $scope.$on('stripe-token-received', function(event, response) {
                    console.log(response);
                    vm.payment.token = response.id
                    console.log(response.id)
                    debugger; 

                    dopayment();
                });

            }else{
                dopayment();
            }

            }else{
                if(invDetails.netAmount == vm.payment.recievedAmount){
                    if(val.paymentMethod == "" || val.paymentMethod == undefined ){

            }else if(val.paymentMethod == "stripe"){

                
                $rootScope.$broadcast("call_stripe",ev,vm.config ,function(){                     
                    
                }) 
                vm.$on('stripe-token-received', function(event, response) {
                    console.log(response);
                    vm.payment.token = response.id
                    console.log(response.id)
                    debugger; 

                    dopayment();
                });

            }else{
                dopayment();
            }
                }else{
                    vm.showpartialMsg = true;
                }
            }
        }

        //========================================================================
        function dopayment(){
        
            vm.disablePayment = true;
            vm.pay = {"payment" : vm.payment, "permissionType" : "add", "appName":"Payments" };
               var jsonString = JSON.stringify(vm.pay);

               var payment = $serviceCall.setClient("singlePayment","process");
                payment.ifSuccess(function(data){
               var data = data;
               var toast = $mdToast.simple()
                    .content('payment Successfully Done.')
                    .action('OK')
                    .highlightAction(false)
                    .position("bottom right");
                  $mdToast.show(toast).then(function () {
                  });
                  $mdDialog.hide()
              });
                payment.ifError(function(data){
                    console.log("fail")
                });
                payment.postReq(jsonString);

        }
    }
})();