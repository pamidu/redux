(function ()
{
    'use strict';

    angular
        .module('12thDoor')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope, $timeout, $state, $auth, $interval)
    {
        // Activate loading indicator
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function ()
        {
            $rootScope.loadingProgress = true;
        });

        // De-activate loading indicator
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
        });

        // Store state in the root scope for easy access
        $rootScope.state = $state;

        // uiMicrokernal Session check

        var frameworkSessionCheck = function () {
            if ($auth.checkSession()) {
                $rootScope.cc_sessionInfo = $auth.getSession();
                console.log($rootScope.cc_sessionInfo);
            } else {
                console.log('framework isnotLoggedIn');
            }
        };

        frameworkSessionCheck();

        // Cleanup
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();