(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogmultipletaxgroupEditController',DialogmultipletaxgroupEditController);

  /** @ngInject */
  function DialogmultipletaxgroupEditController($rootScope,$mdDialog,multipletaxgroup)
  {
    	// use the below code on all child view controllers
    	var vm = this;

    	vm.toggleSidenav = toggleSidenav;

      function toggleSidenav(sidenavId)
      {
        $mdSidenav(sidenavId).toggle();
      }
    	// dont change above code !

      vm.submit=submit;
      vm.selectedtaxe=selectedtaxe;
      vm.deleteselecttax=deleteselecttax;
      vm.loadAllIndividualTaxes=[];

      vm.individualTaxes = new Array();
      for (var i = $rootScope.individualTaxes.length - 1; i >= 0; i--) {
        if($rootScope.individualTaxes[i].activate==true){
          if($rootScope.individualTaxes[i].taxID !== 0.001){
           vm.loadAllIndividualTaxes.push($rootScope.individualTaxes[i]);
         }
       }
     }
     // vm.loadAllIndividualTaxes=$rootScope.individualTaxes;

     vm.multipletaxgroup=multipletaxgroup;
     vm.mulipleTaxName=vm.multipletaxgroup.taxName;
     vm.individualTaxes=vm.multipletaxgroup.individualTaxes;
     vm.multipletaxgroup.labelMultipleTaxStatus="Inactivate";

     function loadselctedindivitax(){
      vm.loadselctedtax= vm.individualTaxes;
      console.log(vm.loadselctedtax);
    } 

    function selectedtaxe(tax){

     console.log(tax);
     var taxJson = JSON.parse(tax);
     var available = false;
    // if(taxJson.compound){
      for (var j = vm.individualTaxes.length - 1; j >= 0; j--) {
        if(vm.individualTaxes[j].compound ) {
          available = true;
          vm.text="Only one compund tax can be associated to a tax group along with other taxes.";
          break;
        }

        if(vm.individualTaxes[j].taxName==taxJson.taxName) {
          available = true; 
          vm.text="";
          break;
        }
      }

      if(!available){
        vm.text="";
        vm.individualTaxes.push(JSON.parse(tax));
      }

      for(var i=0; i < vm.individualTaxes.length; i++ ){
        console.log(i);
        vm.individualTaxes[i].positionID=i;
      }

      console.log(vm.individualTaxes);
      loadselctedindivitax()

    };

    function deleteselecttax(loadselctedtax, index){  
     vm.individualTaxes.splice(index, 1);
   }


   function submit() {

    var obj={};
    obj.multipleTaxGroupID=vm.multipletaxgroup.multipleTaxGroupID;
    obj.taxName=vm.mulipleTaxName;
    obj.individualTaxes=vm.individualTaxes;
    obj.activate=true;
    obj.type="multipletaxgroup";
    obj.labelMultipleTaxStatus="Inactivate";
    $mdDialog.hide(obj);

  };

  vm.sortableOptions = {

 orderChanged: function(event) {//Do what you want
  console.log(event);
  console.log(event.dest.index);
  console.log(event.source.itemScope.item.taxID);
  
  console.log(event.dest.sortableScope.modelValue[event.dest.index].taxID);
  
  //$scope.individualtaxes.push({positionId:event.dest.index});
  if(event.source.itemScope.item.taxID == event.dest.sortableScope.modelValue[event.dest.index].taxID){
    vm.individualTaxes[event.dest.index].positionID=event.dest.index;
    console.log(vm.individualTaxes[event.dest.index].positionID);
    vm.individualTaxes[event.source.index].positionID=event.source.index;
    for (var i=0; i< vm.individualTaxes.length; i++){
      vm.individualTaxes[i].positionID=i;
    }

  }
//when else part others position id hav to change according to current index

}

};


vm.cancel = function() {
  $mdDialog.cancel();
};


}
})();