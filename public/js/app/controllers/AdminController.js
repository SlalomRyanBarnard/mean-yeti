(function(angular) {

    'use strict';

    angular.module('mean-yeti').controller('admin.controller', ['$scope', 'Api', AdminController]);

    function AdminController($scope, api) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        $scope.func = {};
        var func = $scope.func;

        func = {
            selectDataType: selectDataType
        };

        vm.showing = '';

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

        /**
         *
         */
        func.createProject = function() {

            console.log(vm.project);
            api.create(api.endpoint.project, vm.project);
        };

        // Start
        activate();

        function activate() { }

        function selectDataType(dataType) {
            console.log('asdf');
            vm.showing = dataType;
        }
    }
}(angular));
