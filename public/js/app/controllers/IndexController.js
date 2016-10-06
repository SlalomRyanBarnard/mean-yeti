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

        vm.apiCalls = 0;

        vm.notifications = [];

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

                    vm.tasks = vm.tasks.sort(function(a,b){
                        return new Date(b.endDate) - new Date(a.endDate);
                    });


                    api.getAll('teams').then(function(result) {
                        vm.teams = result.data;
                        api.getAll('resources').then(function(result) {
                            vm.resources = result.data;
                            api.getAll('users').then(function(result) {
                                vm.users = result.data;

                                vm.projects.forEach(function(project) {
                                    vm.apiCalls++;
                                    api.getProjectDetails(project._id).then(function(result) {
                                       project.details = result.data;
                                        vm.apiCalls--;
                                    });
                                });


                                if(vm.currentUser === undefined) {
                                    vm.currentUser = vm.users[0];

                                    // Wait for a digest cycle before populating.
                                    $timeout(analyzeData, 1000);
                                }
                            });
                        });
                    });
                });
            });
        }

        function analyzeData() {
            if(vm.apiCalls > 0) {
                console.log('not done getting data...try again in a moment.');
                $timeout(analyzeData, 300);
                return;
            }

            generateNotifications();
            drawGanttChart();
            drawWatchedProjectsCharts();
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
                drawActivityChart(project);
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
                var percentComplete = project.details.percentComplete;

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
                            data: [project.details.dependencies, project.details.timeline, project.details.tasks, project.details.complexity]
                           // data: [20, 60, 90, 10]
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
        function drawActivityChart(project) {
            var radarDataChart1 = {
                labels: ["Dependencies", "Timeline", "Tasks", "Complexity"],
                datasets: [
                    {
                        label: "",
                        backgroundColor: "rgba(26,179,128,0.2)",
                        borderColor: "rgba(23,152,126,1)",
                        data: [project.details.dependencies, project.details.timeline, project.details.tasks, project.details.complexity]
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

        function generateNotifications() {

            var notificationLevelGood = 4;
            var notificationLevelError = 3;
            var notificationLevelWarning = 2;
            var notificationLevelInfo = 1;

            // Find projects that are almost complete.
            vm.projects.forEach(function(project) {

                var hoursToEnd = (new Date(project.endDate) - new Date()) / (1000 * 60 * 60);
                if(hoursToEnd >= 0 && hoursToEnd < (24*4)) {
                    vm.notifications.push({
                        level: notificationLevelGood,
                        text: 'Project ' + project.name + ' will end in ' + Math.round(hoursToEnd) + ' hours.'});
                }
            })

            // Find projects that are overdue.
            vm.projects.forEach(function (project) {
                if((new Date(project.endDate) - new Date()) < 0) {
                    if(project.details.percentComplete < 100) {
                        vm.notifications.push({
                            level: notificationLevelError,
                            text: 'Project ' + project.name + ' is past due.'});
                    }
                }
            });

            // Find projects with overdue tasks.
            vm.projects.forEach(function (project) {
                var projectOverdueTasks = 0;
                vm.tasks.forEach(function(task) {
                    if(task.project !== project._id) return;

                    if((new Date(task.endDate) - new Date()) < 0) {
                        projectOverdueTasks++;
                    }
                })
                if(projectOverdueTasks > 0) {
                    vm.notifications.push({
                        level: notificationLevelWarning,
                        text: 'Project ' + project.name + ' has ' + projectOverdueTasks + ' task' + (projectOverdueTasks > 1 ? 's' : '')  + ' that are past due.'});
                }
            });

            // Find resources who are double-booked.
            vm.resources.forEach(function(resource) {

                var overbooked = false;

                vm.tasks.forEach(function(task) {
                    if(resource.tasks.indexOf(task._id) === -1) return;
                    if(task.isComplete === true) return;

                    var checkDate1 = new Date(task.startDate);
                    var checkDate2 = new Date(task.endDate);

                    // Check it...
                    vm.tasks.forEach(function(checkTask) {
                        if(resource.tasks.indexOf(checkTask._id) === -1) return;
                        if(checkTask.isComplete === true) return;
                        if(checkTask._id === task._id) return;

                        if(checkDate1 > new Date(checkTask.startDate) && checkDate1 < new Date(checkTask.endDate)) {
                            overbooked = true;
                        }
                        if(checkDate2 > new Date(checkTask.startDate) && checkDate2 < new Date(checkTask.endDate)) {
                            overbooked = true;
                        }
                    });
                });

                if(overbooked === true) {
                    vm.notifications.push({level: notificationLevelInfo, text: 'TEAM resource ' + resource.name + ' is over capacity.'});
                }
            });
        }

        function numHoursBetween(d1, d2) {
            var diff = d1.getTime() - d2.getTime();
            return diff / (1000 * 60 * 60);
        };
    }
}(angular));
