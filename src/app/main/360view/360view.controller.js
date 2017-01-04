(function ()
{
    'use strict';

    angular
        .module('app.360view')
        .controller('ThreeSixtyViewController', ThreeSixtyViewController);

    /** @ngInject */
    function ThreeSixtyViewController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
