/*globals angular*/
;(function () {
	"use strict";
	angular
		.module("app")
		.config(["$stateProvider","$urlRouterProvider", function (stateProvider, urlRouterProvider) {
			// Home
			stateProvider.state("home", {
				url: "/home",
				abstract: true,
				templateUrl: "views/home.html",
				controller: "HomeControl"
			}).
			state("home.tab1", {
				url: "/tab1",
				templateUrl: "views/home.tab1.html",
				controller: "HomeTab1Control"
			}).
			state("home.tab2", {
				url: "/tab2",
				templateUrl: "views/home.tab2.html"
			});

			// Publish
			stateProvider.state("publish", {
				url: "/publish",
				templateUrl: "views/publish.html",
				controller: "PublishControl"
			});

			// Detail
			stateProvider.state("detail", {
				url: "/detail",
				templateUrl: "views/detail.html"
			});
			urlRouterProvider.otherwise("/home/tab1");
		}]);
})();
