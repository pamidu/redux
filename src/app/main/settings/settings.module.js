//Setting App version: 6.1.0.16
//Author:Divani

(function ()
{
  'use strict';

  angular
  .module('app.settings', [])
  .config(config);

  /** @ngInject */
  function config($stateProvider, $urlRouterProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
  {

    $stateProvider
            //Parent State
            .state('app.settings',{
              abstract : true,
              url : '/settings',
              resolve : {
              }
            })
            .state('app.settings.main',{
            	url: '/main', 
              views : {
               'content@app' : {
                templateUrl : 'app/main/settings/views/primaryview/primary.html',
                controller : 'settingsController as vm'
              }	
            },
            resolve : {
              getAllSetting: function($serviceCall){
                var client =  $serviceCall.setClient("getAllByQuery","setting"); 
                return client.postResolve({
                  "preference":"contactPref,creditNotePref,estimatePref,expensePref,inventoryPref,invoicePref,paymentPref,productPref,project",
                  "setting":"profile,taxes,payments,templates,users,accounts,languages",
                });
              }  
            }
          })
            .state('app.settings.main.profile',{
            	url: '/profile',
            	views : {
            		'settingsView' : {
                  templateUrl : 'app/main/settings/views/profileview/profile.html',
                  controller : 'profileViewController as vm'
                }
              }
            })
            .state('app.settings.main.users',{
            	url: '/users',
            	views : {
            		'settingsView' : {
                  templateUrl : 'app/main/settings/views/usersview/users.html',
                  controller : 'usersViewController as vm'
                }
              } 
            })
            .state('app.settings.main.taxes',{
            	url: '/taxes',
            	views : {
            		'settingsView' : {
                  templateUrl : 'app/main/settings/views/taxesview/taxes.html',
                  controller : 'taxesViewController as vm'
                }
              } 
            })

            .state('app.settings.main.payments',{
              url: '/payments',
              views : {
                'settingsView' : {
                  templateUrl : 'app/main/settings/views/paymentview/payment.html',
                  controller : 'paymentsViewController as vm'
                }
              } 
            })

            .state('app.settings.main.accounts',{
              url: '/accounts',
              views : {
                'settingsView' : {
                  templateUrl : 'app/main/settings/views/accountview/account.html',
                  controller : 'accountsViewController as vm'
                }
              } 
            })

            .state('app.settings.main.templates',{
              url: '/templates',
              views : {
                'settingsView' : {
                  templateUrl : 'app/main/settings/views/templateview/template.html',
                  controller : 'templatesViewController as vm'
                }
              } 
            })

            .state('app.settings.main.preferences',{
              url: '/preferences',
              views : {
                'settingsView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/preference.html',
                  controller : 'preferenceViewController as vm'
                }
              } 
            })

            .state('app.settings.main.preferences.invoice',{
              url: '/invoice',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/invoices.html',
                  controller : 'invoicePreferenceCtrl as vm'
                }
              } 
            })

            .state('app.settings.main.preferences.estimate',{
              url: '/estimate',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/estimate.html',
                  controller : 'estimatePreferenceCtrl as vm'
                }
              } 
            })

            .state('app.settings.main.preferences.creditNote',{
              url: '/creditNote',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/creditNote.html',
                  controller : 'creditNotePreferenceCtrl as vm'
                }
              } 
            })

            .state('app.settings.main.preferences.expense',{
              url: '/expense',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/expense.html',
                  controller : 'expensePreferenceCtrl as vm'
                }
              } 
            })

            .state('app.settings.main.preferences.payment',{
              url: '/payment',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/payment.html',
                  controller : 'paymentPreferenceCtrl as vm'
                }
              } 
            })

            .state('app.settings.main.preferences.contact',{
              url: '/contact',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/contact.html',
                  controller : 'contactPreferenceCtrl as vm'
                }
              } 
            })

            .state('app.settings.main.preferences.product',{
              url: '/product',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/product.html',
                  controller : 'productPreferenceCtrl as vm'
                }
              } 
            })
    
            .state('app.settings.main.preferences.project',{
              url: '/project',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/project.html',
                  controller : 'projectPreferenceCtrl as vm'
                }
              } 
            })
    
            .state('app.settings.main.preferences.inventory',{
              url: '/inventory',
              views : {
                'preferenceView' : {
                  templateUrl : 'app/main/settings/views/preferenceview/inventory.html',
                  controller : 'inventoryPreferenceCtrl as vm'
                }
              } 
            })

            .state('app.settings.main.emailTemplates',{
              url: '/emailTemplates',
              views : {
                'settingsView' : {
                  templateUrl : 'app/main/settings/views/emailTemplatesview/emailTemplate.html',
                  controller : 'emailTemplatesViewController as vm'
                }
              } 
            });

        // Navigation
        // Navigation to acces this module can be found the shell toolbar markup.
      }

    })();