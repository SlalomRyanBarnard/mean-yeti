(function(angular) {


    angular.module('mean-yeti').controller('index.controller', ['$scope', 'Api', '$timeout', IndexController]);

    function IndexController($scope, api, $timeout) {

        // Sets up a namespace to put data
        $scope.vm = {};
        var vm = $scope.vm;

        vm.projects = [];
        vm.tasks = [];
        vm.teams = [];
        vm.resources = [];
        vm.users = [];

        vm.currentUser = undefined;
        vm.selectedProject = undefined;

        // Sets up a namespace to put functions
        $scope.func = {
            refreshData: refreshData,
            showSwitchUser: showSwitchUser,
            selectProject: selectProject,
            removeProjectFavorite: removeProjectFavorite,
            makeProjectFavorite: makeProjectFavorite,
            inPast: inPast,

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

                                    // Wait for a digest cycle before populating.
                                    $timeout(function() {
                                        drawGanttChart();
                                        drawWatchedProjectsCharts();
                                    }, 100);
                                }
                            });
                        });
                    });
                });
            });
        }

        function showSwitchUser(user) {
            vm.currentUser = user;
            drawWatchedProjectsCharts();
        }

        function selectProject(project) {
            vm.selectedProject = project;
            vm.selectedProject.startDate = new Date(vm.selectedProject.startDate);
            vm.selectedProject.endDate = new Date(vm.selectedProject.endDate);

            $timeout(function() {
                drawActivityChart();
                $('html, body').animate({
                    scrollTop: $("#projectDetails").offset().top
                }, 500);
            }, 10);
        }

        function makeProjectFavorite(id) {
            vm.currentUser.projects.push(id);
            api.update(api.endpoint.user, vm.currentUser._id, vm.currentUser).then(function(result) {
                api.getAll('resources').then(function(result1) {
                    vm.resources = result1.data;
                    vm.currentUser = result.data;

                    // Wait for a digest cycle before populating.
                    $timeout(function() {
                        drawGanttChart();
                        drawWatchedProjectsCharts();
                    }, 100);
                });
            });
        }

        function removeProjectFavorite(id) {
            var idx = vm.currentUser.projects.indexOf(id);
            vm.currentUser.projects.splice(idx, 1);
            api.update(api.endpoint.user, vm.currentUser._id, vm.currentUser).then(function(result) {
                api.getAll('resources').then(function(result1) {
                    vm.resources = result1.data;
                    vm.currentUser = result.data;

                    // Wait for a digest cycle before populating.
                    $timeout(function() {
                        drawGanttChart();
                        drawWatchedProjectsCharts();
                    }, 100);
                });
            });
        }

        function inPast(checkDate){
            var now = new Date();
            return checkDate < now ? true : false;
        }

        function drawGanttChart() {

            var ganttRows = [];

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Task ID');
            data.addColumn('string', 'Task Name');
            data.addColumn('string', 'Resource');
            data.addColumn('date', 'Start Date');
            data.addColumn('date', 'End Date');
            data.addColumn('number', 'Duration');
            data.addColumn('number', 'Percent Complete');
            data.addColumn('string', 'Dependencies');

            var sortedProjects = vm.projects.sort(function(a,b){
                return new Date(b.startDate) - new Date(a.startDate);
            });

            sortedProjects.forEach(function(project) {

                // TODO: Get this value from the backend
                var percentComplete = 0;

                var teamName = '(none)';
                vm.teams.forEach(function(team) {
                   if(team._id === project.team) {
                       teamName = team.name;
                   }
                });

                if(ganttRows.length < 10) {
                    ganttRows.push([
                        project._id, project.name, teamName, new Date(project.startDate), new Date(project.endDate), null, percentComplete, null
                    ]);
                }
            });
            data.addRows(ganttRows);

            var options = {
                height: 350,
                gantt: {
                    trackHeight: 30
                }
            };

            var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

            chart.draw(data, options);
        }

        function drawWatchedProjectsCharts() {

            vm.projects.forEach(function(project) {
                var radarDataChart = {
                    labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
                    datasets: [
                        {
                            label: "",
                            backgroundColor: "rgba(26,179,128,0.2)",
                            borderColor: "rgba(23,152,126,1)",
                            data: [20, 60, 90, 10]
                        },
                    ]
                };
                var radarOptions = {
                    responsive: true,
                    legend: { display: false }
                };

                var ctx1 = document.getElementById("statusChart" + project._id).getContext("2d");
                new Chart(ctx1, {type: 'radar', data: radarDataChart, options:radarOptions});
            });
        }
        function drawActivityChart() {
            var radarDataChart1 = {
                labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
                datasets: [
                    {
                        label: "",
                        backgroundColor: "rgba(26,179,128,0.2)",
                        borderColor: "rgba(23,152,126,1)",
                        data: [20, 60, 90, 10]
                    },
                ]
            };

            var radarOptions = {
                responsive: true,
                legend: { display: false }
            };

            var ctx1b = document.getElementById("ActivityChartProjectDetails").getContext("2d");
            new Chart(ctx1b, {type: 'radar', data: radarDataChart1, options:radarOptions});
        }
    }
}(angular));
