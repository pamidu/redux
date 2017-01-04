(function ()
{
    'use strict';

    angular
        .module('app.creditnotes', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.creditnotes', {
                url    : '/creditnotes',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/creditnotes/creditnotes.html',
                        controller : 'CreditnotesController as vm'
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

        msNavigationServiceProvider.saveItem('Creditnotes', {
            title    : 'Credit Notes',
            icon     : 'icon-tile-four',
            state    : 'app.creditnotes',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 3
        });
    }
})();