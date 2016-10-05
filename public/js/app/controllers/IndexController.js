(function(angular) {

    'use strict';

    angular.module('mean-yeti').controller('index.controller', ['$scope', 'Api', IndexController]);

    function IndexController($scope, api) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        vm.projects = [];
        vm.tasks = [];
        vm.teams = [];
        vm.resources = [];
        vm.users = [];

        vm.currentUser = undefined;

        // Sets up a namespace to put functions
        $scope.func = {
            refreshData: refreshData,
            showSwitchUser: showSwitchUser,
        };
        var func = $scope.func;

        // Start
        activate();

        function activate() {
            func.refreshData();
        }

        function refreshData() {
            api.getAll('projects').then(function(result) {
                vm.projects = result.data;
                api.getAll('tasks').then(function(result) {
                    vm.tasks = result.data;
                    api.getAll('teams').then(function(result) {
                        vm.teams = result.data;
                        api.getAll('resources').then(function(result) {
                            vm.resources = result.data;
                            api.getAll('users').then(function(result) {
                                vm.users = result.data;

                                if(vm.currentUser === undefined) {
                                    vm.currentUser = vm.users[0];
                                }
                            });
                        });
                    });
                });
            });
        }

        function showSwitchUser(user) {
            vm.currentUser = user;
        }
    }
}(angular));
