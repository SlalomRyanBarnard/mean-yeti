(function(angular) {

    'use strict';

    angular.module('mean-yeti').controller('admin.controller', ['$scope', 'Api', AdminController]);

    function AdminController($scope, api) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        vm.showing = '';
        vm.editingProject = false;
        vm.editingProjectInfo = undefined;
        vm.isNewItem = false;

        // Sets up a namespace to put functions
        $scope.func = {
            selectDataType: selectDataType,
            editProject: editProject,
            deleteProject: deleteProject,
            createProject: createProject,
            updateProject: updateProject,
        };
        var func = $scope.func;

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

        function createProject() {
            api.create(api.endpoint.project, vm.editingProjectInfo).then(function() {
                vm.editingProject = false;
                func.selectDataType('projects');
            });
        };

        function updateProject() {
            api.update(api.endpoint.project, vm.editingProjectInfo._id, vm.editingProjectInfo).then(function() {
                vm.editingProject = false;
                func.selectDataType('projects');
            });
        }


        function editProject(project) {
            vm.editingProject = true;
            vm.editingProjectInfo = angular.copy(project);

            if(vm.editingProjectInfo === undefined) {
                vm.isNewItem = true;
                vm.editingProjectInfo = {
                    name: '',
                    startDate: new Date(),
                    endDate: new Date(),
                    tasks: [],
                    tags: [],
                    team: '',
                    deliverables: [],
                    systems: []
                };
            } else {
                vm.editingProjectInfo.startDate = new Date(project.startDate);
                vm.editingProjectInfo.endDate = new Date(project.endDate);
                vm.isNewItem = false;
            }
        }

        function deleteProject(id) {
            api.remove('projects', id).then(function() {
                func.selectDataType('projects');
            });
        }
    }
}(angular));
