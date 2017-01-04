(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('12thDoor', [

            //Core shell modules - start 

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            //Core shell modules - end

            // invoices
            'app.invoices',

            // invoices proto
            // 'app.invoicesproto',

            // estimates
            'app.estimates',

            // creditnotes
            'app.creditnotes',

            // payments
            'app.payments',

            // expenses
            'app.expenses',

            // products
            'app.products',

            // inventory
            'app.inventory',

            // projects
            'app.projects',

            // 360view
            'app.360view',

            // report
            'app.report',

            // contacts
            'app.contacts',

            // filemanager
            'app.filemanager',

            //settings
            'app.settings'
        ]);
})();