(function ()
{
    'use strict';

    angular
        .module('app.create')
        .controller('CreateController', CreateController);

    /** @ngInject */
    function CreateController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
