angular.module('iwx')
	.controller('ActivityUniversityCtrl', function ($scope, $rootScope, $http, ngTableParams, eventType, $modal, $state) {
		$rootScope.welcome_bg = false;
		$scope.confirm = {};
	    $scope.confirm.title = "请确定您的操作";
	    $scope.confirm.message = "MESSAGE";
	    $scope.confirm.type = "";
	    $scope.confirm.param = "";
	    //页码初始值
	    $scope.current_page = 1;
	    //活动列表参数
	    $scope.activities_list_param = '/api/un/activity';
	    //查询到的社团
    	$scope.communities = [];
    	$scope.community_set = {};
	    $scope.plugins_config = {
	      announcement:{
	        'id':'announcement',
	        'name':'公告板',
	        'icon_path':'/static/images/announcement_new.png',
	        'note':'活动地点，时间，临时突发状况可以通过公告板第一时间推送给所有关注本活动的小伙伴们。'
	      },
	      timeline:{
	        'id':'timeline',
	        'name':'活动动态',
	        'icon_path':'/static/images/timeline_new.png',
	        'note':'通过图片和文字形式还原现场实时动态，每一条动态可通过大屏幕实时展示。'
	      },
	      ticket:{
	        'id':'ticket',
	        'name':'电子票',
	        'icon_path':'/static/images/ticket_new.png',
	        'note':'环保，时尚的电子票据，作为活动唯一的入场凭证，电子票面内可以自定义广告位（包含票面背景和赞助商logo），通过后台可以实时查看抢票人数，实际到场验票人数，客观反映现场的热烈程度，每一张电子票都有唯一的电子票编号，可被用于后续的其他环节继续使用。'
	      },
	      vote:{
	        'id':'vote',
	        'name':'投票',
	        'icon_path':'/static/images/vote_new.png',
	        'note':'支持自定义候选项，可以是候选人，也可以是候选题目，通过灵活设置投票规则，可以收集到较为精确的投票统计数据。'
	      },
	      sign_in:{
	        'id':'sign_in',
	        'name':'签到',
	        'icon_path':'/static/images/sign_in_new.png',
	        'note':'轻量化的入场凭证，可作为活动唯一的入场方式，童鞋们通过扫描入场处的二维码签到入场，每一张签到凭证都有唯一的签到号码，可被用于后续的其他环节继续使用。'
	      },
	      lottery:{
	        'id':'lottery',
	        'name':'抽奖',
	        'icon_path':'/static/images/lottery_new.png',
	        'note':'活跃现场利器，社团可根据自己的实际情况安排出对应的单项奖，配合大屏幕的使用可以让活动现场悬念感十足，加强社团与参会小伙伴们的互动。'
	      },
	      contests:{
	        'id':'contests',
	        'name':'打分',
	        'icon_path':'/static/images/grade_new.png',
	        'note':'打分'
	      }
	    };
	    //加载学校社团
	    var load_university_communities = function (page) {
	    	$http
	            .get('/api/un/community?page=' + page + '&per_page=12')
	            .success(function (data) {
	                if (data.items.length === 0) {
	                    if (page === 1) {
	                        $rootScope.$emit(eventType.NOTIFICATION, {
	                            'type': 'POPMSG',
	                            'title': '消息',
	                            'message': '没有符合条件的社团'
	                        });
	                    } else {
	                        $rootScope.$emit(eventType.NOTIFICATION, {
	                            'type': 'POPMSG',
	                            'title': '消息',
	                            'message': '已加载全部符合条件的社团'
	                        });
	                    }
	                    return;
	                }
	                $scope.show_community = true;
	                var add = 0;
	                angular.forEach(data.items, function (value) {
	                    if (!(value.id in $scope.community_set)) {
	                        $scope.community_set[value.community.id] = true;
	                        $scope.communities.push(value.community);
	                        add++;
	                    }
	                });
	                if (add === 0) {
	                    load_university_communities(++$scope.current_page);
	                }
	            });
	    };
	    load_university_communities($scope.current_page);
	    $scope.load_more = function () {
	        load_university_communities(++$scope.current_page);
	    };
	    //选择社团条件
		$scope.get_checked_community = function (id) {
	        $scope.activities_list_param = '/api/un/' + id + '/activity';
	        $scope.tableParams.page(1);
	        $scope.tableParams.reload();
		};
	    //加载社团活动
	    var load_activities = function () {
	    	// Avoid lint complain
		    var NgTableParams = ngTableParams;
		    var activities = null;
		    $scope.tableParams = new NgTableParams({
		        page: 1,
		        count: 10,
		    }, {
		        counts: [],
		        total: 0,
		        getData: function($defer, params) {
		            $http.get($scope.activities_list_param + '?page='+params.page() + '&per_page=' + params.count())
		                .success(function(data) {
		                // console.log(data);
		                var items = data.items;
		                if (items) {
		                    var len_items = items.length;
		                    for (var i=0;i<len_items;i++) {
		                        var temp_item_plugin = items[i].plugins;
		                        var len_plugins = temp_item_plugin.length;
		                        for (var j=0;j<len_plugins;j++) {
		                            var temp_plugin = temp_item_plugin[j];
		                            temp_plugin['icon_path'] = $scope.plugins_config[temp_plugin.id].icon_path;
		                        }
		                    }
		                }
		                activities = items;
		                params.total(data.total);
		                $defer.resolve(activities);
		            });
		        }
		    });
	    };
	    load_activities();
	    //调用删除活动接口
	    $scope.confirmModal = function(){
	        if($scope.confirm.type === 'deleteActivity') {
	            $http
	            	.delete('' + $scope.confirm.param)
	                .success(function (data) {
	                    $scope.tableParams.reload();
	                });
	        } else if ($scope.confirm.type === 'undercarriage') {
	        	$http
	        		.post('/api/un/' + $scope.confirm.param + '/unpublish')
	        		.success(function (data) {
	        			$scope.tableParams.reload();
	        		});
	        }
	    };
	    //删除活动
	    $scope.delete_activity = function(activity_id) {
	        $scope.confirm.message = "您确定要删除这个活动吗?";
	        $scope.confirm.type = "deleteActivity";
	        $scope.confirm.param = activity_id;
	        $("#confirmModal").modal();
	        return;
	    };
	    //置顶接口调用
	    var _to_top = function(activity_id) {
	        $http.post('/api/un/' + activity_id + '/top')
	            .success(function(data) {
	                $scope.tableParams.reload();
	            });
	    };
	    /*//取消置顶接口调用
	    $scope._to_down = function (activityId) {
	        $http.post('/api/admin/activities/' + activityId + '/down')
	            .success(function(data) {
	                $rootScope.$emit(eventType.NOTIFICATION, {
	                    'type': 'POPMSG',
	                    'title': '消息',
	                    'message': '取消置顶成功'
	                });
	                $scope.tableParams.reload();
	            });
	    };*/
	    //置顶
	    $scope.setTop = function (activity_id, published) {
	        if (!published) {
	            $rootScope.$emit(eventType.NOTIFICATION, {
	                'type': 'POPMSG',
	                'title': '消息',
	                'message': '活动尚未发布，不能进行置顶操作'
	            });
	            return;
	        }
	        var modalInstance = $modal.open({
	            templateUrl: 'partial/activity/item/top_modal.html',
	            size: 'md',
	            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
	                $scope.ok = function () {
	                    $modalInstance.close();
	                };

	                $scope.cancel = function () {
	                    $modalInstance.dismiss('cancel');
	                };
	            }]
	        });
	        modalInstance.result.then(function (selectedItem) {
	            _to_top(activity_id);
	        });
	    };
	    //取消置顶
	    /*$scope.cancelTop = function (activityId, published) {
	        if (!published) {
	            $rootScope.$emit(eventType.NOTIFICATION, {
	                'type': 'POPMSG',
	                'title': '消息',
	                'message': '活动尚未发布，不能进行取消置顶操作'
	            });
	            return;
	        }
	        var modalInstance = $modal.open({
	            templateUrl: 'partial/activity/item/down_modal.html',
	            size: 'md',
	            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
	                $scope.ok = function () {
	                    $modalInstance.close();
	                };
	                $scope.cancel = function () {
	                    $modalInstance.dismiss('cancel');
	                };
	            }]
	        });
	        modalInstance.result.then(function () {
	            $scope._to_down(activityId);
	        });
	    };*/
	    //下架
	    $scope.undercarriage = function (activity_id) {
	        $scope.confirm.message = "您确定要对该活动进行下架操作?";
	        $scope.confirm.type = "undercarriage";
	        $scope.confirm.param = activity_id;
	        $("#confirmModal").modal();
	        return;
	    };
	    //进入插件页面
	    $scope.gotoPlugin = function(activity_id, plugin_id) {
	        if (plugin_id === "") {
	            $state.go('activity_item', {
	                'id': activity_id
	            });
	        } else {
	            $state.go('activity_item.' + plugin_id + '_plugin', {
	                'id': activity_id
	            });
	        }
	    };
	});