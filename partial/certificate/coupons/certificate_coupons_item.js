angular.module('iwx').controller('CertificateCouponsItemCtrl', function ($scope, $http, $modal, $state, $stateParams, $rootScope, $filter, eventType) {
  $scope.coupons = {};
  //根据id判断是创建电子礼券还是修改电子礼券
  $scope.edit_id = $stateParams.id;
  if ($scope.edit_id !== '-1') {
    $http
      .get('/api/goods/' + $scope.edit_id)
      .success(function (data) {
        // data.end_time = $filter('date')(data.end_time, 'yyyy-MM-dd HH:mm');
        $scope.coupons = data;
        console.log($scope.coupons);
      });
  } else {
    $scope.coupons = {};  
  }

  $scope.validation = function() {
    if($scope.coupons.title == null || $scope.coupons.title === "") {
      $rootScope.$emit(eventType.NOTIFICATION, {
          // 'type': 'ERROR',
          'type': 'POPMSG',
          'title': '警告',
          'message': '请正确输入名称'
      });
      return false;
    }

    if($scope.coupons.end_time == null || $scope.coupons.end_time === "") {
      $rootScope.$emit(eventType.NOTIFICATION, {
          // 'type': 'ERROR',
          'type': 'POPMSG',
          'title': '警告',
          'message': '请正确输入结束时间'
      });
      return false;
    }

    if($scope.coupons.sponsor_name == null || $scope.coupons.sponsor_name === "") {
      $rootScope.$emit(eventType.NOTIFICATION, {
          // 'type': 'ERROR',
          'type': 'POPMSG',
          'title': '警告',
          'message': '请正确输入赞助商名称'
      });
      return false;
    }

    if($scope.coupons.total == null || isNaN(parseInt($scope.coupons.total)) || parseInt($scope.coupons.total) <= 0) {
      $rootScope.$emit(eventType.NOTIFICATION, {
          // 'type': 'ERROR',
          'type': 'POPMSG',
          'title': '警告',
          'message': '请正确输入总数'
      });
      return false;
    }
    return true;
  };


  var getFormData = function () {
    var fd = new FormData();
    
    fd.append('end_time', $scope.coupons.end_time);
    fd.append('title', $scope.coupons.title);
    fd.append('sponsor_name', $scope.coupons.sponsor_name);
    fd.append('sponsor_logo', $scope.coupons.sponsor_logo);
    fd.append('image', $scope.coupons.image);
    fd.append('total', $scope.coupons.total);
    return fd;
  };
  //创建电子礼券
  $scope.create = function() {
    if(!$scope.validation()) {
      return;
    }

    $http.post('/api/goods', getFormData(), {
      headers: {
        'Content-Type': undefined
      }
    }).success(function (data) {
      $state.go('certificate_coupons', {}, {reload: true});
      $rootScope.$emit(eventType.NOTIFICATION, {
        // 'type': 'INFO',
        'type': 'POPMSG',
        'title': '消息',
        'message': '成功创建电子礼券。'
      });
    });
  };
  //修改电子礼券
  $scope.update = function (id) {
    if (!$scope.validation()) {
      return;
    }

    $http
      .put('/api/goods/' + id, getFormData(), {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      })
      .success(function (data) {
        $state.go('certificate_coupons', {}, {reload: true});
        $rootScope.$emit(eventType.NOTIFICATION, {
          'type': 'POPMSG',
          'title': '消息',
          'message': '成功修改电子礼券。'
        });
      });
  };
});