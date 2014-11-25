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
				redirect: function (url) {
					loc.path(url);
				},
				toHome: function () {
					loc.path("/home");
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
