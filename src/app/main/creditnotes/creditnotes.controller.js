(function ()
{
    'use strict';

    angular
        .module('app.creditnotes')
        .controller('CreditnotesController', CreditnotesController);

    /** @ngInject */
    function CreditnotesController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
