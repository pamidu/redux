(function ()
{
    'use strict';

    angular
    .module('app.inventory')
    .controller('grnComposeController', grnComposeController);

    /** @ngInject */
    function grnComposeController($scope, $rootScope, $document, $mdDialog, $mdMedia, $mdSidenav, $state,$mdToast,$serviceCall)
    {
        var vm = this;
        vm.toggleChildStates = toggleChildStates;

        vm.loadingItems = false;

        vm.currentThread = null;

        vm.selectedThreads = [];

        //vm.submit=submit;

        //vm.contact.firstName=contact.firstName;

        

        function toggleChildStates(toggledState){
            $state.go(toggledState);
        };

   
    }
})();