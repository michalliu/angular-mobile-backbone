/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.factory("pageService", [
			"$location",
			"$ionicPopup",
			"$window",
			"$http",
			"queryStringService",
			pageService]);

	function pageService(loc, popup, win, http, qs) {

		var page;
		var doc = win.document;

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
			},
			data: {
				profile: getCsData("profile"),
				query: qs.decode(doc.location.search.slice(1))
			},
			api: {
				publishWish: function (data) {
					return http.get("/wish/add_wish", {
						params: {
							sid: page.data.query.sid,
							uid: page.data.profile.uid,
							score: 0,
							theme: 2, // 2为看电影
							endtime: data.date.toISOString().slice(0,-5).replace("T", " "),
							type: data.type.value,
							city_id: data.city.id,
							location_id: data.theater.id,
							location: data.theater.name,
							location_addr: data.theater.addr,
							content: data.message,
							needgender: data.want.value,
							format: "json"
						}
					});
				}
			}
		};

		function getCsData(id) {
			var el = angular.element(doc.getElementById(id));
			var text = el && el.text();
			if (text) {
				try{
					return angular.fromJson(text);
				} catch(ex) {return null;}
			}
			return null;
		}

		return page;
	}
})();
