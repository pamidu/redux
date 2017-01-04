(function ()
{
    'use strict';

    angular
        .module('app.payments')
        .controller('payComposeController', payComposeController)

        .filter('datetime', function($filter){
            return function(input){
              if(input == null){ return ""; } 
             
              var _date = $filter('date')(new Date(input),'yyyy/MM/dd');         
              return _date.toUpperCase();

            };
        });

    payComposeController.$inject = ['$scope','$rootScope', '$document', '$mdDialog', '$mdMedia', '$mdSidenav', '$state','$serviceCall','settingSummary','$mdPanel','$imageUploader','$http']

    /** @ngInject */
    function payComposeController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state,$serviceCall,settingSummary,$mdPanel,$imageUploader,$http )
    {
        var vm = this;
        vm.toggleChildStates = toggleChildStates;
        vm.querySearch = querySearch;
        vm.selectedItemChange = selectedItemChange;
        vm.checkItem = checkItem;
        vm.submit = submit;
        vm.onblur = onblur;
        vm.netAmount = netAmount;
        vm.paymentMethodChange = paymentMethodChange;
        vm.history = history;
        vm.getPaidAmount = getPaidAmount;
        vm.amountLostFocus = amountLostFocus;
        vm.OnRecivedAmountLostFocus = OnRecivedAmountLostFocus;

        
            vm.payment = {   
           "lastTranDate":new Date(),
           "uAmount":0,
           "aAmount":0,
           "paymentComment":"",
           "paidInvoice":[],
           "paymentRef":"", 
           "paymentMethod":"",
           "recievedAmount":"",
           "bankCharges":"",
           "favoriteStar":"",
           "favouriteStarNo":"",
           "fullAmount":"",
           "receiptID": "",
           "paymentStatus":"active",
           "profileID":"1",
           "profileAddress":{},
           "profileEmail":"",
           "profileName":"",
           "uploadImage":[],
           "customField":[],
           "paymentLog":{},
           "pattern":"",
           "image" : [],
           "token" :"",
           "type" :"",
           "paidTypes":"",
           "date" : new Date()
        } //class name payment

        var userName = "Dushmantha";
        //$auth.getUserName() ? userName = $auth.getUserName() : userName = "";
        
        vm.nAmount = 0; //initially total amount is 0 (Total Available=nAmount) 
        vm.outstandingInvoices = []; //this is where all outstanding invoices r saved for praticular customer
        vm.receiveRequired = true;
        vm.submitProgress = false;
        vm.selectedItem1 = null;
        vm.searchText = null;
        vm.UploadedImageCount = 0;
        vm.SelectedInvoiceCount = 0;
        vm.LastEnterdAmount = 0;
        
        
        vm.payment.pattern = settingSummary[0].preference.paymentPref.paymentPrefix + settingSummary[0].preference.paymentPref.paymentSequence;
        paymentMethod(settingSummary, function() {
            paymentCustArr(settingSummary,function(){
                paymentCurrency(settingSummary,function(){
                    loadMaxPaymentNum();
                })
            });
        });

        function paymentMethod(obj, callback) {
            vm.PayArr = [];
            var payMethod = obj[0].preference.paymentPref.paymentMethods;
            for (var i = 0; i <= payMethod.length - 1; i++) {
                if (payMethod[i].activate) 
                    vm.PayArr.push(payMethod[i].paymentMethod);
                
            }
            var payMethodOnline = obj[0].payments;
            for(var i = 0; i <= payMethodOnline.length - 1; i++){
                (payMethodOnline[i].activate) ? vm.PayArr.push(payMethodOnline[i].name) : payMethodOnline;
            }
            callback();
        }
        function paymentCustArr(arr,callback) {
            vm.payCustArr = [];
            var fieldArr = arr[0].preference.paymentPref.cusFiel;
            for (var l = 0; l <= fieldArr.length - 1; l++) {
                vm.payCustArr.push(fieldArr[l]);
            } 
            callback();
        }
        function paymentCurrency(arr,callback){
            vm.payment.baseCurrency = arr[0].profile.baseCurrency.toLowerCase();
            callback();
        }
        function loadMaxPaymentNum(){
            
            
            
            var client =  $serviceCall.setClient("getNextReceiptNo","payment");
            
            client.ifSuccess(function(data){
                vm.payment.paymentRef = data;
            });
            client.ifError(function(data){
                console.log("error loading max number");
            })
            client.pattern(vm.payment.pattern);
            client.postReq();

        }



        function querySearch(query) {

            var body = {"where": "status = 'Active' and deleteStatus = false and profileName LIKE '" + query + "%' "}
            var profileClient =  $serviceCall.setClient("getAllByQuery","profile"); 

            profileClient.skip("0");
            profileClient.take("10");
            profileClient.class("Customer");
            profileClient.orderby("profileID");
            profileClient.isAscending("false");

            return profileClient.getSearch(body).then(function(response){
                var data = response.data.result;
                var results = [];
                for (var i = 0, len = data.length; i < len; ++i) {
                    results.push({
                        display: data[i].profileName,
                        value: data[i].profileName.toLowerCase(), 
                        email : data[i].email,
                        profileID : data[i].profileID,
                        cusAddress: data[i].billingAddress           
                    });
                }
                return results

            },function(results){
                console.log('error loading data')
            }) 
        }
        
        function toggleChildStates(toggledState){
            $state.go(toggledState);
        };

        /*function selectedItemChange(SelectedItem)
        {
           vm.payment.paymentMethod = settingSummary["0"].preference.paymentPref.paymentMethods;
        }*/

        function selectedItemChange(name,profileID)
        {
            var JSONinputobj = {where : "deleteStatus = false and profileID = '"+profileID+"'"};

            var client =  $serviceCall.setClient("getAllByQuery","invoice");
                client.skip("0");
                client.take("10");
                client.orderby("lastTranDate");
                client.isAscending("false");
            
                client.ifSuccess(function(data){
                    
                    console.log(data)
                var data = data.result;

                vm.outstandingInvoices = [];
                vm.payment.uAmount = 0;
                vm.nAmount = vm.payment.recievedAmount
                vm.payment.aAmount = 0;

                for(var i = 0; i <= data.length-1; i++){
                    for (var j = 0; j <= data[i].multiDueDates.length-1; j++) {
                        if ((data[i].multiDueDates[j].paymentStatus == "Unpaid" || data[i].multiDueDates[j].paymentStatus == "Partially Paid")) {
                            vm.outstandingInvoices.push({
                                invono: data[i].invoiceNo,
                                sdate: data[i].startDate,
                                duedate: data[i].multiDueDates[j].dueDate,
                                famount: data[i].multiDueDates[j].dueDatePrice, 
                                instalment: data[i].multiDueDates[j].balance,
                                termtype: data[i].peymentTerm,
                                customerid : data[i].profileID,
                                checked: false,
                                checkDisable : false,
                                inputDisable : true
                            });
                        }
                    }
                }
                loadAdvancePaymentDetails(profileID,function(){
                    sortInvoiceArr();
                });

                });
                client.ifError(function(data){
                    
                })
                client.pattern(vm.payment.pattern);
                client.postReq(JSONinputobj);
        }

        function sortInvoiceArr(){
            var oneInvoiceNoArr = [];
            vm.fullArr = [];
            if (vm.outstandingInvoices.length > 0) {
                for(var i=0; i<=vm.outstandingInvoices.length; i++){
                    if (vm.outstandingInvoices[i+1]) {
                        if (vm.outstandingInvoices[i].invono == vm.outstandingInvoices[i+1].invono) {
                            
                            oneInvoiceNoArr.push(vm.outstandingInvoices[i]);
                        }else if(vm.outstandingInvoices[i].invono != vm.outstandingInvoices[i+1].invono){
                            
                            oneInvoiceNoArr.push(vm.outstandingInvoices[i]);
                            if (oneInvoiceNoArr.length > 1) {
                                oneInvoiceNoArr = oneInvoiceNoArr.sort(function(a,b){
                                    return new Date(a.duedate) - new Date(b.duedate)
                                })
                                for(k=0; k<=oneInvoiceNoArr.length-1; k++){
                                    if ( k!= 0) {
                                        oneInvoiceNoArr[k].checkDisable = true;
                                    }
                                }
                            }
                            vm.fullArr = vm.fullArr.concat(oneInvoiceNoArr)
                            oneInvoiceNoArr = [];
                        }
                    }else{
                        if (vm.outstandingInvoices.length != i) {
                            if (oneInvoiceNoArr.length >= 1) {
                                var sampleObj = oneInvoiceNoArr[oneInvoiceNoArr.length - 1];
                                if (sampleObj.invono == vm.outstandingInvoices[i].invono ) {
                                    
                                    oneInvoiceNoArr.push(vm.outstandingInvoices[i])
                                   
                                    oneInvoiceNoArr = oneInvoiceNoArr.sort(function(a,b){
                                        return new Date(a.duedate) - new Date(b.duedate)
                                    })
                                    
                                    for( var k=0; k<=oneInvoiceNoArr.length-1; k++){
                                        if ( k!= 0) 
                                            oneInvoiceNoArr[k].checkDisable = true;                                    
                                    }
                                    vm.fullArr = vm.fullArr.concat(oneInvoiceNoArr)
                                    oneInvoiceNoArr = [];
                                }

                            }else{
                                vm.fullArr.push(vm.outstandingInvoices[i])
                            } 
                        }
                    }
                }
            }    
        }

        function loadAdvancePaymentDetails(profileID,callback){
        

        var client =  $serviceCall.setClient("getUAmountByProfileID","payment");
                client.skip("0");
                client.take("10");
                client.profileID(profileID);
            
                client.ifSuccess(function(data){
                console.log(data)
                var data = data;
    
               
                if (data.length > 0) {
                    if (!data[0].uAmount)  data[0].uAmount = 0;
               
                        vm.payment.uAmount  =  angular.copy(parseFloat( data[0].uAmount));
                        (vm.payment.recievedAmount) ? (vm.nAmount = parseFloat(vm.payment.recievedAmount) + vm.payment.uAmount) : (vm.nAmount = vm.payment.uAmount); 

                 
                        // if (data[0].uAmount == 0) $scope.receiveRequired = true
                        // else $scope.receiveRequired = false;
                }     
                callback();
                });
                client.ifError(function(data){
                    
                    console.log("error loading advance payment")
                })
                
                client.postReq();
    }

     $scope.upload = function(ev) {
        /*$mdDialog.show({
            templateUrl: 'app/main/payments/views/Dialogs/showUploader.html',
            targetEvent: ev,
            controller: UploadCtrl,
            locals: {
                dating: ev
            }
        })*/
        openBrochure();
    }

    function openBrochure(){
    var position = $mdPanel.newPanelPosition()
    .absolute()
    .center()
    .center();
    var animation = $mdPanel.newPanelAnimation(); 
    animation.withAnimation($mdPanel.animation.FADE);
    var config = {
    animation: animation,
    attachTo: angular.element(document.body),
    controller: DialogCtrl,
    controllerAs: 'vm',
    templateUrl: 'app/main/payments/dialogs/uploader/uploader.html',
    panelClass: 'dialog-uploader',
    position: position,
    trapFocus: true,
    zIndex: 150,
    clickOutsideToClose: true,
    clickEscapeToClose: true,
    hasBackdrop: true
    };
    $mdPanel.open(config);
    };

    function DialogCtrl(mdPanelRef){
    var vm = this;
    vm.closeDialog = closeDialog;
    vm.uploadItem = uploadItem;
    vm.files = [];

    function closeDialog(){
    mdPanelRef.close();
    };

    function uploadItem(){
    mdPanelRef.close().then(function(mdPanelRef) {
    onClose(vm.files);
    });
    }
    
    };
    
    
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



    function paymentMethodChange(name){     

        if (name === "stripe") {

            vm.config = {
                publishKey: '',
                title: '12thdoor',
                description: "for connected business",
                logo: 'img/add.png',
                label: 'New Card',
            }

            var client =  $serviceCall.setClient("getPaymentKeys","setting");
            
            client.ifSuccess(function(data){
                var data = data;
                if (data)
                    vm.publishKey = data.publishable_key.replace('\\u000','');
                
                vm.config = {
                    publishKey:  vm.publishKey,
                    title: '12thdoor',
                    description: "for connected business",
                    logo: 'img/add.png',
                    label: 'New Card',
                }                
            
            });
            client.ifError(function(data){
            })
            client.appName(name)
            client.getReq();
        }
    }

    function UploadCtrl($scope, $mdDialog, $state){
 
        $scope.closeDialog = function () {  $mdDialog.hide()    }
        $scope.AddImage = function () {  $mdDialog.hide() }
    }

    function cardOptions(ev,callback){         
        if (vm.payment.paymentMethod === "stripe") {    debugger;
            $rootScope.$broadcast("call_stripe",ev,vm.config ,function(){                     
                
            })  
            $scope.$on('stripe-token-received', function(event, response) {
                console.log(response);
                vm.payment.token = response.id
                console.log(response.id)
                debugger;
                callback();
            });
        }else{
            callback();
        }
    }

    function amountLostFocus(index)
    {
        debugger;
        if(vm.fullArr[index].amount == "")
        {
        vm.fullArr[index].amount = 0;
        }
    }

    function checkItem(index, invo) { //outstanding invoice check box
        debugger
        // - vm.fullArr[index].instalment)
        if(vm.nAmount  <= 0 && invo.checked == true)
        {
            invo.checked = false;
            return;
        }

        ckClkInv();
        if (invo.checked) { //if checkbox is checked
debugger;
            //add by dushmantha
            if(vm.nAmount <= vm.fullArr[index].instalment)
            {
            //vm.fullArr[index].instalment = parseFloat(vm.fullArr[index].instalment) - parseFloat(vm.nAmount);
            //vm.fullArr[index].amount = vm.nAmount
            //vm.fullArr[index].amount = (parseFloat(vm.fullArr[index].famount) - parseFloat(vm.fullArr[index].instalment)).toFixed(2);
            vm.fullArr[index].amount = parseFloat(vm.nAmount).toFixed(2);//(parseFloat(vm.fullArr[index].instalment) - parseFloat(vm.nAmount) ).toFixed(2);
            getPaidAmount(vm.fullArr[index], vm.fullArr[index].amount,index);

            }else
            {
                vm.fullArr[index].amount = parseFloat(vm.fullArr[index].instalment).toFixed(2);;
                //vm.fullArr[index].instalment = parseFloat(vm.fullArr[index].instalment) - parseFloat(vm.fullArr[index].amount);;
                getPaidAmount(vm.fullArr[index], vm.fullArr[index].amount,index);
            }
            //added by dushmantha
          
            if ( vm.fullArr[index + 1]) {                    
                if (vm.fullArr[index].invono == vm.fullArr[index +1].invono) {
                    vm.fullArr[index + 1].checkDisable = false;
                }
            }
            if (vm.fullArr[index -1]) {                    
                if (vm.fullArr[index].invono == vm.fullArr[index -1].invono) {
                    vm.fullArr[index - 1].inputDisable = true;
                }
            }

            //invo.amount = 0;
            invo.inputDisable = false; 
            //invo.amount = invo.instalment;
            
            //vm.nAmount = parseFloat(vm.nAmount) - parseFloat(invo.instalment); //updating total available (nAmount=totalavailable)
            vm.nAmount = parseFloat(vm.nAmount) - parseFloat(invo.amount); // added by dushmantha

            // var recAmount = (parseFloat(invo.instalment) === parseFloat(invo.amount)) ? parseFloat(invo.amount) : 0;
            vm.payment.paidInvoice.push({ //array for insert paid invoices             
                amount: invo.instalment,
                invono: invo.invono,
                sdate: invo.sdate,
                duedate: invo.duedate,
                balance : (parseFloat(invo.instalment) - parseFloat(vm.fullArr[index].amount)).toFixed(2),
                termtype : invo.termtype,
                detailID : "",
                paidAmount : invo.amount,
                recAmount : invo.instalment,
                famount : invo.famount
            });
            vm.payment.aAmount = (parseFloat(vm.payment.aAmount) + parseFloat(invo.amount));
         
        } else if (!invo.checked) { //if checkbox is unchecked

            //added by dushmantha
            /*vm.fullArr[index].instalment = parseFloat(vm.fullArr[index].instalment) + parseFloat(vm.fullArr[index].amount);
            getPaidAmount(vm.fullArr[index], vm.fullArr[index].amount,index);*/
            //aded by dushmantha

            for(var o=index; o<=vm.fullArr.length-1; o++){  
                if (vm.fullArr[o-1]) {   
                    if (vm.fullArr[o].invono == vm.fullArr[o -1].invono) {
                        vm.fullArr[o - 1].inputDisable = false;
                        vm.fullArr[o].inputDisable = true;
                        break;
                    }else{
                        vm.fullArr[o].inputDisable = true;
                        break;
                    }
                }else{
                    vm.fullArr[o].inputDisable = true;
                    break;
                }
            }                
            for(var o=index; o<=vm.fullArr.length-1; o++){ 

                if (vm.fullArr[o+1]) {
                    if (vm.fullArr[o].invono == vm.fullArr[o +1].invono) {                       
                        if (vm.fullArr[o + 1].checked) {                            
                            vm.fullArr[o + 1].checked = false;
                            vm.fullArr[o + 1].checkDisable = true;
                            vm.fullArr[o + 1].inputDisable = true;
                            reverseCheckItem(o);
                        }else{
                            reverseCheckItem(o);
                            vm.fullArr[o + 1].checkDisable = true;
                            break;
                        }

                    }else if (vm.fullArr[o].invono != vm.fullArr[o +1].invono){
                        reverseCheckItem(o);
                        break; 
                    }  
                }else{
                    reverseCheckItem(o);
                    break; 
                }                
            }              
            console.log(vm.nAmount)
            function reverseCheckItem(o){
                for (var i = 0; i < vm.payment.paidInvoice.length; i++) { //removing invoice details from paid invoice array
                    if (vm.payment.paidInvoice[i]['invono'] == vm.fullArr[o].invono) { //cheking index for praticular invoice details
                        vm.payment.paidInvoice.splice(i,1);
                    }
                }
                if (vm.fullArr[o].termtype != "multipleDueDates") {
                    vm.payment.aAmount = parseFloat(vm.payment.aAmount) - parseFloat(vm.fullArr[o].amount)
                    vm.nAmount = parseFloat(vm.nAmount) + parseFloat(vm.fullArr[o].amount);

                    //aded by dushmantha
                    //vm.fullArr[o].instalment = parseFloat(vm.fullArr[o].instalment) + parseFloat(vm.fullArr[o].amount);
                    getPaidAmount(vm.fullArr[o], vm.fullArr[o].amount,index);
                    //aded by dushmantha

                }
                else if (vm.fullArr[o].termtype == "multipleDueDates") {
                    vm.payment.aAmount = parseFloat(vm.payment.aAmount) - parseFloat(vm.fullArr[o].amount)
                    vm.nAmount = parseFloat(vm.nAmount) + parseFloat(vm.fullArr[o].amount);

                    //aded by dushmantha
                    //vm.fullArr[o].instalment = parseFloat(vm.fullArr[o].instalment) + parseFloat(vm.fullArr[o].amount);
                    getPaidAmount(vm.fullArr[o], vm.fullArr[o].amount,index);
                    //aded by dushmantha

                }
                vm.fullArr[o].amount = "";
            }
        }
    }

    function ckClkInv(){
        var i = vm.fullArr.length;
        while (i--) {
           if (vm.fullArr[i].checked) { vm.receiveRequired = false; break }else vm.receiveRequired = true;
        }
    }

    function OnRecivedAmountLostFocus()
    {
        //added by dushmantha
        if((vm.payment.recievedAmount) < (vm.payment.aAmount - vm.payment.uAmount) )
        {
            debugger
            vm.payment.recievedAmount =  (parseFloat(vm.payment.aAmount) -  parseFloat(vm.payment.uAmount)).toFixed(2);//vm.LastEnterdAmount;
            netAmount();
            return;
        }
        vm.LastEnterdAmount = vm.payment.recievedAmount;
        //added by dushmantha
    }

    function netAmount() {debugger;
        
        
       
        if( parseFloat(vm.payment.aAmount) != 0){
            if (vm.payment.recievedAmount) {
                vm.nAmount = ( ( parseFloat(vm.payment.uAmount) -  parseFloat(vm.payment.aAmount) )    + parseFloat(vm.payment.recievedAmount) );
            }else{
                vm.nAmount =  parseFloat(vm.payment.uAmount) -  parseFloat(vm.payment.aAmount);
            }
        }
        else { 
            if (vm.payment.recievedAmount) {
                vm.nAmount = parseFloat(vm.payment.uAmount)+ parseFloat(vm.payment.recievedAmount);
            }else{
                vm.nAmount = parseFloat(vm.payment.uAmount) 
            }          
        }
    }

    function submit(ev) { debugger;
        if(vm.selectedItem1 == null)
        {
            $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Select Profile id').content('Please Select a Profile id').ariaLabel('').ok('OK').targetEvent());
            return;
        }
        if (!vm.payment.paymentMethod) {
            vm.payment.paymentMethod = "none"
            $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Select Payment Method').content('Please Select a Payment Method Type').ariaLabel('').ok('OK').targetEvent());
            return;
        }
        else{
            vm.submitProgress = true; 
            vm.payment.favoriteStar = false;
            vm.payment.favouriteStarNo = 1; 
            vm.payment.paymentStatus = "active";
            vm.payment.profileID = vm.selectedItem1.profileID;
            vm.payment.profileAddress = vm.selectedItem1.cusAddress;
            vm.payment.profileEmail = vm.selectedItem1.email;
            vm.payment.profileName = vm.selectedItem1.display;        
            vm.payment.uploadImage = [];      
            
            vm.payment.customField = [];

            if (vm.payCustArr.length > 0) {
                for(j=0; j<= vm.payCustArr.length-1; j++){
                    vm.payment.customField.push({
                        lable : vm.payCustArr[j].labelShown,
                        type : vm.payCustArr[j].type,
                        value : vm.payCustArr[j].inputType
                    })  
                }            
            }

            if(!vm.payment.recievedAmount || vm.payment.recievedAmount === "" )
               vm.payment.paidTypes = "advance";
            else                
               vm.payment.paidTypes = "normal";

            vm.payment.paymentLog = {
                userName : userName,
                lastTranDate : new Date(),
                createDate : new Date(),
                modifyDate : new Date(),
                createUser : "",
                modifyUser : "", 
                UIHeight : '30px;', 
                type : "activity",
                description : "payment added by " + userName,
                status : "Active",
                logID :""
            };

            if ((parseFloat(vm.nAmount) == parseFloat(vm.payment.aAmount)) || parseFloat(vm.nAmount) == 0){

                vm.payment.uAmount = vm.nAmount;
                cardOptions(ev,function(){
                    uploadImage(function(){
                        savePaymentToObjectstore();
                    })                    
                })

            }else if(parseFloat(vm.nAmount) > 0){
                var confirm = $mdDialog.confirm()
                  .title('Unapplied advances')
                  .content('Unapplied advances USD ' + vm.nAmount.toFixed(2) + ' This amount can be applied on future invoices.')
                  .ariaLabel('Lucky day')
                  .targetEvent()
                  .ok('OK')
                  .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {debugger; 

                    vm.payment.uAmount = vm.nAmount;
                    cardOptions(ev,function(){
                        uploadImage(function(){
                            savePaymentToObjectstore();
                        })
                    })
                }, function() {
                    $mdDialog.hide();
                    vm.submitProgress = false;
                }); 
            }else if(parseFloat(vm.nAmount) < 0){
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('Warning').content('Total payments applied exceeds the total available').ariaLabel('').ok('OK').targetEvent());
                vm.submitProgress = false;
            }

        }           
    }

    function savePaymentToObjectstore(){debugger; 
        var paymentObj = {
            "payment" : vm.payment,
            "image": vm.payment.image,
            "appName" : "Payments",
            "permissionType" : "add"
        }
        //var jsonString = JSON.stringify(paymentObj);
        
        //Start POSTing payment data
        var client =  $serviceCall.setClient("makePayment","process");
            
            client.ifSuccess(function(data){
                
                if (data.isSuccess) {  debugger;            
                    $state.go('app.payments.pay', {
                        'paymentid': data.ID
                    });
                }else{
                    $scope.submitProgress = false; 
                    $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('error occure ').content('error occure while connecting to stipe. please try again later').ariaLabel('').ok('OK').targetEvent());
                }
            
            });
            client.ifError(function(data){
                $mdDialog.show($mdDialog.alert().parent(angular.element(document.body)).title('error occure ').content('error occure while connecting to stipe. please try again later').ariaLabel('').ok('OK').targetEvent());
            })
            client.postReq(paymentObj);
        //End POSTing payment data
    }

    function onblur(ev)
    {
        $(ev.target).css("color","black");
    }

    function uploadImage(callback){
        
        if(vm.brochureFiles != null)
        {
        if (vm.brochureFiles.length > 0) {
            for (var indexx = 0; indexx < vm.brochureFiles.length; indexx++) {
                var client = $imageUploader.setImage(vm.brochureFiles[indexx].uniqueCode);
                client.ifSuccess(function(data){  
                   

                          vm.payment.image.push({
                            ID : "",
                            name : vm.brochureFiles[vm.UploadedImageCount].name,
                            size : vm.brochureFiles[vm.UploadedImageCount].size,
                            uniqueCode : vm.brochureFiles[vm.UploadedImageCount].uniqueCode,
                            appGuid : "",
                            appName : "PAYMENT",
                            date : new Date(),
                            createUser : "",
                            type : "image"
                          })
                          vm.brochureFiles++;
                          callback();
                        
                                    
                });
                client.ifError(function(data){ 
                    callback();
                });
                client.sendImage(vm.brochureFiles[indexx])

              
                      
            }
            }else
                callback();
            }else
            callback();
    }

    vm.history = function(item) {  
        $mdDialog.show({
            templateUrl: 'app/main/payments/dialogs/history/sampleDialogBox.html',
            controller: paymentHistory,
            controllerAs:'vm',
            locals: {
                obj: item 
            }
        })
    }

    function paymentHistory($scope, obj, $mdDialog) { 
    var vm = this;
    vm.moveToPayment = moveToPayment;
    vm.close = close;

        function moveToPayment(item){
           $state.go('app.payments.pay', {
                'paymentid': item.receiptID
            })
           $mdDialog.hide()
        }

        function close() {
            $mdDialog.hide();
        }
        vm.invoiceHistory = [];

        

        var JSONobj = {
                "where": "profileID = '"+obj.customerid+"' and paymentStatus <> 'cancel'"
            };
        

        var client =  $serviceCall.setClient("getAllByQuery","payment");
                client.skip("0");
                client.take("100");
                client.orderby("");
                client.isAscending("true");
            
                client.ifSuccess(function(data){debugger;
                var data = data.result;
                if (data.length > 0) { 
                    for (var i = 0; i <= data.length - 1; i++) {
                        vm.invoiceHistory.push({
                            lastTranDate: data[i].lastTranDate,
                            receiptID: data[i].receiptID,
                            paymentMethod: data[i].paymentMethod,
                            aAmount: data[i].aAmount,
                            paymentComment: data[i].paymentComment
                        });
                    }
                }

                });
                client.ifError(function(data){
                    
                })
                
                client.postReq(JSONobj);

        /*$http({
            url : "/services/duosoftware.payment.service/payment/getAllByQuery?skip=0&take=100&orderby=&IsAscending=true",
            method : "POST",
            headers:{
                securityToken: "123"
            },
            data:{
                "where": "profileID = '"+obj.customerid+"' and paymentStatus <> 'cancel'"
            }
        }).then(function(response){
            var data = response.data.result;
            if (data.length > 0) { 
                for (i = 0; i <= data.length - 1; i++) {
                    $scope.invoiceHistory.push({
                        lastTranDate: data[i].lastTranDate,
                        receiptID: data[i].receiptID,
                        paymentMethod: data[i].paymentMethod,
                        aAmount: data[i].aAmount,
                        paymentComment: data[i].paymentComment
                    });
                }
            }

        },function(response){
            console.log("error loading payment by profile ")
        })*/
    }

    function getPaidAmount(obj, oldValue,index){
debugger;
        if (obj.amount == "")   
            {
                //obj.amount = 0;
                if(oldValue != "")
                {
                vm.nAmount = parseFloat(vm.nAmount) + parseFloat(oldValue);
                vm.payment.aAmount = ( parseFloat(vm.payment.aAmount) - parseFloat(oldValue) );
                }
                oldValue = 0;
                return;
            }
        else if (oldValue == "")    oldValue = 0;       
        
        if (parseFloat(obj.amount) > parseFloat(obj.instalment)) 
            obj.amount = oldValue
        else{
            
            vm.payment.aAmount = ( parseFloat(vm.payment.aAmount) - parseFloat(oldValue) ) + parseFloat(obj.amount); 
            var difference = (parseFloat(oldValue) - parseFloat(obj.amount)).toFixed(2);

            if (vm.nAmount >= 0)    vm.nAmount =  (parseFloat(vm.nAmount) + parseFloat(difference)).toFixed(2);            
            else    vm.nAmount = (( parseFloat(vm.nAmount) + parseFloat(oldValue) ) - parseFloat(obj.amount)).toFixed(2);          

            vm.nAmount = parseFloat(vm.nAmount);
            for (var i = 0; i < vm.payment.paidInvoice.length; i++) {  
                if ( (vm.payment.paidInvoice[i]['invono'] == obj.invono) && (vm.payment.paidInvoice[i]['duedate'] == obj.duedate) ) {
                    vm.payment.paidInvoice[i].balance = parseFloat(vm.payment.paidInvoice[i].amount) - parseFloat(obj.amount);
                    vm.payment.paidInvoice[i].paidAmount =  parseFloat(obj.amount);
                    // vm.payment.paidInvoice[i].recAmount = (parseFloat(obj.instalment) === parseFloat(obj.famount)) ? parseFloat(obj.famount) : vm.payment.paidInvoice[i].balance;
                }
            } 
        }
        if (parseFloat(obj.amount) < parseFloat(obj.instalment) ){
            if (vm.fullArr[index +1]) {                
                if (vm.fullArr[index].invono == vm.fullArr[index +1].invono) {
                    vm.fullArr[index + 1].checkDisable = true;
                }
            }
        }else if(parseFloat(obj.amount) == parseFloat(obj.instalment)){
            if (vm.fullArr[index +1]) {
                vm.fullArr[index + 1].checkDisable = false;
            }
        }
    }
    

    }
})();