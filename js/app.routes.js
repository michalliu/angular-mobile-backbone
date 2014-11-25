/*globals angular*/
;(function () {
	"use strict";
	angular
		.module("app")
		.config(["$stateProvider","$urlRouterProvider", function (stateProvider, urlRouterProvider) {
			stateProvider.state("home", {
                url: "/",
				templateUrl: "views/home.html"
			});
			stateProvider.state("detail", {
                url: "/",
				templateUrl: "views/detail.html"
			});
			urlRouterProvider.otherwise("/");
		}]);
})();
