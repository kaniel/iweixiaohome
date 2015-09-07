angular.module('iwx').controller(
    'RegisterCtrl', function ($scope, $http, $rootScope, $state, eventType) {
  $rootScope.welcome_bg = false;
  $scope.user = {
  };
  $scope.community = {
  };
  $scope.community_scope = {
  };
  $scope.universities = [];
  //加载省份信息
  $scope.load_province = function () {
    $http
      .get('/api/su/geography/0')
      .success(function (data) {
        $scope.provinceArray = data;
      });
  };
  $scope.load_province();
  //加载市信息
  $scope.load_city = function () {
    $http
      .get('/api/su/geography/' + $scope.community_scope.province_scope_id)
      .success(function (data) {
        $scope.cityArray = data;
      });
  };
  //加载学校信息
  $scope.load_university = function () {
    $http
      .get('/api/university/' + $scope.community_scope.city_scope_id + '/universities')
      .success(function (data) {
        $scope.universities = data;
      });
  };
  //监听省级管理范围
  $scope.change_province = function () {
    if ($scope.community_scope.province_scope_id) {
      $scope.load_city();
    }
  };
  //监听市级管理范围
  $scope.change_city = function () {
    if ($scope.community_scope.city_scope_id) {
      $scope.load_university();
    }
  };
  $scope.submit = function() {
    var fd = new FormData();
    angular.forEach($scope.user, function(value, key) {
      fd.append(key, value);
    });
    angular.forEach($scope.community, function(value, key) {
      fd.append(key, value);
    });
    $http.post('/api/auth/admin/register', fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    }).success(function(data) {
      $rootScope.$emit(eventType.NOTIFICATION, {
        'type': 'LONG_INFO',
        'message': "注册成功，等待人工核对信息. 我们将会以邮件方式通知您核对的结果, 请耐心等候..."
      });
      $state.go('welcome');
    });
  };
  /*$http.get('/api/universities').success(function(universities) {
    $scope.universities = universities;
  });*/
});