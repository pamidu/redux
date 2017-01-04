(function ()
{
    'use strict';

    angular
        .module('app.expenses', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.expenses', {
                url    : '/expenses',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/expenses/expenses.html',
                        controller : 'ExpensesController as vm'
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

        msNavigationServiceProvider.saveItem('Expenses', {
            title    : 'Expenses',
            icon     : 'icon-tile-four',
            state    : 'app.expenses',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 5
        });
    }
})();