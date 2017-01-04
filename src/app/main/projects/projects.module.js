(function ()
{
    'use strict';

    angular
        .module('app.projects', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.projects', {
                url    : '/projects',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/projects/projects.html',
                        controller : 'ProjectsController as vm'
                    }
                },
                resolve: {
                    SampleData: function (msApi)
                    {
                        return msApi.resolve('sample@get');
                    }
                }
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/sample');

        // Api
        msApiProvider.register('sample', ['app/data/sample/sample.json']);

        // Navigation

        msNavigationServiceProvider.saveItem('Projects', {
            title    : 'Projects',
            icon     : 'icon-tile-four',
            state    : 'app.projects',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 8
        });
    }
})();