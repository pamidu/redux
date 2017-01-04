(function ()
{
    'use strict';

    angular
        .module('12thDoor')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(mesTheming)
    {
        var vm = this;

        // Data
        vm.themes = mesTheming.themes;

        //////////
    }
})();