angular.module('iwx').controller('MessagesCtrl', function ($scope, $http, $state, $rootScope, eventType, userService) {
  $rootScope.welcome_bg = false;
  $scope.messages = [];
  $scope.message = {};
  //tree option and data
  $scope.treeOptions = {
    nodeChildren: 'children',
    dirSelectable: true,
    injectClasses: {
        ul: 'a1',
        li: 'a2',
        liSelected: 'a7',
        iExpanded: 'a3',
        iCollapsed: 'a4',
        iLeaf: 'a5',
        label: 'a6',
        labelSelected: 'tree_selected'
    }
  };
  /*$scope.dataForTheTree =[{ 'nickname' : '对话列表', 'id' : 0, 'children' : [
    {'nickname' : 'i微校管理员', 'id' : 1, 'children': []},
    {'nickname' : '学校管理员', 'id' : 2, 'children': []},
    {'nickname' : '社团成员', 'id' : 3, 'children' : []}
  ]}];*/
  $scope.dataForTheTree =[
    {'nickname' : 'i微校管理员', 'id' : 1, 'children': []},
    {'nickname' : '学校管理员', 'id' : 2, 'children': []},
    {'nickname' : '社团成员', 'id' : 3, 'children' : []}
  ];
  $scope.expandedNodes = [];
  //获取社团成员
  $scope.getCommMembers = function () {
    $http
      .get('/api/admin/messages')
      .success(function(data) {
        $scope.messages = data;
        var len = data.length;
        // var tree_children = $scope.dataForTheTree[0].children[2].children;
        var tree_children = $scope.dataForTheTree[2].children;
        for (var i=0;i<len;i++) {
          tree_children.push(data[i]);
          tree_children[i]['nickname_full'] = data[i].nickname;
          // tree_children[i]['parent_id'] = $scope.dataForTheTree[0].children[2].id;
          tree_children[i]['parent_id'] = $scope.dataForTheTree[2].id;
          if (tree_children[i].nickname.length > 7) {
            tree_children[i].nickname = tree_children[i].nickname.substring(0, 7) + '...';
          }
        }
        $scope.expandedNodes.push($scope.dataForTheTree[2]);
      });
      
  };
  $scope.getCommMembers();
  //获取学校管理员
  $scope.getUniManager = function () {
    userService
      .load()
      .then(function (data) {
        var uniManager = {};
        uniManager['nickname_full'] = data.university.name;
        // uniManager['parent_id'] = $scope.dataForTheTree[0].children[1].id;
        uniManager['parent_id'] = $scope.dataForTheTree[1].id;
        uniManager['university_id'] = data.university.id;
        if (uniManager.nickname_full.length > 7) {
          uniManager['nickname'] = uniManager.nickname_full.substring(0, 7) + '...';
        } else {
          uniManager['nickname'] = uniManager.nickname_full;
        }
        // $scope.dataForTheTree[0].children[1].children.push(uniManager);
        $scope.dataForTheTree[1].children.push(uniManager);
        $scope.expandedNodes.push($scope.dataForTheTree[1]);
      });
      
  };
  $scope.getUniManager();
  //获取iwx管理员
  $scope.getIwxManager = function () {
    $http
      .get('/api/admin/iwx/users')
      .success(function (data) {
        var len = data.length;
        // var tree_children = $scope.dataForTheTree[0].children[0].children;
        var tree_children = $scope.dataForTheTree[0].children;
        for (var i=0;i<len;i++) {
          tree_children.push(data[i]);
          tree_children[i]['nickname_full'] = data[i].nickname;
          // tree_children[i]['parent_id'] = $scope.dataForTheTree[0].children[0].id;
          tree_children[i]['parent_id'] = $scope.dataForTheTree[0].id;
          if (tree_children[i].nickname.length > 7) {
            tree_children[i].nickname = tree_children[i].nickname.substring(0, 7) + '...';
          }
        }
        $scope.expandedNodes.push($scope.dataForTheTree[0]);
        console.log($scope.dataForTheTree);
      });
  };
  $scope.getIwxManager();

  $scope.clearId = function(id) {
    angular.forEach($scope.messages, function(value) {
      if (value.user_id === parseInt(id)) {
        value.count = 0;
      }
    });
  };

  $scope.send = function() {
    // console.log($scope.message);
    $http.post('/api/admin/messages/members', $scope.message)
      .success(function(data) {
        $rootScope.$emit(eventType.NOTIFICATION, {
          // 'type': 'INFO',
          'type': 'POPMSG',
          'title': '消息',
          'message': '发送成功'
        });
      })
      .error(function(data){
        /*$rootScope.$emit(eventType.NOTIFICATION, {
          // 'type': 'INFO',
          'type': 'POPMSG',
          'title': '警告',
          'message': data.message
        });*/
      });
  };
});