angular.module('iwx').controller('CommunityMembersCtrl', function ($scope, $http, $modal, $state, ngTableParams, $rootScope, eventType, $window) {
    //当前路径状态
    var curr_state = $state.current.name;
    $scope.param = {};
    $scope.param.view = 'ALL';
    if (curr_state === 'community.approved') {
        $scope.param.view = "APPROVED";
    } else if (curr_state === 'community.pending') {
        $scope.param.view = "PENDING";
    }
    $scope.status = {
        'APPROVED': {
            'text': '已审核',
            'label': 'label label-success'
        },
        'PENDING': {
            'text': '待审核',
            'label': 'label label-warning'
        },
        'REJECTED': {
            'text': '已拒绝',
            'label': 'label label-danger'
        }
    };

    // $scope.reloadData = function(){
    // Avoid lint complain
    var NgTableParams = ngTableParams;
    var users = null;
    $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
    }, {
        counts: [],
        total: 0,
        getData: function ($defer, params) {
            /*if (users) {
                $defer.resolve(users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }*/
            //请求参数
            var request_param;
            if ($scope.param.view === 'ALL'){
                request_param = '?page=' + params.page() + '&per_page=' + params.count();
            } else {
                request_param = '?page=' + params.page() + '&per_page=' + params.count() + '&register_type=' + $scope.param.view;
            }
            $http.get('/api/admin/community/register/users' + request_param/*, {
                'page': params.page()
            }*/).success(function(data) {
                // console.log(data);
                users = data.items;
                params.total(data.total);
                $defer.resolve(users);
            });
        }
    });
    // };

    // $scope.reloadData();

   /* $scope.readytoview = function(user) {
        if ($scope.param.viewin && user.status === 'APPROVED') {
            return true;
        } else if ($scope.param.viewpending && user.status === 'PENDING') {
            return true;
        } else if ($scope.param.viewall) {
            return true;
        }
    };*/
    //批准
    $scope.approve = function(user) {
        var url = '/api/admin/community/register/users/' + user.user.id + '/decision';
        $http.post(url, {
            'status': 'APPROVED'
        }).success(
            function (data) {
                $rootScope.$emit(eventType.NOTIFICATION, {
                    'type': 'POPMSG',
                    'title': '消息',
                    'message': '批准成功'
                });
                $scope.tableParams.reload();
                // $window.location.reload();
            }
        );
    };
    //拒绝
    $scope.reject = function(user, reason) {
        $modal.open({
            templateUrl: 'partial/community/community_reject_reason.html',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.ok = function () {
                    if (!$scope.content) { return; }
                    $http.post('/api/admin/messages/' + user.user.id, {
                        'content': $scope.content
                    }).success(function (data) {
                        $modalInstance.close('ok');
                        $http.post('/api/admin/community/register/users/' + user.user.id + '/decision', {
                            'status': 'REJECTED',
                            'reason': reason
                        }).success(function (data) {
                            /*$rootScope.$emit(eventType.NOTIFICATION, {
                                'type': 'POPMSG',
                                'title': '消息',
                                'message': '拒绝成功'
                            });*/
                            $rootScope.$broadcast('table_reload');
                            // $scope.tableParams.reload();
                            // $window.location.reload();
                        });
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]
        });
        
    };
    $scope.$on('table_reload', function () {
        $scope.tableParams.reload();
    });
    //私信
    $scope.private_letter = function (user_id) {
        $modal.open({
            templateUrl: 'partial/community/community_letter.html',
            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.ok = function () {
                    if (!$scope.content) { return; }
                    $http.post('/api/admin/messages/' + user_id, {
                        'content': $scope.content
                    }).success(function(data) {
                        $modalInstance.close('ok');
                        $rootScope.$emit(eventType.NOTIFICATION, {
                            'type': 'POPMSG',
                            'title': '消息',
                            'message': '已经成功发送私信。'
                        });
                    });
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]
        });
    };
});