(function ()
{
    'use strict';

    angular
        .module('app.products')
        .controller('proComposeController', proComposeController);

    /** @ngInject */
    function proComposeController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state,settingSummary,uploaderService,$imageUploader,$serviceCall,$mdPanel,fileUploader,$auth )
    {
        var vm = this, 
            individualTaxes = [],
            multiplelTaxes = [];
        var loginName = ($auth.getSession()) ? $auth.getSession().Name : "";
        var userName =  ($auth.getUserName()) ? $auth.getUserName() : "";

        uploaderService.setArraysEmpty();

        vm.brochureFiles = [];

        vm.imageArray = [];

        vm.stockDisabled = false;

        vm.settingSummary = settingSummary;

        vm.toggleChildStates = toggleChildStates;

        vm.changeInventory = changeInventory;

        vm.checkProductCode = checkProductCode;

        vm.openBrochure = openBrochure;

        vm.submit = submit;

        vm.proStatus = true;

        vm.showBrochure = false;

        init().prevState();


        vm.product = {
          "productCategory" : "",
          "productCode"     : "", 
          "productUnit"     : "",
          "productName"     : "",  
          "brand"           : "",
          "costPrice"       : 0,
          "customFields"    : [],
          "date"            : "",
          "deleteStatus"    : "",
          "description"     : "",
          "favouriteStar"   : "",
          "favouriteStarNo" : "",
          "inventory"       : "", 
          "productPrice"    : "",
          "productTax"      : {},
          "progressShow"    : "",
          "status"          : "", 
          "tags"            : [], 
          "lastTranDate"    : "",
          "productLog"      : {},
          "productID"       : "",
          "createDate"      : "",
          "modifyDate"      : "",
          "createUser"      : "",
          "modifyUser"      : "",
          "baseCurrency"    : "",
          "quantity"        : "",
          "uploadBrochure"  : [],
          "uploadImages"    : []
        };  
        if (vm.settingSummary.length > 0) {
            GetProductCategory(vm.settingSummary,function(){   // get product category from settings 
                GetProductBrand(vm.settingSummary,function(){    // get product brands from settings 
                  GetCustFields(vm.settingSummary,function(){    // get product customer fields from settings 
                    GetProUnits(vm.settingSummary,function(){    // get product units from settings 
                        GetProTaxes(vm.settingSummary,function(){  // get product taxes from settings 
                            GetBaseCurrency(vm.settingSummary)       // get product base currency from settings 
                            if (vm.settingSummary[0].preference) {
                                vm.inventoryPattern = vm.settingSummary[0].preference.inventoryPref.grnPrefix + vm.settingSummary[0].preference.inventoryPref.grnSequence;
                            }
                        });
                    });
                  });
                });
            });
        }
        

        function init(){
            var service =  {
                prevState : prevState
            }

            return service;

            function prevState(){
                vm.prevState = ($state.params.appID) ? 'app.contacts.customer' : 'app.products.pro';
            }
        };
        function toggleChildStates(toggledState){ 
            $state.go(toggledState);
        };

        function GetBaseCurrency(arr){
            if(arr[0].profile)
               vm.product.baseCurrency = arr[0].profile.baseCurrency;
        };

        function openBrochure(type){
            fileUploader.uploadFile(type)
            fileUploader.result(function(arr){
                if (type === 'brochure') {
                    vm.brochureFiles = [];
                    vm.brochureFiles = arr;

                    vm.proBrochure = vm.brochureFiles[0].name
                    vm.showBrochure = true;

                }else if(type === 'image'){
                    vm.imageArray = [];
                    vm.imageArray = arr;
                    loadImage();
                }
            })
        };
 
        function loadImage(){
            var reader = new FileReader();
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

        function GetProTaxes(arr,callback){

            individualTaxes = [];
            multiplelTaxes = []; 

            vm.taxesArr = [];  
            if(arr[0] && arr[0].taxes){    
                individualTaxes = arr[0].taxes.individualTaxes; 
                multiplelTaxes = arr[0].taxes.multipleTaxGroup; 
            }

            if (individualTaxes.length > 0) {
                for(var i=0; i<=individualTaxes.length-1; i++){
                    if(individualTaxes[i].activate){            // only dispaly activate = true individual taxes
                        vm.taxesArr.push(individualTaxes[i]); 
                    }
                }
            }
            if (multiplelTaxes.length > 0) {
                for(var j=0; j<=multiplelTaxes.length-1; j++){
                    if(multiplelTaxes[j].activate){             // only dispaly activate = true multiple taxes
                        vm.taxesArr.push(multiplelTaxes[j]); 
                    }
                }
            } 
            callback();
        }

        function GetProUnits(arr,callback){
            vm.proUnits = [];
            var ProductUnits = [];
                if (arr[0].preference) {
                    if(arr[0].preference.productPref)
                        ProductUnits = arr[0].preference.productPref.units;
                        if (ProductUnits.length > 0) {
                            for(var i=0; i<= ProductUnits.length -1; i++){
                                if(ProductUnits[i].activate){  // only dispaly activate = true Units
                                    vm.proUnits.push(ProductUnits[i].unitsOfMeasurement);
                                    if (ProductUnits[i].unitsOfMeasurement == "Each") {  // if unit name "each" is exist in the settings app then it should be pre selected in the form 
                                        vm.product.productUnit= ProductUnits[i].unitsOfMeasurement;
                            }  
                        }
                    }                    
                }
            }      
            callback();
        }

        function GetCustFields(arr,callback){
            vm.proCustArr = [];
            var CustArr = [];
            if (arr[0].preference) {

                if(arr[0].preference.productPref)
                  CustArr = arr[0].preference.productPref.cusFiel; 
                if (CustArr.length > 0) {
                  for(var i=0; i<= CustArr.length-1; i++){
                    vm.proCustArr.push(CustArr[i]);
                  }
                }  
            }     
            callback();
        }   

        function GetProductBrand(arr,callback){
          vm.proBrandArray = [];
          var BrandArray = [];
            if (arr[0].preference) { 

              if(arr[0].preference.productPref)
                BrandArray = arr[0].preference.productPref.productBrands; 
                if (BrandArray.length > 0) {
                    for (var i = BrandArray.length - 1; i >= 0; i--) {
                        if (BrandArray[i].activate) {  // only dispaly activate = true Brand
                            vm.proBrandArray.push(BrandArray[i].productBrand);
                        }
                    }
                }   
            }   
            callback();
        }

        function GetProductCategory(arr,callback){
          vm.categoryArray = [];
          var CatArray = [];
          if (arr[0].preference) {            
              if(arr[0].preference.productPref)
                CatArray = arr[0].preference.productPref.productCategories; 
              if (CatArray.length > 0) {
                for (var i = CatArray.length - 1; i >= 0; i--) {
                  if (CatArray[i].activate) {  // only dispaly activate = true categories
                        vm.categoryArray.push(CatArray[i].productCategory);
                  }
                }
              }   
          }   
          callback();
        }

        function changeInventory(type) { // inventory tracking yes or no 
            if (type == "No") {
                vm.stockDisabled = true; // disable stock level
                vm.product.quantity = "";
            } else if (type == "Yes") {
                vm.stockDisabled = false; // enable stock level
            };
        }
        function checkProductCode(){
            vm.productCodeExsist = false;
            vm.submitProgress = true;
            vm.proCodeErr = '';
            if (vm.product.productCode != "") {
                if(vm.product.productCode.indexOf('-') === -1) {
                
                vm.proCodeErr = 'Product Code Format is invalid.. please follow this format "APP-0002".';
                vm.productCodeExsist = true;
                vm.submitProgress = true;

                }else if((vm.product.productCode.indexOf('-') != 3)){
                  
                    vm.proCodeErr = 'Product Code Format is invalid.. please follow this format "APP-0002".';
                    vm.productCodeExsist = true;
                    vm.submitProgress = true;
                }else if((vm.product.productCode.slice(4).toString().length != 4) || (!isNormalInteger(vm.product.productCode.slice(4).toString()))){
                  
                    vm.proCodeErr = 'Product Code Format is invalid.. please follow this format "APP-0002".';
                    vm.productCodeExsist = true;
                    vm.submitProgress = true;
                }else{
                    var client =  $serviceCall.setClient("getAllByQuery","product"); // method name and service
                    client.ifSuccess(function(data){  //sucess 
                        var data = data.result;
                        if (data.length > 0) {
                            vm.productCodeExsist = true;
                            vm.submitProgress = true; 
                            vm.proCodeErr = 'Product code already exist';
                        }else{

                            vm.productCodeExsist = false;
                            vm.submitProgress = false; 
                        }
                    })
                    client.ifError(function(data){ //falce
                        vm.productCodeExsist = true;
                        vm.submitProgress = false;
                        vm.proCodeErr = 'please enter different product code';
                    })
                    client.skip(0);
                    client.take(1);
                    client.orderby('productCode');
                    client.isAscending(false);
                    client.postReq( {
                        where: "productCode = '" +vm.product.productCode + "'",
                    }); 
                }
            }      
        }

        function isNormalInteger(str) { // check weather string is integer
          return /^\d+$/.test(str);
        }

        function submit() {
            vm.product.createDate = new Date();
            vm.product.modifyDate = new Date();

            if (!vm.product.productPrice) 
               vm.product.productPrice = "0";

            if(vm.productTax)  
               vm.product.productTax = vm.productTax
            else{
                if (individualTaxes.length > 0) {
                    for(var i=0; i<=individualTaxes.length-1; i++){
                        if(individualTaxes[i].activate){            // only dispaly activate = true individual taxes 
                            if (individualTaxes[i].taxName == "No Tax")  // if tax name "each" is exist in the settings app then it should be pre selected in the form 
                               vm.product.productTax= individualTaxes[i]
                        }
                    }
                }
            } 
            if (!vm.productCodeExsist) 
               saveRequest();
        }

        function saveRequest(){
            vm.submitProgress = true; // show the progress bar
            vm.proCodeErr = ' ';
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; 
            var yyyy = today.getFullYear();

            if (dd < 10) 
                dd = '0' + dd          
            if (mm < 10) 
                mm = '0' + mm

            today = mm + '/' + dd + '/' + yyyy; // get current date
 

            if (vm.imageArray.length > 0) {
                for (var indexx = 0; indexx < vm.imageArray.length; indexx++) { 
                    var client = $imageUploader.setImage(vm.imageArray[indexx].uniqueCode);
                    client.ifSuccess(function(data){                    
                    });
                    client.ifError(function(data){ 
                    });
                    client.sendImage(vm.imageArray[indexx])         
                }
            };
            if (vm.brochureFiles.length > 0) {
                for (var indexx = 0; indexx < vm.brochureFiles.length; indexx++) {
                    var client = $imageUploader.setImage(vm.brochureFiles[indexx].uniqueCode);
                    client.ifSuccess(function(data){                    
                    });
                    client.ifError(function(data){ 
                    });
                    client.sendImage(vm.brochureFiles[indexx])     
                  // http call for brochure upload            
                }
            };
          
            vm.product.progressShow = "false"
            vm.product.deleteStatus = false
            vm.product.favouriteStar = false;

            vm.product.status = (vm.proStatus) ? "Active" : "Inactive"; 

            vm.product.favouriteStarNo = 1;
            vm.product.date = today; 
            vm.product.lastTranDate = new Date() // for backend services
            vm.product.customFields =[];
            if (vm.ProCustArr) 
                vm.product.customFields = vm.ProCustArr;
 
            vm.product.image = []; 
            if (vm.imageArray.length > 0) {
                for(var i=0; i<= vm.imageArray.length-1; i++){
                  var test = {
                    ID : "",
                    name : vm.imageArray[i].name,
                    size : vm.imageArray[i].size,
                    uniqueCode : vm.imageArray[i].uniqueCode,
                    appGuid : "",
                    appName : "PRODUCT",
                    date : new Date(),
                    createUser : "",
                    type : "image"
                  }
                  vm.product.image.push(test);
                  vm.product.uploadImages.push(test);
                }
            }  
            if (vm.brochureFiles.length > 0) {
                for(var i=0; i<= vm.brochureFiles.length-1; i++){
                    var test = {
                        ID : "",
                        name : vm.brochureFiles[i].name,
                        size : vm.brochureFiles[i].size,
                        uniqueCode : vm.brochureFiles[i].uniqueCode,
                        appGuid : "",
                        appName : "PRODUCT",
                        date : new Date(),
                        createUser : "",
                        type : "brochure"
                    }
                    vm.product.image.push(test);
                    vm.product.uploadBrochure.push(test);
                }
            }  
          
            vm.product.productLog = {
                userName : userName,
                lastTranDate : new Date(),
                description : "Product Added By " +loginName,
                productCode :"",
                productNum : "",
                UIHeight : '30px;', 
                type : "activity",
                status : "Active",
                createDate:new Date(),
                modifyDate:new Date(),
                createUser:userName,
                modifyUser:userName,
                logID:"-888",
                productID :""
            }; 

            var serviceObj = {
                "product" : vm.product,
                "image" : vm.product.image,
                "inventoryEnabled" : {
                    "inventoryEnabled" : vm.product.inventory
                },
                "appName" : 'Products',
                'permissionType' : 'add',
                'invSequence' : vm.inventoryPattern
            }
            var jsonString = JSON.stringify(serviceObj);

            var client =  $serviceCall.setClient("insertProduct","process"); // method name and service
            client.ifSuccess(function(data){  //sucess 
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content('Product Successfully Saved.')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent()
                    );
                vm.submitProgress = false; 
                console.log(data)
                $state.go("app.products.pro");
                // $state.go("app.products.pro.newDetail",{'itemID' : data.ID});

            })
            client.ifError(function(data){ //falce 
                var data = data.data
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .content(data.message)
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                    .targetEvent()
                    );
                vm.submitProgress = false;
            })
            client.skip(10);
            client.postReq(jsonString);
        }
    }
})();