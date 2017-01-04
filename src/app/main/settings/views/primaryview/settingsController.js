(function ()
{
    'use strict';

    angular
    .module('app.settings')
    .controller('settingsController', settingsController);

    /** @ngInject */
    function settingsController($scope, $rootScope, $document, $mdDialog, $mdMedia, $serviceCall, $mdSidenav, $state, msApi, $auth,getAllSetting)
    {
       // $state.go('app.settings.main.profile');
       console.log('SETTING 6.1.0.16');
       $state.go('app.settings.main.profile');
       var vm = this;
        // vm.toggleSidenav = toggleSidenav; 

        vm.primaryToolbarContext = true;
        vm.getAllSetting=getAllSetting;

        vm.Settings12thdoor=vm.getAllSetting[0];

        vm.settingsNavList = [
        {"navIcon":"","navTitle":"Profile","navState":"app.settings.main.profile"},
        {"navIcon":"","navTitle":"Preferences","navState":"app.settings.main.preferences"},
        {"navIcon":"","navTitle":"Users","navState":"app.settings.main.users"},
        {"navIcon":"","navTitle":"Taxes","navState":"app.settings.main.taxes"},
        {"navIcon":"","navTitle":"Templates","navState":"app.settings.main.templates"},
        {"navIcon":"","navTitle":"Email Templates","navState":"app.settings.main.emailTemplates"},
        {"navIcon":"","navTitle":"Payments","navState":"app.settings.main.payments"},
        {"navIcon":"","navTitle":"Languages","navState":"app.settings.main.languages"},
        {"navIcon":"","navTitle":"Accounts","navState":"app.settings.main.accounts"}
//        {"navIcon":"","navTitle":"Upgrades","navState":"app.settings.main.upgrades"}
        ]

        vm.navigateSettingsStates = navigateSettingsStates;

        function setPrimaryToolBar()
        {
            vm.primaryToolbarContext = !vm.primaryToolbarContext;
        }


        // function toggleSidenav(sidenavId)
        // {
        //     $mdSidenav(sidenavId).toggle();
        // }

        function navigateSettingsStates(stateDeff)
        {   
            $state.go(stateDeff);
        }

        function loadSettingJson(){

        }
        loadSettingJson();
    }
})();