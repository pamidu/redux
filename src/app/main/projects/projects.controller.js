(function ()
{
    'use strict';

    angular
        .module('app.projects')
        .controller('ProjectsController', ProjectsController);

    /** @ngInject */
    function ProjectsController(SampleData)
    {
        var vm = this;

        // Data
        vm.helloText = SampleData.data.helloText;

        // Methods

        //////////
    }
})();
