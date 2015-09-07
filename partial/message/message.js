angular.module('iwx').controller('MessageCtrl', function ($scope, $http, $stateParams, userService, $rootScope, eventType, $modal) {
    $scope.messages = [];

    var messageSet = {};

    var current_page = 1;

    var loadMessages = function(page) {
      var url = '/api/admin/messages/' + $stateParams.id +
        '?page=' + page + '&per_page=' + 10;
      $http.get(url).success(function(data) {
        if (data.items.length === 0) {
            $rootScope.$emit(eventType.NOTIFICATION, {
                'type': 'POPMSG',
                'title': '消息',
                'message': '已加载全部聊天信息'
            });
            return; 
        }
        var added = 0;
        angular.forEach(data.items, function(value) {
            if (!(value.id in messageSet)) {
                messageSet[value.id] = true;
                $scope.messages.push(value);
                added++;
            }
        });
        if (added === 0) {
            loadMessages(++current_page);
        }
      });
    };

    loadMessages(current_page);

    $scope.loadMore = function() {
        loadMessages(++current_page);
    };

    $scope.send = function() {
        if (!$scope.content) { return; }
        $http.post('/api/admin/messages/' + $stateParams.id, {
            'content': $scope.content
        }).success(function(data) {
            messageSet[data.id] = true;
            $scope.messages.unshift(data);
        });
        $scope.content = '';
    };

    $scope.viewImage = function(image) {
        try {
            var tempArr = image.split('/');
            if (tempArr[tempArr.length - 1] === 'placeholder.png') {
                return;
            }
          // console.log(tempArr);
        } catch (e) {
            $rootScope.$emit(eventType.NOTIFICATION, {
                'type': 'POPMSG',
                'title': '警告',
                'message': '图片路径不正确'
            });
            return;
        }
        $modal.open({
            template: '<div><img style="width:100%" src=' + image + '></div>',
            size: "lg",
        });
    };

    $http.put('/api/admin/messages/' + $stateParams.id).success(function() {
        $scope.$parent.clearId($stateParams.id);
    });

    userService.load().then(function(data) {
      $scope.community = data.managed_community;
      $http.get('/api/users/' + $stateParams.id).success(function(data) {
            $scope.user = data;
        });
      });
});