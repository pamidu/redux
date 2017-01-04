(function ()
{
    'use strict';

    angular
        .module('app.report', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.report', {
                url    : '/report',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/report/report.html',
                        controller : 'ReportController as vm'
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

        msNavigationServiceProvider.saveItem('Report', {
            title    : 'Report',
            icon     : 'icon-tile-four',
            state    : 'app.report',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 10
        });
    }
})();