(function ()
{
    'use strict';

    angular
        .module('app.inventory')
        .controller('InventoryController', InventoryController);

    /** @ngInject */
    function InventoryController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
