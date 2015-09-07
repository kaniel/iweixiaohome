angular.module('iwx').directive('dSref', function($compile, $state) {
	return {
		restrict: 'A',
    scope:{
        dSref: '='/*,
        name: '='*/
    },
		link: function(scope, element) {
      /*element.html($compile('<a ui-sref="{{ dSref }}">{{name}}</a>')(scope))*/
      function update() {
        // console.log($state.current.name + '-------------' + scope.dSref);
        if ($state.current.name === scope.dSref ||
           ($state.current.name === 'community.approved' && scope.dSref === 'community.members') ||
           ($state.current.name === 'community.pending' && scope.dSref === 'community.members')) {
          element.addClass('active');
        } else {
          element.removeClass('active');
        }
      }
      scope.$on('$stateChangeSuccess', update);
      update();
    }
	};
});
