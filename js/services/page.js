/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.factory("pageService", [
			"$location",
			"$ionicPopup",
			"$ionicLoading",
			"$window",
			"$http",
			"queryStringService",
			pageService]);

	function pageService(loc, popup, loading, win, http, qs) {

		var page;
		var doc = win.document;

		page = {
			// navigation utilities
			navigation: {
				redirect: function (url, data) {
					var path;
					if (data) {
						path=loc.search(data);
					}
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
				},
				loading: {
					show: function (message) {
						loading.show({
							template: message
						});
					},
					hide: function () {
						loading.hide();
					}
				}
			},
			data: {
				profile: getCsData("profile")
			},
			api: {
				publishWish: function (data) {
					return http.get("/wish/add_wish", {
						params: {
							sid: page.profile.sid,
							uid: page.data.profile.uid,
							score: 0,
							theme: 2, // 2为看电影
							endtime: convertTime(data.date,data.time),
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
				},
				//TODO: 选择城市
				getWishList: function (cityId, info) {
					return http.get("/wish/get_wish_list", {
						params: {
							sid: page.profile.sid,
							city_id: cityId || 221,
							attachinfo: info,
							format: "json"
						}
					});
				},
				getWishDetail: function (wid) {
					return http.get("/wish/get_wish_detail", {
						params: {
							sid: page.profile.sid,
							wid: wid,
							format: "json"
						}
					});
				},
				joinWish: function (wid) {
					return http.get("/wish/join_wish", {
						params: {
							sid: page.profile.sid,
							wid: wid,
							type: 1, // 1 报名 2 取消报名
							format: "json"
						}
					});
				}
			}
		};

		function convertTime(d,t) {
			return Math.floor(new Date(d + "T" + t + ":00" + "Z").getTime() / 1000);
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
