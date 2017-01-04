(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogEditPrefInvoiceController',DialogEditPrefInvoiceController);

  /** @ngInject */
  function DialogEditPrefInvoiceController($scope,$mdDialog,cusFieldsInvoiceEdit)
  {
      // use the below code on all child view controllers
      var vm = this;

      vm.toggleSidenav = toggleSidenav;

      vm.submit=submit;

      vm.fields=[];

      vm.inputType="";

      function toggleSidenav(sidenavId)
      {
        $mdSidenav(sidenavId).toggle();
      }
      // dont change above code 
      vm.cusFieldsInvoiceEdit=cusFieldsInvoiceEdit;

      vm.type=vm.cusFieldsInvoiceEdit.type;
      console.log(vm.type);
      vm.labelShown=vm.cusFieldsInvoiceEdit.labelShown;
      vm.inputType=vm.cusFieldsInvoiceEdit.inputType;
      vm.fields=vm.cusFieldsInvoiceEdit.fields;

      function submit() {

        var objEdit={};
        if(vm.type=='textBox'){
          objEdit.id=vm.cusFieldsInvoiceEdit.id;
          objEdit.labelShown=vm.labelShown;
          objEdit.inputType=vm.inputType;
          objEdit.fields=[];
          objEdit.type=vm.type;
          console.log(objEdit);
          $mdDialog.hide(objEdit);
        }
        else{
          objEdit.id=vm.cusFieldsInvoiceEdit.id;
          objEdit.labelShown=vm.labelShown;
          objEdit.inputType="";
          objEdit.fields=vm.fields;
          objEdit.type=vm.type;
          console.log(objEdit);
          $mdDialog.hide(objEdit);
        }

      };

      vm.cancel = function() {
        $mdDialog.cancel();
      };


    }
  })();