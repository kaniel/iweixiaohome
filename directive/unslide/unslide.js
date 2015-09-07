angular.module('iwx')
	.directive('unslide', function ($compile) {
		return {
			restrict: 'AE',
			scope: {

			},
			templateUrl: 'directive/unslide/unslide.html',
			link: function ($scope, element, attrs) {
				var swiper = $('.swiper-container').swiper({
		        pagination: '.swiper-pagination',
		        direction: 'vertical',
		        slidesPerView: 1,
		        paginationClickable: true,
		        spaceBetween: 30,
		        mousewheelControl: true,
		        height: 955
		    });
			}
		};
	});