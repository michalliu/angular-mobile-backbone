/*globals angular*/
;(function () {
	"use strict";
	angular
		.module("app")
		.config(["$stateProvider","$urlRouterProvider", function (stateProvider, urlRouterProvider) {
			stateProvider.state("index", {
                url: "/index",
				templateUrl: "views/index.html"
			});
			urlRouterProvider.otherwise("/index");
		}]);
})();
