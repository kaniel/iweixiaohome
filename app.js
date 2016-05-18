angular.module('iwx', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'ngTable', 'angular-loading-bar', 'monospaced.qrcode', 'chart.js', 'treeControl']);

angular.module('iwx').constant('eventType', {
    LOGIN: 'login',
    LOGOUT: 'logout',
    NOTIFICATION: 'notification'
});

angular.module('iwx').constant('notificationType', {
    INFO: {
        name: "INFO",
        timeout: 3000, // in 3 seconds
        class: "info",
        closable: false
    },
    LONG_INFO: {
        name: "LONG_INFO",
        timeout: -1,
        class: "info",
        closable: true
    },
    ERROR: {
        name: "ERROR",
        timeout: 10000, // in 10 seconds
        class: "error",
        closable: true
    },
    POPMSG: {
        name: "POPMSG",
        timeout: 10000,
        class: "info",
        closable: true
    },
});

angular.module('iwx').config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
}]);

angular.module('iwx').config(
    function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        //$locationProvider.html5Mode(true);
        $stateProvider.state('welcome', {
            url: '/',
            templateUrl: 'partial/welcome/welcome.html'
        });
        $stateProvider.state('certificate', {
            url: '/certificate',
            templateUrl: 'partial/certificate/certificate.html'
        });
        $stateProvider.state('certificate_coupons', {
            url: '/certificate/coupons',
            templateUrl: 'partial/certificate/coupons/certificate_coupons.html'
        });
        $stateProvider.state('certificate_coupons_details', {
            url: '/certificate/coupons/:id/details',
            templateUrl: 'partial/certificate/coupons/certificate_coupons_details.html'
        });
        $stateProvider.state('certificate_coupons_item', {
            url: '/certificate/coupons/:id',
            templateUrl: 'partial/certificate/coupons/certificate_coupons_item.html'
        });
        $stateProvider.state('profile', {
            url: '/profile',
            templateUrl: 'partial/profile/profile.html'
        });
        $stateProvider.state('profile.change_password', {
            url: '/change_password',
            templateUrl: 'partial/profile/change_password.html'
        });
        $stateProvider.state('community', {
            url: '/community',
            templateUrl: 'partial/community/community.html'
        });
        $stateProvider.state('community.members', {
            url: '/community/members',
            templateUrl: 'partial/community/community_members.html'
        });
        //已审核的成员
        $stateProvider.state('community.approved', {
            url: '/community/members/approved',
            templateUrl: 'partial/community/community_members_approved.html'
        });
        //待审核的成员
        $stateProvider.state('community.pending', {
            url: '/community/members/pending',
            templateUrl: 'partial/community/community_members_pending.html'
        });
        $stateProvider.state('community.register', {
            url: '/community/register',
            templateUrl: 'partial/community/community_register.html'
        });
        $stateProvider.state('community.member', {
            url: '/community/member/:id',
            templateUrl: 'partial/community/community_member.html'
        });
        //换届管理
        $stateProvider.state('community.election', {
            url: '/community/election/:id',
            templateUrl: 'partial/community/community_election.html'
        });
        $stateProvider.state('activity', {
            url: '/activity',
            templateUrl: 'partial/activity/activity.html'
        });
        //i微校管理员-活动管理
        $stateProvider.state('activity_iWX', {
            url: '/activity_iWX',
            templateUrl: 'partial/activity/activity_iWX.html'
        });
        $stateProvider.state('activity_iWX.create_activity', {
            url: '/create',
            templateUrl: 'partial/activity/activity_iWX_create.html'
        });
        //i微校管理员-社团管理
        $stateProvider.state('community_iWX', {
            url: '/community_iWX',
            templateUrl: 'partial/community/community_iWX/community_iWX.html'
        });
        $stateProvider.state('community_iWX.pending', {
            url: '/pending',
            templateUrl: 'partial/community/community_iWX/community_iWX_pending.html'
        });
        //换届状态
        $stateProvider.state('community_iWX.shift', {
            url: '/shift',
            templateUrl: 'partial/community/community_iWX/community_iWX_shift.html'
        });
        //新建社团
        $stateProvider.state('community_iWX.register_community', {
            url: '/register_community',
            templateUrl: 'partial/community/community_iWX/community_iWX_register_community.html'
        });
        //新建管理员
        $stateProvider.state('community_iWX.create_manager', {
            url: '/create_manager',
            templateUrl: 'partial/community/community_iWX/community_iWX_create_manager.html'
        });
        //管理员列表
        $stateProvider.state('community_iWX.manager_list', {
            url: '/manager_list',
            templateUrl: 'partial/community/community_iWX/community_iWX_manager_list.html'
        });
        //i微校管理员-电子凭证管理
        $stateProvider.state('certificate_coupons_iWX', {
            url: '/certificate_coupons_iWX',
            templateUrl: 'partial/certificate/coupons/coupons_iWX/certificate_coupons_iWX.html'
        });
        $stateProvider.state('certificate_coupons_iWX.create', {
            url: '/create',
            templateUrl: 'partial/certificate/coupons/coupons_iWX/certificate_coupons_iWX_create.html'
        });
        $stateProvider.state('certificate_coupons_iWX.coupons_detail', {
            url: '/coupons_detail/:id',
            templateUrl: 'partial/certificate/coupons/coupons_iWX/certificate_coupons_detail_iWX.html'
        });
        //i微校管理员-信息管理
        $stateProvider.state('message_iWX', {
            url: '/message_iWX',
            templateUrl: 'partial/message/message_iWX/message_iWX.html'
        });
        $stateProvider.state('message_iWX.create_letters', {
            url: '/create_letters',
            templateUrl: 'partial/message/message_iWX/message_iWX_letters.html'
        });
        $stateProvider.state('message_iWX.message_iWX_to_community', {
            url: '/message_iWX_to_community/:id',
            templateUrl: 'partial/message/message_iWX/message_iWX_to_community.html'
        });
        //i微校管理员-账户管理
        $stateProvider.state('profile_iwx', {
            url: '/profile_iwx',
            templateUrl: 'partial/profile/profile_iwx/profile_iwx.html'
        });
        $stateProvider.state('profile_iwx.change_password', {
            url: '/change_password_iwx',
            templateUrl: 'partial/profile/profile_iwx/change_password_iwx.html'
        });
        //校级管理员相关路由
        //校级管理员-活动管理
        $stateProvider.state('activity_university', {
            url: '/activity_university',
            templateUrl: 'partial/activity/activity_university/activity_university.html'
        });
        $stateProvider.state('activity_university.create_activity', {
            url: '/create_activity',
            templateUrl: 'partial/activity/activity_university/activity_university_create.html'
        });
        //校级管理员-电子凭证管理
        $stateProvider.state('certificate_coupons_university', {
            url: '/certificate_coupons_university',
            templateUrl: 'partial/certificate/coupons/coupons_university/certificate_university.html'
        });
        $stateProvider.state('certificate_coupons_university.create', {
            url: '/create_coupon',
            templateUrl: 'partial/certificate/coupons/coupons_university/certificate_university_create.html'
        });
        $stateProvider.state('certificate_coupons_university.details', {
            url: '/details_coupon/:id',
            templateUrl: 'partial/certificate/coupons/coupons_university/certificate_university_detail.html'
        });
        //校级管理员-社团管理
        $stateProvider.state('community_university', {
            url: '/community_university',
            templateUrl: 'partial/community/community_university/community_university.html'
        });
        $stateProvider.state('community_university.pending', {
            url: '/pending',
            templateUrl: 'partial/community/community_university/community_university_pending.html'
        });
        $stateProvider.state('community_university.election', {
            url: '/election',
            templateUrl: 'partial/community/community_university/community_university_election.html'
        });
        //校级管理员-信息管理
        $stateProvider.state('message_university', {
            url: '/message_university',
            templateUrl: 'partial/message/message_university/message_university.html'
        });
        $stateProvider.state('message_university.create_letters', {
            url: '/create_letters',
            templateUrl: 'partial/message/message_university/message_university_letters.html'
        });
        $stateProvider.state('message_university.message_uni_to_community', {
            url: '/message_uni_to_community/:id',
            templateUrl: 'partial/message/message_university/message_university_to_community.html'
        });
        //校级管理员-账户管理
        $stateProvider.state('profile_university', {
            url: '/profile_university',
            templateUrl: 'partial/profile/profile_university/profile_university.html'
        });
        $stateProvider.state('profile_university.change_password', {
            url: '/change_password_university',
            templateUrl: 'partial/profile/profile_university/change_password_university.html'
        });
        //超级管理员相关路由
        //超级管理员-角色管理
        $stateProvider.state('role_manage_super', {
            url: '/role_manage_super',
            templateUrl: 'partial/role/super/role_manage_super.html'
        });
        $stateProvider.state('role_manage_super.user', {
            url: '/user/:manager_type',
            templateUrl: 'partial/role/super/role_manage_super_user.html'
        });
        $stateProvider.state('role_manage_super.create_user', {
            url: '/create_user',
            templateUrl: 'partial/role/super/role_manage_super_create_user.html'
        });

        $stateProvider.state('message', {
            url: '/message',
            templateUrl: 'partial/message/messages.html'
        });
        $stateProvider.state('message.members', {
            url: '/members',
            templateUrl: 'partial/message/messages_members.html'
        });
        $stateProvider.state('message.user', {
            url: '/:id',
            templateUrl: 'partial/message/message.html'
        });
        $stateProvider.state('message.userInfo', {
            url: '/:id',
            templateUrl: 'partial/message/message_member_info.html'
        });
        //添加社团管理员和管理员间通信页面路由
        $stateProvider.state('message.iwx', {
            url: '/message.iwx/:id',
            templateUrl: 'partial/message/message_admin_iwx.html'
        });
        $stateProvider.state('message.university', {
            url: '/message.university/:id',
            templateUrl: 'partial/message/message_admin_university.html'
        });
        $stateProvider.state('activity_item', {
            url: '/activity/:id',
            templateUrl: 'partial/activity/item/activity_item.html'
        });
        $stateProvider.state('activity_item.announcement_plugin', {
            url: '/plugin/announcement',
            templateUrl: 'partial/activity/plugin/announcement.html'
        });
        $stateProvider.state('activity_item.lottery_plugin', {
            url: '/plugin/lottery',
            templateUrl: 'partial/activity/plugin/lottery.html'
        });
        $stateProvider.state('activity_item.lotteryat_plugin', {
            url: '/plugin/lottery/:award_id',
            templateUrl: 'partial/activity/plugin/lotteryat.html'
        });
        $stateProvider.state('activity_item.timeline_plugin', {
            url: '/plugin/timeline',
            templateUrl: 'partial/activity/plugin/timeline.html'
        });
        $stateProvider.state('activity_item.ticket_plugin', {
            url: '/plugin/ticket',
            templateUrl: 'partial/activity/plugin/ticket.html'
        });
        $stateProvider.state('activity_item.vote_plugin', {
            url: '/plugin/vote',
            templateUrl: 'partial/activity/plugin/vote.html'
        });
       $stateProvider.state('activity_item.stat_plugin', {
            url: '/plugin/stat',
            templateUrl: 'partial/activity/plugin/stat.html'
        });
        $stateProvider.state('activity_item.votestat_plugin', {
            url: '/plugin/votestat',
            templateUrl: 'partial/activity/plugin/votestat.html'
        });
        //添加查看历史投票route
        $stateProvider.state('activity_item.history_vote_plugin', {
            url: '/plugin/history_vote',
            templateUrl: 'partial/activity/plugin/history_vote.html'
        });
        //添加查看历史候选人route
        $stateProvider.state('activity_item.history_candidate_plugin', {
            url: '/plugin/history_candidate/:vote_id',
            templateUrl: 'partial/activity/plugin/history_candidate.html'
        });
        //添加查看历史电子票route
        $stateProvider.state('activity_item.history_ticket_plugin', {
            url: '/plugin/history_ticket',
            templateUrl: 'partial/activity/plugin/history_ticket.html'
        });
        $stateProvider.state('activity_item.register_plugin', {
            url: '/plugin/register',
            template: '<h4>社团招新</h4>'
        });
        $stateProvider.state('activity_item.sign_in_plugin', {
            url: '/plugin/signin',
            templateUrl: 'partial/activity/plugin/signin.html'
        });
        $stateProvider.state('activity_item.sign_in_at_plugin', {
            url: '/plugin/signinat',
            templateUrl: 'partial/activity/plugin/signinat.html'
        });
        $stateProvider.state('register', {
            url: '/admin/register',
            templateUrl: 'partial/admin/register.html'
        });
        $stateProvider.state('login', {
            url: '/admin/login/:next',
            templateUrl: 'partial/admin/login.html'
        });
        /* Add New States Above */
        $urlRouterProvider.otherwise('/');

        $httpProvider.interceptors.push('httpinterceptor');
    });

angular.module('iwx').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});

angular.module('iwx').controller('MainCtrl', function ($rootScope, $scope, $timeout, $modal, $window, userService, eventType, notificationType) {

    var browser= {
        versions: (function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1 , //是否iPad
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信
                safari: u.match(/Safari/i) === "Safari", //是否为safari
                webApp: u.indexOf('Safari') === -1 //是否web应该程序，没有头部与底部
            };
        })()
    };
    //下载ios version
    $scope.download_ios_v = function () {
        if (!browser.versions.mobile) {
            $window.location.href = 'https://itunes.apple.com/cn/app/i-wei-xiao/id835588974?l=en&mt=8';
        } else {
            if (browser.versions.iPhone || browser.versions.iPad) {
                if (browser.versions.weixin) {
                    $scope.ios_popweixin = true;
                } else {
                    $window.location.href = 'https://itunes.apple.com/cn/app/i-wei-xiao/id835588974?l=en&mt=8';
                }
            } else {
                $window.alert('您使用的系统暂不支持，请使用苹果手机!');
            }
        }
    };
    //下载android version
    $scope.download_and_v = function () {
        if (!browser.versions.mobile) {
            $window.location.href = '/static/release/20160517/iweixiao_20160517_v2.5.apk';
        } else {
            if (browser.versions.android) {
               $window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.boringkiller.xgm'; 
            } else {
                $window.alert('您使用的系统暂不支持，请使用安卓手机!');
            }
        }
    };
    $scope.user = null;
    /*userService.load(true).then(function(user) {
        $scope.user = user;
    });*/
    var notificationPromise = null;

    $scope.notification = null;
    $scope.popmsg = null;
    $scope.logout = function() {
        userService.logout();
    };
    $scope.clearNotification = function() {
        if (notificationPromise) {
            $timeout.cancel(notificationPromise);
            notificationPromise = null;
        }
        $scope.notification = null;

        $("#notificationModal").modal('hide');
        $scope.popmsg = null;
    };
    $scope.notificationDetails = function(details) {
        $modal.open({
            template: JSON.stringify(details),
            size: "sm",
        });
    };
    $rootScope.$on(eventType.LOGIN, function(event, user) {
        console.log(user);
        $scope.user = user;
    });
    $rootScope.$on(eventType.LOGOUT, function(event, user) {
        $scope.user = null;
    });

    $rootScope.$on(eventType.NOTIFICATION, function(event, n) {
        if (!n) {
            $scope.clearNotification();
            return;
        }

        if(n.type === 'POPMSG'){
            angular.forEach(notificationType, function(type) {
                if (type.name === n.type) {
                    $scope.popmsg = {
                        message: n.message,
                        title: n.title,
                        type: type
                    };
                }
            });

            $("#notificationModal").modal();
        } else {
            angular.forEach(notificationType, function(type) {
                if (type.name === n.type) {
                    $scope.notification = {
                        message: n.message,
                        type: type
                    };
                }

                if (n.payload) {
                    $scope.notification.payload = n.payload;
                }
            });

            if ($scope.notification && $scope.notification.type.timeout > 0) {
                if (notificationPromise) {
                    $timeout.cancel(notificationPromise);
                }
                notificationPromise = $timeout(function() {
                    notificationPromise = null;
                    $scope.notification = null;
                }, $scope.notification.type.timeout);
            }
        }
    });
});