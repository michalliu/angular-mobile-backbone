/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.controller("AddWish", ["$scope","pageService", addWish]);

	function addWish(scope, page) {
		scope.back = function () {
			page.navigation.toHome();
		};
	}
})();
