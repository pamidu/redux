(function ()
{
    'use strict';

    angular
        .module('app.360view', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.360view', {
                url    : '/360view',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/360view/360view.html',
                        controller : 'ThreeSixtyViewController as vm'
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

        msNavigationServiceProvider.saveItem('360view', {
            title    : '360 View',
            icon     : 'icon-tile-four',
            state    : 'app.360view',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 9
        });
    }
})();