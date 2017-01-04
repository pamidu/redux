(function ()
{
    'use strict';

    angular
    .module('app.expenses')
    .controller('expComposeController', expComposeController);

    /** @ngInject */
    function expComposeController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state,settingSummary,supplierGetAll)
    {
        var vm = this;
        vm.toggleChildStates = toggleChildStates;
        vm.settingSummary=settingSummary;
        console.log(vm.settingSummary);

        vm.supplierGetAll=supplierGetAll;
        console.log(vm.supplierGetAll);


        vm.expense = {  
            "amount":"",
            "billable":"",
            "category":"",
            "dueDate":"",
            "reference":"",
            "status":"",
            "tax":"",
            "uploadImage":[  
            ],
            "date":"",
            "description":"",
            "vendor":"",
            "favouriteStar":"",
            "favouriteStarNo":"",
            "tags":[  

            ],
            "totalValue":"",
            "totalValueLabel":"",
            "assignCustomer":"",
            "assignType":"",
            "assignID":""
        }

        vm.expense.uploadImage = [];
        //??upload service
        vm.expense.tax={"activate":true,"compound":false,"labelIndividualTaxStatus":"Inactivate","positionID":"","rate":"0","taxID":0.001,"taxName":"No Tax","type":"individualtaxes"}

        vm.selectedItemSupplier = null;
        vm.searchTextSupplier = null;
        vm.querySearchSupplier = querySearchSupplier;
        vm.selectedItem = null;
        vm.searchText = null;
        //vm.querySearch = querySearch;

        vm.initialAmount = "Onlyamount";
        vm.totalText = "(Without Tax)";
        vm.finalAmount=finalAmount;
        vm.totalUSD=0;

        vm.supplierArr = [];
        vm.projectarr = [];
        vm.customerarr = [];
        vm.fullarr = [];



        vm.currency=vm.settingSummary[0].profile.baseCurrency;

        function GetCategory(){ 
            vm.CategoryArray = [];
            var CatArr = vm.settingSummary[0].preference.expensePref.expenseCategories;

            for (var i = CatArr.length - 1; i >= 0; i--) {
                if (CatArr[i].activate) {
                    vm.CategoryArray.push(CatArr[i].expenseCategory);
                    console.log(vm.CategoryArray);
                }
            }

        }
        GetCategory();

        function getTaxes(){
            vm.taxesArr = [];  
            var individualTaxes = [];
            var multiplelTaxes = [];
            console.log(vm.settingSummary[0].taxes.individualTaxes);
            if(vm.settingSummary[0]){    
                individualTaxes = vm.settingSummary[0].taxes.individualTaxes; 
                multiplelTaxes = vm.settingSummary[0].taxes.multipleTaxGroup; 
            }
            if (individualTaxes.length > 0) {
                for(var i=0; i<=individualTaxes.length-1; i++){
              if(individualTaxes[i].activate){            // only dispaly activate = true individual taxes
                vm.taxesArr.push(individualTaxes[i]);
                console.log(vm.taxesArr);
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

}
getTaxes();

function querySearchSupplier(query) { 
    var results = [];
    for (var i = 0, len = vm.supplierArr.length; i < len; ++i) {
        if (vm.supplierArr[i].value.indexOf(query.toLowerCase()) != -1) {
            results.push(vm.supplierArr[i]);
        }
    }
    return results;
}

function loadAllSupplier(){
    var data = vm.supplierGetAll.result;
    if(data.length>0){
        for (var i = data.length - 1; i >= 0; i--) {
            if(data[i].status=="Active"){
                vm.supplierArr.push({
                    display: data[i].firstName + ' ' + data[i].lastName
                    , value: data[i].firstName.toLowerCase() + ' ' + data[i].lastName.toLowerCase()
                    , id : data[i].profileID
                    , type : 'contact'
                    , image: "img/ic_supervisor_account_24px.svg"
                });
            }
        }; 
    }
}

loadAllSupplier();


function finalAmount(obj){ 
    console.log(obj);
    var amountWithTax; 
    var taxObj;

    if (obj.amount != "" && obj.amount != null && obj.tax.taxName!="No Tax") {
        taxObj= obj.tax;
        console.log(taxObj);
        if (taxObj.type == "individualtaxes") { 
            amountWithTax = (parseFloat(obj.amount)/100) * parseInt(taxObj.rate);
            vm.totalUSD = parseFloat(obj.amount) + parseFloat(amountWithTax); 
            vm.initialAmount = "Fullamount"; 
            vm.totalText = "(With Tax)";
            vm.fullamount = angular.copy(vm.totalUSD);
        }else if (taxObj.type == "multipletaxgroup") {
            calculateMultipleTax(obj,taxObj);
        }
    }else if (obj.tax.taxName="No Tax" || obj.tax == null) {       
        vm.totalUSD = parseFloat(obj.amount);
        vm.initialAmount = "Onlyamount";
        vm.totalText = "(Without Tax)";
    }
}

function calculateMultipleTax(obj,taxObj){
    console.log(obj);
    var sumCompundFalse = 0.0;
    var compoundArr = [];

    for(i=0; i<=taxObj.individualTaxes.length -1; i++){ 
        if (taxObj.individualTaxes[i].compound === false && taxObj.individualTaxes[i].activate === true ) {
            var amountWithTax = (parseFloat(obj.amount)/100) * parseInt(taxObj.individualTaxes[i].rate);
            sumCompundFalse += amountWithTax;
        }else if (taxObj.individualTaxes[i].compound === true && taxObj.individualTaxes[i].activate === true) {
            compoundArr.push(taxObj.individualTaxes[i]);
        }
    }

    vm.totalUSD = parseFloat(obj.amount) + sumCompundFalse;

    if (compoundArr.length > 0) {
        compoundArr = compoundArr.sort(function(a,b){
            return a.positionID - b.positionID;
        });
        for(k=0; k<=compoundArr.length-1; k++){
            var amountWithTax = (parseFloat(vm.totalUSD)/100) * parseInt(compoundArr[k].rate);
            vm.totalUSD += amountWithTax;
        }
    }
    vm.fullamount = angular.copy(vm.totalUSD);
    vm.initialAmount = "Fullamount"; 
    vm.totalText = "(With Tax)";
}


function toggleChildStates(toggledState){
    $state.go(toggledState);
};
}
})();