angular.module('iwx')
	.filter('noval', function () {
		return function (text) {
			return text === 'undefined' ? '------' : text; 
		};
	})
	.filter('substring', function () {
		return function (input) {
			return input.length >= 14 ? input.substring(0, 12) + '...' : input;
		};
	})
	.filter('format', function () {
		return function (input) {
			if (input && typeof input === 'string') {
				return input.split('-')[0];
			}
		};
	});