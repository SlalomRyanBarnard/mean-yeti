angular.module('mean-yeti', [ 'ngSanitize' ])
    .config(['$compileProvider', function ($compileProvider) {
        // disable debug info
        $compileProvider.debugInfoEnabled(false);
    }]);