angular.module('mean-yeti').filter('firstWord', function() {
    return function(str) {

        if(str === undefined) {
            return '';
        }

        return str.split(' ')[0];
    };
});
