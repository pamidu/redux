(function ()
{
    'use strict';

    angular
        .module('app.expenses')
        .controller('ExpensesController', ExpensesController);

    /** @ngInject */
    function ExpensesController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
