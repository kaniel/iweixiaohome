angular.module('iwx').controller('CommunityCtrl', function ($scope, $http, $modal, userService, $rootScope, eventType, ngTableParams) {
  $rootScope.welcome_bg = false;
  var NgTableParams = ngTableParams;
  var admins = null;
  userService.load().then(function(user) {
    if (user.roles[0].name === 'SUPER_USER') {
      $scope.su = true;
      $scope.tableParams = new NgTableParams({
        page: 1,
        count: 10,
      }, {
        counts: [],
        getData: function($defer, params) {
          if (admins) {
            $defer.resolve(admins.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          }
          $http.get('/api/su/pending_admins').success(function(data) {
            admins = data;
            $defer.resolve(admins.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
        }
      });
    } else {
      $scope.su = false;
      $http.get('/api/admin/community').success(function(data) {
        $scope.community = data;
      });
    }
  });
  $scope.preview = function(url) {
    $modal.open({
      template: '<div><img style="width:100%" src=' + url + '></div>',
      size: "md",
    });
  };

  $scope.confirm = function(id) {
    $rootScope.$emit(eventType.NOTIFICATION, {
      'type': 'LONG_INFO',
      'message': '处理中...'
    });
    $http.get('/api/su/confirm/' + id).success(function(data) {
      admins = data;
      $scope.tableParams.reload();
      $rootScope.$emit(eventType.NOTIFICATION, null);
    });
  };

  $scope.submit = function() {
    var fd = new FormData();
    angular.forEach($scope.community, function(value, key) {
      fd.append(key, value);
    });
    $http.post('/api/admin/community', fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(data) {
      $scope.community = data;
      $rootScope.$emit(eventType.NOTIFICATION, {
        // 'type': 'INFO',
        'type': 'POPMSG',
        'title': '消息',
        'message': '保存成功'
      });
    });
  };
});