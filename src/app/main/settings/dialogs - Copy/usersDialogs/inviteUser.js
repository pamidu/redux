(function()
{
  'use strict';

  angular
  .module('app.settings')
  .controller('DialogusersController',DialogusersController);

  /** @ngInject */
  function DialogusersController($rootScope,$mdDialog,$apis,$mdToast)
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

      vm.roleRequired=false;

      vm.roles=$rootScope.roles;
      console.log(vm.roles);

      vm.lastName="";

      function submit() {
        if(vm.role=="" || vm.role==null)
        {
          vm.roleRequired=true;
        }
        else{
         var obj={};
         obj.role=[];
         obj.inviteUserEmail=vm.inviteUserEmail;
         obj.firstName=vm.firstName;
         obj.lastName=vm.lastName;
         obj.role.push(vm.role);
         obj.editable=false;
         obj.activate=true;
         console.log(obj);
         vm.obj=obj;

         var permission={};
         permission.roles=[];
         permission.activate=true;
         permission.email=vm.inviteUserEmail;
         permission.firstName=vm.firstName;
         permission.roles.push(vm.role);

         vm.invite={};
         vm.invite.UserID="";
         vm.invite.EmailAddress=vm.inviteUserEmail;
         vm.invite.Name=vm.firstName+" "+vm.lastName;
         vm.invite.Password="";
         vm.invite.ConfirmPassword="";
         vm.invite.Active=false;

         var apis = $apis.getApis();
         apis.ifSuccess(function(data){

          if(data.isSuccess==true){
            var toast = $mdToast.simple().content( obj.firstName+' user successfully invited').action('OK').highlightAction(false).position("bottom right");
            $mdToast.show(toast).then(function() {});

            var apis = $apis.getApis();
            apis.ifSuccess(function(data){
              if(data=='Already Registered'){
                var toast = $mdToast.simple().content( obj.firstName+' user successfully added').action('OK').highlightAction(false).position("bottom right");
                $mdToast.show(toast).then(function() {});
               // $mdDialog.hide(obj);
             }

            //  if(data==true){
            //   var toast = $mdToast.simple().content('successfully sent invitation to'+obj.firstName).action('OK').highlightAction(false).position("bottom right");
            //   $mdToast.show(toast).then(function() {});
            // }

          });
            apis.ifError(function(data){
              console.log(data);
              var toast = $mdToast.simple().content('There was an error, when user invited').action('OK').highlightAction(false).position("bottom right");
              $mdToast.show(toast).then(function() {});
            });

            // apis.authPost('RegisterTenantUser',vm.invite);
            apis.getUser(vm.obj.inviteUserEmail);
            $mdDialog.hide(obj);
          }
          else{
            var toast = $mdToast.simple().content('there was a error').action('OK').highlightAction(false).position("bottom right");
            $mdToast.show(toast).then(function() {});
          }

        });
         apis.ifError(function(data){
          console.log(data);
          var toast = $mdToast.simple().content('There was an error, when user invited').action('OK').highlightAction(false).position("bottom right");
          $mdToast.show(toast).then(function() {});
        });
         apis.apisPermission('invite',permission); 



//when new user 




}

};

//resent invitation................


vm.cancel = function() {
  $mdDialog.cancel();
};


}
})();