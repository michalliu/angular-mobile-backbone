/*globals angular*/
;(function () {
	"use strict";
	angular
		.module("app")
		.config(["$stateProvider","$urlRouterProvider", function (stateProvider, urlRouterProvider) {
			stateProvider.state("index", {
                url: "/index",
				templateUrl: "views/index.html",
				controller: "Index"
			});
			stateProvider.state("addwish", {
                url: "/addwish",
				templateUrl: "views/addwish.html",
				controller: "AddWish"
			});
			urlRouterProvider.otherwise("/index");
		}]);
})();
