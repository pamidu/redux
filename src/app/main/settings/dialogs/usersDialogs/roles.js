(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogrolesController',DialogrolesController);

  /** @ngInject */
  function DialogrolesController($rootScope,$mdDialog)
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
     vm.button="Add";
     vm.roles=$rootScope.roles;

     vm.appLabel=["Invoices","Estimates","Credit Notes","Payments","Expenses","Products","Inventory","Projects","360 View","Reports","Contacts","File Manager","Settings"];
     vm.appCollection=["Invoices","Estimates","CreditNotes","Payments","Expenses","Products","Inventory","Projects","360View","Reports","Contacts","FileManager","Settings"];

     vm.appPermission=[];

     vm.invoice={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.estimate={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.creditNotes={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.payments={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.expenses={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.product={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.inventory={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.project={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.contacts={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.view360={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.reports={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.fileManager={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
     vm.settings={all:false,add:false,view:false,edit:false,cancel:false,delete:false};

     if(vm.invoice.view==false){
      vm.invoice={all:false,add:false,view:false,edit:false,cancel:false,delete:false};
    }

    function submit() {

     vm.appPermission.push({
      appName:vm.appCollection[0],
      label:vm.appLabel[0],
      all:vm.invoice.all,
      add : vm.invoice.add,
      view: vm.invoice.view,
      edit:vm.invoice.edit,
      cancel:vm.invoice.cancel,
      delete:vm.invoice.delete
    });
     vm.appPermission.push({
      appName:vm.appCollection[1],
      label:vm.appLabel[1],
      all:vm.estimate.all,
      add : vm.estimate.add,
      view: vm.estimate.view,
      edit:vm.estimate.edit,
      cancel:vm.estimate.cancel,
      delete:vm.estimate.delete
    });
     vm.appPermission.push({
      appName:vm.appCollection[2],
      label:vm.appLabel[2],
      all:vm.creditNotes.all,
      add : vm.creditNotes.add,
      view: vm.creditNotes.view,
      edit:vm.creditNotes.edit,
      cancel:vm.creditNotes.cancel,
      delete:vm.creditNotes.delete
    });
     vm.appPermission.push({
      appName:vm.appCollection[3],
      label:vm.appLabel[3],
      all:vm.payments.all,
      add : vm.payments.add,
      view: vm.payments.view,
      edit:vm.payments.edit,
      cancel:vm.payments.cancel,
      delete:vm.payments.delete
    });
     vm.appPermission.push({
      appName:vm.appCollection[4],
      label:vm.appLabel[4],
      all:vm.expenses.all,
      add : vm.expenses.add,
      view: vm.expenses.view,
      edit:vm.expenses.edit,
      cancel:vm.expenses.cancel,
      delete:vm.expenses.delete
    });
     vm.appPermission.push({
      appName:vm.appCollection[5],
      label:vm.appLabel[5],
      all:vm.product.all,
      add : vm.product.add,
      view: vm.product.view,
      edit:vm.product.edit,
      cancel:vm.product.cancel,
      delete:vm.product.delete
    });
     vm.appPermission.push({
      appName:vm.appCollection[6],
      label:vm.appLabel[6],
      all:vm.inventory.all,
      add : vm.inventory.add,
      view: vm.inventory.view,
      edit:vm.inventory.edit,
      cancel:vm.inventory.cancel,
      delete:vm.inventory.delete
    });
     vm.appPermission.push({
      appName:vm.appCollection[7],
      label:vm.appLabel[7],
      all:vm.project.all,
      add : vm.project.add,
      view: vm.project.view,
      edit:vm.project.edit,
      cancel:vm.project.cancel,
      delete:vm.project.delete
    });
     vm.appPermission.push({
      appName:vm.appCollection[8],
      label:vm.appLabel[8],
      add : false,
      view: vm.view360.view,
      edit:false,
      cancel:false,
      delete:false
    });

     vm.appPermission.push({
      appName:vm.appCollection[9],
      label:vm.appLabel[9],
      all:vm.reports.all,
      add : vm.reports.add,
      view: vm.reports.view,
      edit:vm.reports.edit,
      cancel:vm.reports.cancel,
      delete:vm.reports.delete
    });

     vm.appPermission.push({
      appName:vm.appCollection[10],
      label:vm.appLabel[10],
      all:vm.contacts.all,
      add : vm.contacts.add,
      view: vm.contacts.view,
      edit:vm.contacts.edit,
      cancel:vm.contacts.cancel,
      delete:vm.contacts.delete
    });


     vm.appPermission.push({
      appName:vm.appCollection[11],
      label:vm.appLabel[11],
      all:false,
      add :false,
      view: vm.fileManager.view,
      edit:false,
      cancel:false,
      delete:false

    });

     vm.appPermission.push({
      appName:vm.appCollection[12],
      label:vm.appLabel[12],
      all:false,
      add :false,
      view: vm.settings.view,
      edit:false,
      cancel:false,
      delete:false
    });

     var number = Math.random();
     console.log(Math.random());

     var obj={};
     obj.id=number;
     obj.roleName=vm.roleName;
     obj.appPermission=vm.appPermission;
     obj.type="manual";
     obj.editable=false;
     $mdDialog.hide(obj);

   };

   vm.getDataPredefindRole = function(preRole){
    console.log(preRole);
    var rolesPre=JSON.parse(preRole);
    console.log(rolesPre.appPermission[0]);
    vm.invoice=rolesPre.appPermission[0];
    console.log(vm.invoice);
    vm.recurring=rolesPre.appPermission[1];
    vm.estimate=rolesPre.appPermission[2];
    vm.creditNotes=rolesPre.appPermission[3];
    vm.payments=rolesPre.appPermission[4];
    vm.expenses=rolesPre.appPermission[5];
    vm.product=rolesPre.appPermission[6];
    vm.inventory=rolesPre.appPermission[7];
    vm.project=rolesPre.appPermission[8];
    vm.view360=rolesPre.appPermission[9];
    vm.reports=rolesPre.appPermission[10];
    vm.contacts=rolesPre.appPermission[11];
    vm.fileManager=rolesPre.appPermission[12];
    vm.settings=rolesPre.appPermission[13];
  };

  vm.cancel = function() {
    $mdDialog.cancel();
  };


}
})();