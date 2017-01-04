(function ()
{
    'use strict';

    angular
        .module('app.invoicesproto', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
            //Parent State
            .state('app.invoicesproto',{
                abstract : true,
                url : '/invoicesproto',
                resolve : {
                    Summary : function($serviceCall)
                    {
                        // return msApi.resolve('invoices.summary@get');
                        var client =  $serviceCall.setClient("getInvoiceSummaryByQuery","invoice");
                        client.skip(0); 
                        client.take(6);
                        client.orderby('');
                        client.isAscending(true);
                        return client.postResolve({"where": "deleteStatus = 'false' order by createDate DESC"});
                    },
                    Recurring : function($serviceCall)
                    {
                        //return msApi.resolve('invoices.recurring@get');
                         var rec =  $serviceCall.setClient("getRecInvoiceSummaryByQuery","invoice");
                        rec.skip(0); 
                        rec.take(6);
                        rec.orderby('');
                        rec.isAscending(true);
                        return rec.postResolve({"where": "deleteStatus = 'false' order by createDate DESC"});
                    },
                    Activity : function(msApi){
                        return msApi.resolve('invoices.invoicesActivity@get');
                    }
                }
            })
            //Secondary State Invoice
            .state('app.invoicesproto.inv',{
                url : '/inv',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/invoicesproto/views/inv/invProto.html',
                        controller : 'invProtoController as vm'
                    }
                }
            })
            //Child State Invoice Detail
            .state('app.invoicesproto.inv.detail',{
                url : '/:itemId'
            })

            //Secondary State Recurring
            .state('app.invoicesproto.rec',{
                url : '/rec',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/invoices/views/rec/rec.html',
                        controller : 'recController as vm'
                    }
                }
            })
            //Chiild State Recurring Detail
            .state('app.invoicesproto.rec.detail',{
                url : '/:itemId'
            })
            //Chiild State Create
            .state('app.invoicesproto.compose',{
                url : '/compose',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/invoicesproto/views/compose/invProtoCompose.html',
                        controller : 'invProtoComposeController as vm'
                    }
                }
            });


        msApiProvider.register('invoices.invoicesActivity',['app/data/invoices/invoicesActivity.json']);
        // Api registration
        // msApiProvider.register('invoices.summary', ['app/data/invoices/summary.json']);
        // msApiProvider.register('invoices.recurring', ['app/data/invoices/recurring.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('InvoicesProto', {
            title      : 'InvoicesProto',
            icon       : 'icon-email',
            state      : 'app.invoicesproto.inv',
            weight     : 1
        });
    }
})();

(function ()
{
    'use strict';

    angular
        .module('app.invoicesproto')
        .factory('$focus',$focus);

    /** @ngInject */
    function $focus($timeout, $window)
    {
         return function(id) {
            $timeout(function() {
                var element = $window.document.getElementById(id);
                if (element)
                    element.focus();
            });
        };
    }
})();