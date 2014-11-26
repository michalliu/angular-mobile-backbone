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
				alert: function (message, title, callback) {
					title = title || "";
					popup.show({
						title: title,
						template: message,
						scope: null, // Scope (optional). A scope to link to the popup content.
						buttons: [
							{
								text: '<b>确定</b>',
								type: 'button-positive',
								onTap: function (e) {
									if (callback){
										return callback(e);
									}
									return;
								}
							}
						]
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
							endtime: convertTime(data.date),
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

		function convertTime(d) {
			var t = d.getTime();
			var b = new Date();
			// toISOString 消除了时差，但是后台认为时间是带了是时差的，这里做个补偿
			// 另外结束时间是到那天的末尾，而不是开始，因此加24小时。比如选择时间是2014-01-01，结束时间应为2014-01-02
			b.setTime(t + 8 * 3600 * 1000 + 24 * 3600 * 1000);
			return b.toISOString().slice(0,-5).replace("T", " ");
		}

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
