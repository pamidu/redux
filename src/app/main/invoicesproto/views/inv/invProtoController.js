(function() {
    'use strict';

    angular
        .module('app.invoicesproto')
        .controller('invProtoController', invProtoController);

    /** @ngInject */
    function invProtoController($scope, $rootScope, $document, $stateParams, $serviceCall, $mdToast, $mdDialog, $mdMedia, $mdSidenav, $state, msApi, Summary, Recurring, Activity) {
        var vm = this;

        vm.contactColors = ['blue-bg', 'blue-grey-bg', 'orange-bg', 'pink-bg', 'purple-bg', 'green-bg', 'red-bg'];

        // vm.folders = Primary.data;
        // vm.labels = Secondary.data;

        vm.invoiceSummary = Summary.result;

        vm.invoiceActivity = Activity.result;

        console.log('INVOICE 6.0.0.6');

        vm.invoicesRecurring = Recurring.result;

        vm.asc = false;

        vm.dsc = false;

        vm.primaryToolbarContext = true;

        vm.toggleChildStates = toggleChildStates;

        vm.loadingItems = true;

        vm.currentThread = null;

        vm.selectedThreads = [];

        vm.openItem = openItem;

        vm.closeThread = closeThread;

        vm.isSelected = isSelected;

        vm.toggleSelectThread = toggleSelectThread;

        vm.selectThreads = selectThreads;

        vm.deselectThreads = deselectThreads;

        vm.toggleSelectThreads = toggleSelectThreads;

        vm.setThreadStatus = setThreadStatus;

        vm.toggleThreadStatus = toggleThreadStatus;

        vm.favouriteInvoices = favouriteInvoices;

        vm.UnPaidInvoices = UnPaidInvoices;

        vm.sortInvoiceNo = sortInvoiceNo;

        vm.paidInvoices = paidInvoices;

        vm.defaultCancel = defaultCancel;

        vm.loadDetailView = loadDetailView;

        vm.cancelStatus = cancelStatus;

        vm.starfunc = starfunc;

        vm.sortarr = [];

        console.log(vm.invoiceActivity);


        var page = 1;
        // controller 
        vm.pageObj = {
            service: 'invoice',
            method: 'getInvoiceSummaryByQuery',
            body: {
                "where": "deleteStatus = 'false' order by createDate DESC"
            },
            orderby: '',
            isAscending: true
        }
        vm.pageGap = 10;

        //////////

        init().loadSummary();

        /**
         * Initialize
         */
        function init() {

            if ($state.current.name == "app.invoices.inv.detailView") {
                loadDetailView();
            }
            if ($state.current.name == "app.invoices.inv.detail") {
                loadDetailView();
            }

            var service = {
                loadSummary: loadSummary
            }
            return service;

            function loadSummary() {
                if (vm.invoiceSummary.length > 0) {
                    // Load new threads
                    for (var i = 0; i < vm.invoiceSummary.length; i++) {
                        vm.invoiceSummary[i].startDate = new Date(vm.invoiceSummary[i].startDate);
                        // Hide the loading screen
                        vm.loadingItems = false;
                    }
                    vm.items = vm.invoiceSummary;

                    // Open the thread if needed
                    if ($state.params.itemId) {
                        for (var i = 0; i < vm.items.length; i++) {
                            if (vm.items[i].invoiceNo === $state.params.itemId) {
                                vm.openItem(vm.items[i]);
                                break;
                            }
                        }
                    }
                }
            }
        }

        function setPrimaryToolBar() {
            vm.primaryToolbarContext = !vm.primaryToolbarContext;
        };

        function toggleChildStates(toggledState) {
            $state.go(toggledState);
        };

        function openItem(item) {
            // Set the read status on the item
            // item.read = true;

            setPrimaryToolBar();

            // Assign thread as the current thread
            vm.currentThread = item;

            $state.go('app.invoicesproto.inv.detail', {
                itemId: item.invoiceNo
            });

        }

        /**
         * Close thread
         */
        function closeThread() {
            vm.currentThread = null;

            setPrimaryToolBar();
            // location.reload();
            // Update the state without reloading the controller
            $state.go('app.invoices.inv');
        }

        /**
         * Return selected status of the thread
         *
         * @param thread
         * @returns {boolean}
         */
        function isSelected(thread) {
            return vm.selectedThreads.indexOf(thread) > -1;
        }

        /**
         * Toggle selected status of the thread
         *
         * @param thread
         * @param event
         */
        function toggleSelectThread(thread, event) {
            if (event) {
                event.stopPropagation();
            }

            if (vm.selectedThreads.indexOf(thread) > -1) {
                vm.selectedThreads.splice(vm.selectedThreads.indexOf(thread), 1);
            } else {
                vm.selectedThreads.push(thread);
            }
        }

        /**
         * Select threads. If key/value pair given,
         * threads will be tested against them.
         *
         * @param [key]
         * @param [value]
         */
        function selectThreads(key, value) {
            // Make sure the current selection is cleared
            // before trying to select new threads
            vm.selectedThreads = [];

            for (var i = 0; i < vm.items.length; i++) {
                if (angular.isUndefined(key) && angular.isUndefined(value)) {
                    vm.selectedThreads.push(vm.items[i]);
                    continue;
                }

                if (angular.isDefined(key) && angular.isDefined(value) && vm.items[i][key] === value) {
                    vm.selectedThreads.push(vm.items[i]);
                }
            }
        }

        /**
         * Deselect threads
         */
        function deselectThreads() {
            vm.selectedThreads = [];
        }

        /**
         * Toggle select threads
         */
        function toggleSelectThreads() {
            if (vm.selectedThreads.length > 0) {
                vm.deselectThreads();
            } else {
                vm.selectThreads();
            }
        }

        /**
         * Set the status on given thread, current thread or selected threads
         *
         * @param key
         * @param value
         * @param [thread]
         * @param [event]
         */
        function setThreadStatus(key, value, thread, event) {
            // Stop the propagation if event provided
            // This will stop unwanted actions on button clicks
            if (event) {
                event.stopPropagation();
            }

            // If the thread provided, do the changes on that
            // particular thread
            if (thread) {
                thread[key] = value;
                return;
            }

            // If the current thread is available, do the
            // changes on that one
            if (vm.currentThread) {
                vm.currentThread[key] = value;
                return;
            }

            // Otherwise do the status update on selected threads
            for (var x = 0; x < vm.selectedThreads.length; x++) {
                vm.selectedThreads[x][key] = value;
            }
        }

        /**
         * Toggle the value of the given key on given thread, current
         * thread or selected threads. Given key value must be boolean.
         *
         * @param key
         * @param thread
         * @param event
         */
        function toggleThreadStatus(key, thread, event) {
            // Stop the propagation if event provided
            // This will stop unwanted actions on button clicks
            if (event) {
                event.stopPropagation();
            }

            // If the thread provided, do the changes on that
            // particular thread
            if (thread) {
                if (typeof(thread[key]) !== 'boolean') {
                    return;
                }

                if (thread.favouriteStarNo == 1)
                    thread.favouriteStarNo = 0;

                else if (thread.favouriteStarNo == 0)
                    thread.favouriteStarNo = 1;

                thread.favouriteStar = !thread.favouriteStar;
                //var udtateData = {invoice : thread, "image" :[], "permissionType" : "edit", "appName":"Invoices"};
                var jsonString = JSON.stringify(thread);

                var client = $serviceCall.setClient("update", "invoice");
                client.ifSuccess(function(data) {

                });
                client.ifError(function(data) {
                    console.log("error ")
                })
                client.postReq(jsonString);

                return;
            }

            // If the current thread is available, do the
            // changes on that one
            if (vm.currentThread) {
                if (typeof(vm.currentThread[key]) !== 'boolean') {
                    return;
                }

                vm.currentThread[key] = !vm.currentThread[key];
                return;
            }

            // Otherwise do the status update on selected threads
            for (var x = 0; x < vm.selectedThreads.length; x++) {
                if (typeof(vm.selectedThreads[x][key]) !== 'boolean') {
                    continue;
                }

                vm.selectedThreads[x][key] = !vm.selectedThreads[x][key];
            }
        }


        function GetDataFromService(val) {
            vm.pageObj = {
                service: 'invoice',
                method: 'getInvoiceSummaryByQuery',
                body: val,
                orderby: '',
                isAscending: ''
            }

            $scope.$broadcast("getPageObj", vm.pageObj);
        }

        function favouriteInvoices() {
            if (page == 1) {
                page = 0;

                GetDataFromService({
                    "where": "deleteStatus = false AND favouriteStar = true order by createDate DESC"
                });
            } else {
                page = 1;
                vm.items = vm.invoiceSummary;
            };
        }


        function UnPaidInvoices() {
            if (page == 1) {
                page = 0;
                GetDataFromService({
                    "where": "deleteStatus = false AND invoiceStatus = 'Unpaid' order by createDate DESC"
                });

            } else {
                page = 1;
                vm.items = vm.invoiceSummary;
            };
        }


        function paidInvoices() {
            if (page == 1) {
                page = 0;
                GetDataFromService({
                    "where": "deleteStatus = false AND invoiceStatus = 'Paid' order by createDate DESC"
                });
            } else {
                page = 1;
                vm.items = vm.invoiceSummary;
            };
        }

        function sortInvoiceNo() {
            var arr = [];
            if (page == 1) {

                vm.asc = false;

                vm.dsc = true;
                page = 0;
                if (vm.invoiceSummary.length > 0) {
                    for (var i = vm.invoiceSummary.length - 1; i >= 0; i--) {
                        arr.push(vm.invoiceSummary[i]);
                    }
                    vm.items = arr;
                    console.log(vm.items);
                }

            } else {
                page = 1;
                vm.asc = true;
                vm.dsc = false;
                vm.items = Summary.result;
            }
        }



        vm.sortarr = [
            {
                name: "Starred",
                id: "favouriteStarNo",
                src: "img/ic_grade_48px.svg",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Date",
                id: "startDate",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Invoice No",
                id: "invoiceNo",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Customer",
                id: "profileName",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Amount",
                id: "netAmount",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Balance Due",
                id: "balance",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Due Date",
                id: "dueDate",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Draft",
                id: "Draft",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Paid",
                id: "paymentStatus",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Unpaid",
                id: "paymentStatus",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Overdue",
                id: "paymentStatus",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Partially Paid",
                id: "paymentStatus",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }, {
                name: "Cancelled",
                id: "paymentStatus",
                upstatus: false,
                downstatus: false,
                divider: true,
                close: false
            }
        ]


        vm.latest = '-createDate'; // by default it should be order by date in descending order 
        vm.indexno = 1;

        function starfunc(item, index) { // pass sort object and index number 
            if (item.id === "favouriteStarNo") {
                vm.prodSearch = null;
                item.upstatus == false;
                item.downstatus = false;
                vm.sortarr[vm.indexno].upstatus = false;
                vm.sortarr[vm.indexno].downstatus = false;
                vm.sortarr[vm.indexno].close = false;
                item.close = false;
                vm.indexno = index;
                //SortStarFunc();
                vm.orderby = "!favouriteStarNo";
                vm.Isascending = false;
                CheckFullArrayStatus(vm.orderby, vm.isAscending);

            } else if (item.id === "paymentStatus" || item.id == "status") {

                vm.prodSearch = null;
                item.upstatus == false; // hide current up icon
                item.downstatus = false; // hide current down icon
                vm.sortarr[vm.indexno].downstatus = false; // hide previous down icon
                vm.sortarr[vm.indexno].upstatus = false; // hide previous up icon
                vm.sortarr[vm.indexno].close = false; // hide previous close icon
                item.close = true;
                vm.indexno = index;

                getStatus(item.name, item.id);

            } else {
                if (item.upstatus == false && item.downstatus == false) {
                    item.upstatus = !item.upstatus;
                    item.close = true;

                    if (vm.indexno != index) {
                        vm.sortarr[vm.indexno].upstatus = false; // hide previous up icon
                        vm.sortarr[vm.indexno].downstatus = false; // hide previous down icon
                        vm.sortarr[vm.indexno].close = false; // hide previous close icon
                        vm.indexno = index;
                    }
                } else {
                    item.upstatus = !item.upstatus;
                    item.downstatus = !item.downstatus;
                    item.close = true;
                }


                if (item.upstatus) {
                    vm.orderby = item.id;
                    vm.isAscending = true;
                    CheckFullArrayStatus(vm.orderby, vm.isAscending);


                }
                if (item.downstatus) {
                    vm.orderby = item.id;
                    vm.isAscending = false;
                    CheckFullArrayStatus(vm.orderby, vm.isAscending);

                }
            }
        }

        function CheckFullArrayStatus(orderby, Isascending) {
            var whereClause;
            if (Isascending)
                whereClause = "deleteStatus = 'false' order by " + orderby + ", createDate DESC";
            else
                whereClause = "deleteStatus = 'false' order by " + orderby + " DESC, createDate DESC";


            vm.pageObj = {
                service: 'invoice',
                method: 'getInvoiceSummaryByQuery',
                body: {
                    "where": whereClause
                },
                orderby: '',
                isAscending: ''
            }

            $scope.$broadcast("getPageObj", vm.pageObj);
        }


        function getStatus(name, Isascending) {
            var whereClause;
            if (Isascending)
                whereClause = "deleteStatus = false AND invoiceStatus = '" + name + "' order by createDate DESC";
            else
                whereClause = "deleteStatus = false AND invoiceStatus = '" + name + "' order by createDate DESC";


            vm.pageObj = {
                service: 'invoice',
                method: 'getInvoiceSummaryByQuery',
                body: {
                    "where": whereClause
                },
                orderby: '',
                isAscending: ''
            }

            $scope.$broadcast("getPageObj", vm.pageObj);
        }

        function defaultCancel(item) {
            vm.sortarr[vm.indexno].upstatus = false;
            vm.sortarr[vm.indexno].downstatus = false;
            item.close = false;
            vm.orderby = "createDate",
                vm.isAscending = false;
            CheckFullArrayStatus(vm.orderby, vm.isAscending);
        }

        //Load data for the detail view
        vm.invSatus = "Unpaid"

        function loadDetailView() {

            vm.primaryToolbarContext = false;
            vm.currentThread = "ssss";


            var Invoice = {
                "permissionType": "add",
                "appName": "Invoices"
            };
            var jsonString = JSON.stringify(Invoice);

            var client = $serviceCall.setClient("getInvoiceByKey", "process");
            client.ifSuccess(function(data) {
                vm.invoiceArr = [];
                vm.products = [];
                var data = data;
                vm.products = data.invoiceLines;
                vm.invoiceArr.push(data);
                vm.inv = {};
                vm.inv = data;
                vm.invSatus = data.invoiceStatus;
            });
            client.ifError(function(data) {
                console.log("error loading setting data")
            })
            client.uniqueID($state.params.itemId); // send projectID as url parameters
            client.postReq(jsonString);
        }

        function fillview(val) {
            if (val.status != "Draft") {
                val.startDate = new Date(val.startDate)
                val.dueDate = new Date(val.dueDate)


                val.subTotal = parseFloat(val.subTotal * val.exchangeRate);
                val.netAmount = parseFloat(val.netAmount * val.exchangeRate);
                val.shipping = parseFloat(val.shipping * val.exchangeRate);

                if (val.invoiceStatus == "Partially Paid" || val.invoiceStatus == "Paid") {
                    vm.showCreditNote = false;
                } else {
                    vm.showCreditNote = true;
                }
                vm.invoiceArr1.push(val);
                var calculateDis = 0;
                var totalDiscount = 0;
                var subT = 0
                var itemPrice = 0;

                vm.products = [];
                vm.products = angular.copy(val.invoiceLines)
                for (var i = vm.products.length - 1; i >= 0; i--) {

                    vm.products[i].price = parseFloat(vm.products[i].price * val.exchangeRate).toFixed(2);

                    subT += parseFloat(vm.products[i].price * vm.products[i].quantity);
                    val.subTotal = parseFloat(subT).toFixed(2);
                    vm.products[i].amount = parseFloat(vm.products[i].price * vm.products[i].quantity).toFixed(2);
                    totalDiscount += parseFloat(subT * vm.products[i].discount / 100)
                    val.discountAmount = parseFloat(totalDiscount).toFixed(2);

                    if (val.taxAmounts.length >= 1) {
                        for (var i = val.taxAmounts.length - 1; i >= 0; i--) {
                            val.taxAmounts[i].salesTax = parseFloat(val.taxAmounts[i].salesTax * val.exchangeRate)
                        }
                    }

                    vm.tot = 0;
                    vm.paid = 0;
                    vm.paidAmount = 0;
                    var getsin = 0;
                    for (var x = 0; x <= val.multiDueDates.length - 1; x++) {
                        getsin = parseFloat(val.multiDueDates[x].balance * val.exchangeRate)
                        vm.singlebalance = parseFloat(val.netAmount - getsin).toFixed(2)

                        if (val.multiDueDates[x].paymentStatus == 'Cancelled') {
                            vm.showButton = false;
                        } else {
                            vm.showButton = true;
                        }
                        if (val.peymentTerm != 'multipleDueDates') {

                            vm.balanceDue = parseFloat(val.multiDueDates[x].balance * val.exchangeRate).toFixed(2);
                        } else {

                            vm.tot += parseFloat(val.multiDueDates[x].balance);
                            vm.paidAmount += parseFloat(val.multiDueDates[x].dueDatePrice - val.multiDueDates[x].balance);
                            vm.paid = parseFloat(vm.paidAmount).toFixed(2);
                            vm.calBalance = parseFloat(vm.tot).toFixed(2);
                        }
                    }
                }
            }
        }

        function cancelStatus() {
            if (vm.invSatus == "Unpaid") {

                var confirm = $mdDialog.confirm()
                    .title('Do you wish to cancel this Invoice ' + $state.params.itemId + '? ')
                    .content('This process is not reversible')
                    .ariaLabel('Lucky day')
                    .ok('Yes')
                    .cancel('No');
                $mdDialog.show(confirm).then(function() {

                    var Invoice = {
                        "permissionType": "add",
                        "appName": "Invoices"
                    };
                    var jsonString = JSON.stringify(Invoice);

                    var client = $serviceCall.setClient("cancelInvoice", "process");
                    client.ifSuccess(function(data) {
                        vm.orderby = "createDate";
                        vm.Isascending = false;
                        CheckFullArrayStatus(vm.orderby, vm.isAscending);

                        $mdToast.show(
                            $mdToast.simple()
                            .textContent('Invoice Successfully Cancelled')
                            .position('top right')
                            .hideDelay(3000)
                        );
                    });
                    client.ifError(function(data) {
                        console.log("error loading setting data")
                    })
                    client.uniqueID($state.params.itemId); // send projectID as url parameters
                    //client.GRNPattern("GRN0001");
                    client.postReq(jsonString);
                })
            } else {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .title('')
                    .content('This invoice cannot be Cancelled')
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                )

            }
        }

    }
})();