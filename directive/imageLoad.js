angular.module('iwx').directive('imageonload', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('load', function() {
        // alert('image is loaded');
      });
    }
  };
});