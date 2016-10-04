(function(angular) {

    'use strict';

    angular.module('mean-yeti').controller('admin.controller', ['$scope', AdminController]);

    function AdminController($scope) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        vm.project = {
            name: '',
            startDate: '',
            endDate: '',
            tasks: [],
            tags: [],
            team: '',
            deliverables: [],
            systems: []
        };

        // Sets up a namespace to put functions
        $scope.func = {};
        var func = $scope.func;


        // Start
        activate();

        function activate() { }
    }
}(angular));
