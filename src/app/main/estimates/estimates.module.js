(function ()
{
    'use strict';

    angular
        .module('app.estimates', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.estimates', {
                url    : '/estimates',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/estimates/estimates.html',
                        controller : 'EstimatesController as vm'
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

        msNavigationServiceProvider.saveItem('Estimates', {
            title    : 'Estimates',
            icon     : 'icon-tile-four',
            state    : 'app.estimates',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 2
        });
    }
})();