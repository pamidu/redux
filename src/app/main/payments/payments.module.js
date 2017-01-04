
/*
    version 6.0.0.2

*/

(function ()
{
    'use strict';

    angular
        .module('app.payments', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
		console.log("version 6.0.0.2");
        $stateProvider
            //Parent State
            .state('app.payments',{
                abstract : true,
                url : '/payments',
                resolve : {             
                    settingSummary : function($serviceCall){
                        var client =  $serviceCall.setClient("getAllByQuery","setting");    
                        return client.postResolve({
                            "preference":"paymentPref",
                            "setting":"profile,payments",
                        });
                    }
                }
            })
            //Secondary State payments
            .state('app.payments.pay',{
                url : '/pay',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/payments/views/pay/pay.html',
                        controller : 'payController as vm'
                    },
                },
                resolve : {
                    paymentSummary : function($serviceCall){
                        var client =  $serviceCall.setClient("getPaymentSummaryByQuery","payment");                        
                        client.skip(0);
                        client.take(10); 
                        client.orderby('');
                        client.isAscending(true);
                        return client.postResolve({
                            "where": "paymentStatus <> 'delete' order by 'paymentID', lastTranDate DESC"
                        });
                    }
                }
            })

            //Child State payment Detail
            .state('app.payments.pay.detail',{
                url : '/:itemID'
            })

            //Chiild State Create
            .state('app.payments.compose',{
                url : '/paycompose',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/payments/views/compose/payCompose.html',
                        controller : 'payComposeController as vm'
                    }
                }
            });
 

        // Navigation
        msNavigationServiceProvider.saveItem('Payments', {
            title      : 'Payments',
            icon       : 'icon-email',
            state      : 'app.payments.pay',
            weight     : 2
        });
    }
})();