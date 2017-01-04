(function ()
{
    'use strict';

    angular
        .module('app.estimates')
        .controller('EstimatesController', EstimatesController);

    /** @ngInject */
    function EstimatesController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
