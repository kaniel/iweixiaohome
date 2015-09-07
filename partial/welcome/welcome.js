angular.module('iwx')
	.controller('WelcomeCtrl',function ($scope, $rootScope, $http, userService){
		$rootScope.welcome_bg = true;
		//获取校级管理员统计数据方法
		$scope.get_stat_university = function () {
			$http
				.get('/api/un/home')
				.success(function (data) {
					$scope.stat_data_un = data;
				});
		};
		
		//获取社团管理员统计数据方法
		$scope.get_stat_admin = function () {
			$http
				.get('/api/admin/home')
				.success(function (data) {
					$scope.stat_data_admin = data;
				});
		};
		
		$scope.load_stat_data = function () {
			if ($scope.user.role.name === 'ADMIN') {
				$scope.get_stat_admin();
			} else if($scope.user.role.name === 'UN_ADMIN') {
				$scope.get_stat_university();
			}
		};
		/*userService
			.load()
			.then(function (user) {
				$scope.user = user;
				$scope.load_stat_data();
			});*/
		console.log($scope.user);
		if ($scope.user) {
			$scope.load_stat_data();
		}
	});