$(function () {
  // var animatedIn = [
  //   'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp',
  //   'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig',
  // ];
  // var animatedOut = [
  //   'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp',
  //   'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig',
  // ];

  var $circleEl = $('#circle');
  var loaderHide = function () {
    var $loaderEL = $('#loader');

    $loaderEL.removeClass('pageload-loading');
    window.setTimeout(function () {
      $loaderEL.removeClass('pageload-show');
    }, 300);
  };

  // 生成转盘
  var iTurntable = function (items, options) {
    if (!options) {
      options = {};
    }

    var towR = $circleEl.height();
    var circleEls;

    var generator = function (ops, callback) {
      var p = {
        x: Math.round(Math.random() * towR),
        y: Math.round(Math.random() * towR)
      };

      var _rr = towR / 10, _nis = false;
      if (ops.length !== 0) {
        for (var i = 0; i < ops.length; i++) {
          var _p = ops[i];
          var nisX = (p.x + _rr > _p.x) && (_p.x + _rr > p.x);
          var nisY = (p.y + _rr > _p.y) && (_p.y + _rr > p.y);
          if (nisX && nisY) {
            _nis = true;
            break;
          }
        }
      }

      if (_nis) {
        setTimeout(function () {generator(ops, callback);}, 0);
      } else {
        ops.push(p);
        callback(p);
      }
    };

    // 需要随机出现头像
    if (options.revolve) {
      circleEls = $circleEl.find('ul li');

      $circleEl.find('ul li.show').remove();
      var index = Math.round(Math.random() * circleEls.length);

      var _rr = towR / 10;
      var p = {
        x: _rr * 3 + Math.round(Math.random() * _rr * 2),
        y: _rr * 3 + Math.round(Math.random() * _rr * 2)
      };

      var $el = $('<li>' + circleEls.eq(index).html() + '</li>');
      $circleEl.find('ul').append($el);


      $el.css({left: p.x, top: p.y}).addClass('show bounceIn animated');
    } else {
      var circleTemplate = Handlebars.compile($('#circleTpl').html());
      $circleEl.find('.items').html(circleTemplate({items: items}));

      var ops = [];
      circleEls = $circleEl.find('ul li');
      circleEls.each(function () {
        var $el = $(this);
        generator(ops, function (_op) {
          $el.css({left: _op.x, top: _op.y});
        });
      });
    }
  };

  // 显示结果
  var prize = function (user) {
    //定义一个hashmap对照表
    var draw_type_map = {
      'SIGN': '签到号码',
      'TICKET': '电子票号码'
    };
    var doneTemplate = Handlebars.compile($('#doneTpl').html());
    $circleEl.find('.done').html(doneTemplate(user)).addClass('show');
    $circleEl.find('.done div p').css({'fontSize': $circleEl.width() * 8 / 100});
    setTimeout(function () {
      $circleEl.find('.done img').addClass('show bounceIn animated');
      $circleEl.find('.items .show').remove();
    }, 1);
    setTimeout(function () {
      $circleEl.css({overflow: 'visible'});
      var $done = $circleEl.find('.done');
      $done.find('div').hide();
      $done.find('img').animate({
        top: '-12%',
        height: '1px',
        width: '1px'
      }, 800, function () {
        $circleEl.find('.done').remove();
        var $item = $('.notice .item.null').eq(0);
        $item.find('.avatar').html('<img src="' + user.avatar + '">');
        // $item.find('span').html('No.' + user.number + ' ' + user.name);
        $item.find('span').html(user.name + ' ' + draw_type_map[user.type] + ':' + user.number);
        $item.removeClass('null');

        if ($('.notice .item.null').length > 0) {
          $circleEl.find('.btn').html('<a class="start" href="#"><span>开始</span></a>').addClass('show');
          $circleEl.find('.backdrop').addClass('show');
          $circleEl.find('.items').after('<div class="done"></div>');
        }
      });
    }, 3000);
  };

  // 渲染头
  (function () {
    $('.header .notice').css({left: ($('.header .dropdown').width() + 8) + 'px'});
    $('.warp').css({top: $('.header .notice').height() + 'px'});
  })();

  // 自适应大小
  (function () {
    var cWdith, cHeight;
    var $window = $(window);
    var _Height = ($window.width() > $window.height()) ? $window.height() : $window.width();

    cWdith = cHeight = _Height * 3 / 4;

    $circleEl.css({
      width: cWdith,
      height: cHeight
    });

    $circleEl.find('.btn').css({'fontSize': cWdith / 10});
    $circleEl.addClass('show');
  })();

  // 开始抽奖  http://localhost:9000/templates/draw.html
  $circleEl.find('.btn').on('click', '.start', function () {
    $circleEl.find('.btn').removeClass('show');
    $circleEl.find('.backdrop').removeClass('show');
    //old api
    //'/api/lotteries/' + id + '/draw_lots'
    $.ajax({
      type: 'POST',
      url: '/api/lotteries/' + id + '/draw_lots',
      headers: {
        'Authentication-Token': window.auth_token
      },
      dataType: 'json',
      success: function (data) {
        //test
        // var data = {"data": {"number": 3, "type": "TICKET", "user": {"admission_date": "2010-08-18", "email": "", "icon": "/images/user/56/icon/e79f4634-d777-11e4-8ac7-00163e002e66.jpg", "id": 56, "major": "\u767b\u673a\u53e3", "name": "\u738b\u5fd7\u6587", "nickname": "\u56fd\u753b\u5bb6", "phone": "18601251927", "roles": [{"description": "normal user", "name": "USER"}], "sex": "MALE", "university": {"city": "\u5317\u4eac\u5e02", "id": 1, "name": "\u4e2d\u592e\u6c11\u65cf\u5927\u5b66", "province": "\u5317\u4eac\u5e02"}}}, "status": "success"};
        // var data = {"code": 4, "message": "\u4e2d\u5956\u4eba\u6570\u5df2\u8fbe\u5230\u6700\u5927\u503c", "status": "error"};
        if (!data.data) {
          $circleEl.find('.btn').html('<a class="start" href="#"><span><font size="5">'+data.message+'</font></span></a>').addClass('show');
          $circleEl.find('.backdrop').addClass('show');
          return;
        }
        window._user = data.data;
      }
    });

    var _revolve = function () {
      iTurntable(window.items, {
        revolve: true
      });
      window.revolve = setTimeout(function () {
        _revolve();
      }, 200);
    };
    _revolve();

    setTimeout(function () {
      $circleEl.find('.btn').html('<a class="stop" href="#"><span>停止</span></a>').addClass('show');
    }, 3000);
    return false;
  });

  // 停止抽奖
  $circleEl.find('.btn').on('click', '.stop', function () {
    clearTimeout(window.revolve);
    $circleEl.find('.btn').removeClass('show');
    $circleEl.find('.backdrop').addClass('show');

    prize({
      number: window._user.number,
      type: window._user.type,
      name: window._user.user.nickname,
      avatar: window._user.user.icon
    });
    return false;
  });

  var id = parseInt(window.location.href.substr(window.location.href.indexOf('#') + 1), 10);
  
  //'/api/lotteries/' + id + '/draw_lots_users'
  $.get('/api/lotteries/' + id + '/draw_lots_users', function (data) {
    window.items = [];
    for (var i = 0; i < data.data.length; i++) {
      var u = data.data[i].user;
      if (u) {
        window.items.push({
          number: u.id,
          name: u.nickname,
          avatar: u.icon
        });
      }
    }

    iTurntable(window.items);
  }, 'json');

  $.getJSON('/api/auth/refreshtoken', function (data) {
    window.auth_token = data.data.auth_token;
    //'/api/lotteries/' + id
    $.ajax({
      type: 'GET',
      url: '/api/lotteries/' + id,
      headers: {
        'Authentication-Token': data.data.auth_token
      },
      dataType: 'json',
      success: function (data) {
        $('#lotterieName').text(data.data.name);

        (function () {
          var h = '';
          for (var i = 0; i < data.data.total; i++) {
            h = h + '<div class="item null"><div class="avatar"></div><span></span></div>';
          }
          $('#lotterieNotice').html(h);
        })();

        // 渲染头
        (function () {
          $('.header .notice').css({left: ($('.header .dropdown').width() + 8) + 'px'});
          $('.warp').css({top: $('.header .notice').height() + 'px'});
        })();

        loaderHide();
      }
    });
  });
});
