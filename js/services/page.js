/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.factory("pageService", ["$location", pageService]);

	function pageService(loc) {

		var page;

		page = {
			// navigation utilities
			navigation: {
				redirectTo: function (url) {
					loc.path(url);
				},
				toHome: function () {
					loc.path("/index");
				}
			}
		};

		return page;
	}
})();
