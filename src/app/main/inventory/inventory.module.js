(function ()
{
    'use strict';

    angular
        .module('app.inventory', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.inventory', {
                url    : '/inventory',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/inventory/inventory.html',
                        controller : 'InventoryController as vm'
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

        msNavigationServiceProvider.saveItem('Inventory', {
            title    : 'Inventory',
            icon     : 'icon-tile-four',
            state    : 'app.inventory',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 7
        });
    }
})();