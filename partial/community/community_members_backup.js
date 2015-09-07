angular.module('iwx').controller('CommunityMembersCtrl', function ($scope, $http, $state, ngTableParams, $rootScope, eventType, $window) {
    // Avoid lint complain
    var NgTableParams = ngTableParams;

    $scope.param = {};
    $scope.param.viewpending = true;
    $scope.param.viewin = true;
    //全部
    $scope.param.viewall = true;
    $scope.status = {
        'APPROVED': '已审核',
        'PENDING': '待审核'
    };

    $scope.reloadData = function(){
        var users = null;
        $scope.tableParams = new NgTableParams({
            page: 1,
            count: 10,
        }, {
            counts: [],
            total: 0,
            getData: function($defer, params) {
                if (users) {
                    $defer.resolve(users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
                $http.get('/api/admin/community/register/users', {
                    'page': params.page()
                }).success(function(data) {
                    console.log(data);
                    users = data;
                    params.total(data.length);
                    $defer.resolve(users.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                });
            }
        });
    };

    $scope.reloadData();

    $scope.readytoview = function(user) {
        if ($scope.param.viewin && user.status === 'APPROVED') {
            return true;
        } else if ($scope.param.viewpending && user.status === 'PENDING') {
            return true;
        } else if ($scope.param.viewall) {
            return true;
        }
    };
    //批准
    $scope.approve = function(user) {
        var url = '/api/admin/community/register/users/' + user.user.id + '/decision';
        $http.post(url, {
            'status': 'APPROVED'
        }).success(
            function(data) {
                $rootScope.$emit(eventType.NOTIFICATION, {
                    'type': 'INFO',
                    'message': '批准成功'
                });

                $window.location.reload();
            }
        );
    };
    //拒绝
    $scope.reject = function(user, reason) {
        var url = '/api/admin/community/register/users/' + user.user.id + '/decision';
        $http.post(url, {
            'status': 'REJECTED',
            'reason': reason
        }).success(
            function(data) {
                $rootScope.$emit(eventType.NOTIFICATION, {
                    'type': 'INFO',
                    'message': '拒绝成功'
                });
                
                $window.location.reload();
            }
        );
    };
});