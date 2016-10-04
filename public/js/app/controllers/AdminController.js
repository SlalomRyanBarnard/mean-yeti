(function(angular) {

    'use strict';

    angular.module('mean-yeti').controller('admin.controller', ['$scope', 'Api', AdminController]);

    function AdminController($scope, api) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        vm.showing = '';
        vm.editingProject = false;
        vm.editingProjectId = '';

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
        $scope.func = {
            selectDataType: selectDataType,
            editProject: editProject,
            deleteProject: deleteProject,
        };
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
            vm.showing = dataType;

            if(dataType === 'projects') {
                api.getAll(dataType).then(function(result) {
                    console.log(result.data);
                   vm.projects = result.data;
                });
            }
        }

        function editProject(id) {
            vm.editingProject = true;
            vm.editingProjectId = id;
        }

        function deleteProject(id) {
            api.remove('projects', id).then(function() {
                func.selectDataType('projects');
            });
        }
    }
}(angular));
