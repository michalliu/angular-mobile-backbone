/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.controller("MenuOne", ["$scope","pageService", MenuOne]);

	function MenuOne(scope, page) {
		scope.back = function () {
			page.navigation.toHome();
		};
	}
})();
