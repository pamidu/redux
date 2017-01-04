(function ()
{
    'use strict';

    angular
        .module('app.contacts', ['12th-config'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        $stateProvider
            //Parent State
            .state('app.contacts',{
                abstract : true,
                url : '/contacts',
                resolve : {
                    Customer : function($serviceCall)
                    {
                        var client =  $serviceCall.setClient("getAllByQuery","profile");                        
                        client.skip(0);
                        client.take(10); 
                        client.orderby('');
                        client.isAscending(false);
                        client.class('Customer');
                        return client.postResolve({
                        "where": "deleteStatus = 'true' order by 'createDate'"
                        });
                    },
                    Supplier : function($serviceCall)
                    {
                       // return msApi.resolve('invoices.recurring@get');

                        var client =  $serviceCall.setClient("getAllByQuery","profile");                        
                        client.skip(0);
                        client.take(10); 
                        client.orderby('');
                        client.isAscending(false);
                        client.class('Supplier');
                        return client.postResolve({
                        "where": "deleteStatus = 'true' order by 'createDate' "
                        });
                    }
                }
            })
            //Secondary State Inventory
            .state('app.contacts.customer',{
                url : '/customer',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/contacts/views/customer/customer.html',
                        controller : 'customerController as vm'
                    }
                }
            })
            //Child State Inventory Detail
            .state('app.contacts.customer.detail',{
                url : '/:itemID'
                //   views : {
                //     'content@app' : {
                //         templateUrl : 'app/main/contacts/views/customer/detail/customer-detail.html',
                //         controller : 'customerController as vm'
                //     }
                // }
               // params: { contact: vm.contact }
            })
            //Secondary State issued note
            .state('app.contacts.supplier',{
                url : '/supplier',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/contacts/views/supplier/supplier.html',
                        controller : 'supplierController as vm'
                    }
                }
            })
            //Chiild State issued note Detail
            .state('app.contacts.supplier.detail',{
                // url : '/:itemID',
                // params: { status: status }
            })
            //Chiild State Create
            .state('app.contacts.CusCompose',{
                url : '/compose/customer',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/contacts/views/customer/compose/customerCompose.html',
                        controller : 'customerComposeController as vm'
                    }
                }
            })

             .state('app.contacts.SupCompose',{
                url : '/compose/supplier',
                views : {
                    'content@app' : {
                        templateUrl : 'app/main/contacts/views/supplier/compose/supplierCompose.html',
                        controller : 'supplierComposeController as vm'
                    }
                }
            });

        // Api registration
        // msApiProvider.register('invoices.summary', ['app/data/invoices/summary.json']);
        // msApiProvider.register('invoices.recurring', ['app/data/invoices/recurring.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('Contacts', {
            title      : 'Contacts',
            icon       : 'icon-email',
            state      : 'app.contacts.customer',
            weight     : 1
        });
    }
})();