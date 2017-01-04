/*

/*
    version 6.0.0.11

    @namespace app.products
    @desc product application for 12th door 
    @author RASM    
    
*/

(function ()
{
    'use strict';

    angular
        .module('app.products', [])
        .config(config);
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        $stateProvider
            //Parent State
            .state('app.products',{
                abstract : true,
                url : '/products',
                resolve : {
                    productSummary : function($serviceCall){ 
                        console.log('v 6.0.0.11');
                        var client =  $serviceCall.setClient("getProductSummaryByQuery","process"); 
                        client.skip(0);
                        client.take(1); 
                        return client.postResolve({
                            "appName":"Products", "permissionType":"view", "where":"deleteStatus = 'false' order by createDate DESC"
                        });
                    }
                }
            })
            //Secondary State Invoice
            .state('app.products.pro',{
                url : '/pro',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/products/views/pro/pro.html',
                        controller : 'proController as vm'
                    }
                }
            })  
            //Chiild State Recurring Detail
            .state('app.products.pro.detail',{
                url : '/:itemID'
            })
            //Chiild State Create
            .state('app.products.compose',{
                url : '/compose',
                params : {
                    'appID' : null,
                    'profileID' : null
                },
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/products/views/compose/proCompose.html',
                        controller : 'proComposeController as vm'
                    }
                },
                resolve : {
                    settingSummary : function($serviceCall){
                        var client =  $serviceCall.setClient("getAllByQuery","setting"); 
                        client.skip(0);
                        client.take(1); 
                        return client.postResolve({
                            "preference" : "productPref,inventoryPref",
                            "setting" : "taxes,profile"
                        });
                    }
                }
            })
            //Chiild State Create
            .state('app.products.edit',{
                url : '/edit/:itemID',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/products/views/edit/proEdit.html',
                        controller : 'proEditController as vm'
                    }
                },
                resolve : {
                    settingSummary : function($serviceCall){
                        var client =  $serviceCall.setClient("getAllByQuery","setting"); 
                        client.skip(0);
                        client.take(1); 
                        return client.postResolve({
                            "preference" : "productPref,inventoryPref",
                            "setting" : "taxes,profile"
                        });
                    }
                }
            }) 
            //Chiild State Create
            .state('app.products.copy',{
                url : '/copy/:itemID',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/products/views/copy/proCopy.html',
                        controller : 'proCopyController as vm'
                    }
                },
                resolve : {
                    settingSummary : function($serviceCall){
                        var client =  $serviceCall.setClient("getAllByQuery","setting"); 
                        client.skip(0);
                        client.take(1); 
                        return client.postResolve({
                            "preference" : "productPref,inventoryPref",
                            "setting" : "taxes,profile"
                        });
                    }
                }
            }); 

        // Navigation
        msNavigationServiceProvider.saveItem('products', {
            title      : 'Products',
            icon       : 'icon-email',
            state      : 'app.products.pro',
            weight     : 3
        });
    }
})();