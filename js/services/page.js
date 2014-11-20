/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.factory("pageService", ["$location","$ionicPopup", pageService]);

	function pageService(loc, popup) {

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
			},
			dialog: {
				alert: function (message,title) {
					title = title || "";
					popup.alert({
						title: title,
						template: message
					});
				}
			}
		};

		return page;
	}
})();
