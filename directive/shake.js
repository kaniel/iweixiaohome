angular.module('iwx').directive('shake', function($compile, $state) {
  return {
    restrict: 'A',
    scope:{
        className: '=',
        times: '='
    },
    link: function(scope, element) {
      var shake = function (className, times) {
        var count = 0,
            flag = false,
            class_attr = element.attr('class'),
            new_class = '',
            time = times || 2;
        if (flag) {
          return; 
        }
        flag = setInterval(function(){
          count++;
          new_class = count%2 ? class_attr + ' ' + className : class_attr;
          element.attr('class', new_class);

          if (count===2*time) {
            clearInterval(flag);
            element.removeClass(className);
          }
        },1000);
        window.alert(flag);
      };

      shake(scope.times, scope.className);
    }
  };
});