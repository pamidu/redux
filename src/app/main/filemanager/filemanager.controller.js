(function ()
{
    'use strict';

    angular
        .module('app.filemanager')
        .controller('FileManagerController', FileManagerController);

    /** @ngInject */
    function FileManagerController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
