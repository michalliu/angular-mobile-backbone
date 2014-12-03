/*globals angular*/
;(function () {
	"use strict";

	angular
		.module("app")
		.factory("pageService", [
			"$location",
			"$ionicPopup",
			"$ionicLoading",
			"$ionicModal",
			"$window",
			"$http",
			"queryStringService",
			"utilService",
			pageService]);

	function pageService(loc, popup, loading, modal, win, http, qs, util) {

		var page;

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
				},
				datepicker: {
					open: function (scope) {
						modal.fromTemplateUrl("views/datepicker.modal.html", {
							scope: scope,
							animation: 'slide-in-up'
						}).then(function (modal) {
							scope.modal = modal;
						}).then(function () {
							scope.modal.show();
						});
						// unregister event "$destroy" listeners
						scope.$$listeners.$destroy = [];
						scope.$on("$destroy", function  () {
							if (scope.modal) {
								scope.modal.remove();
								scope.modal = null;
							}
						});
					},
					close: function (scope) {
						scope.modal.hide();
					}
				},
				timepicker: {
					open: function (scope) {
						modal.fromTemplateUrl("views/timepicker.modal.html", {
							scope: scope,
							animation: 'slide-in-up'
						}).then(function (modal) {
							scope.modal = modal;
						}).then(function () {
							scope.modal.show();
						});
						// unregister event "$destroy" listeners
						scope.$$listeners.$destroy = [];
						scope.$on("$destroy", function  () {
							if (scope.modal) {
								scope.modal.remove();
								scope.modal = null;
							}
						});
					},
					close: function (scope) {
						scope.modal.hide();
					}
				}
			},
			data: {
				profile: util.parseJsonData("profile")
			},
			api: {
				publishWish: function (data) {
					return http.post("/wish/add_wish", {
						params: {
							sid: page.data.profile.sid,
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
							sid: page.data.profile.sid,
							city_id: cityId || 221,
							attachinfo: info,
							format: "json"
						}
					});
				},
				getWishDetail: function (wid) {
					return http.get("/wish/get_wish_detail", {
						params: {
							sid: page.data.profile.sid,
							wid: wid,
							format: "json"
						}
					});
				},
				joinWish: function (wid,isJoin) {
					return http.post("/wish/join_wish", {
						params: {
							sid: page.data.profile.sid,
							wid: wid,
							type: isJoin ? 1 : 2, // 1 报名 2 取消报名
							format: "json"
						}
					});
				},
				getMessageList: function(info) {
					return http.get("/wish/passive_msg_list", {
						params: {
							sid: page.data.profile.sid,
							attachinfo: info,
							format: "json"
						}
					});
				}
			}
		};

		function convertTime(d,t) {
			var temp=new Date();
			return Math.floor(new Date(d + "T" + t + ":00" + "Z").getTime() / 1000) + temp.getTimezoneOffset() * 60;
		}

		return page;
	}
})();
