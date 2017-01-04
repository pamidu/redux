(function ()
{
    'use strict';

    angular
        .module('app.filemanager', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.filemanager', {
                url    : '/filemanager',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/filemanager/filemanager.html',
                        controller : 'FileManagerController as vm'
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

        msNavigationServiceProvider.saveItem('FileManager', {
            title    : 'File Manager',
            icon     : 'icon-tile-four',
            state    : 'app.filemanager',
            /*stateParams: {
                'param1': 'page'
             },*/
            weight   : 12
        });
    }
})();