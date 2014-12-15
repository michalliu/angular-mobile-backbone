/*globals angular,QZAppExternal*/
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
			"$state",
			"$timeout",
			pageService]);

	function pageService(loc, popup, loading, modal, win, http, qs, util, state, timeout) {

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
				},
				reloadState: function () {
					state.go(state.current, {}, {reload: true});
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
				confirm: function (message, title, ok) {
					title = title || "";
					popup.show({
						title: title,
						template: message,
						scope: null, // Scope (optional). A scope to link to the popup content.
						buttons: [
							{ text: '取消' },
							{
								text: '<b>确定</b>',
								type: 'button-positive',
								onTap: function (e) {
									if (ok){
										return ok(e);
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
				toast: function (message, t) {
					message = message || "";
					t = t || 1000;
					page.dialog.loading.show(message);
					timeout(function () {
						page.dialog.loading.hide();
					},t);
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
				profile: util.parseJsonData("profile"),
				query: qs.decode(doc.location.search.slice(1))
			},
			isLogin: function () {
				var profile = util.parseJsonData("profile");
				var query = page.data.query;
				// 登录信息可能已过期
				if (profile && profile.ret !== 0) {
					return false;
				}
				if (profile && profile.sid) {
					return true;
				}
				if (query && query.openkey && query.openid) {
					return true;
				}
				return false;
			},
			isProfileValid: function() {
				var profile = page.data.profile;
				var phone_number = profile.phone_number;
				var city_id = profile.city_id;
				var nickName = profile.nickname;
				var gender = profile.gender;
				return phone_number && city_id && util.isPhoneNumberValid(phone_number) && nickName && !isNaN(parseInt(gender,10));
			},
			api: {
				publishWish: function (data) {
					return http.post("/wish/add_wish", {
						params: angular.extend(angular.copy(page.api.$com_params),{
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
						})
					});
				},
				getWishList: function (cityId, info) {
					return http.get("/wish/get_wish_list", {
						params: angular.extend(angular.copy(page.api.$com_params),{
							city_id: page.data.profile.city_id,
							attachinfo: info,
							format: "json"
						})
					});
				},
				getWishDetail: function (wid) {
					return http.get("/wish/get_wish_detail", {
						params: angular.extend(angular.copy(page.api.$com_params),{
							wid: wid,
							format: "json"
						})
					});
				},
				joinWish: function (wid,isJoin) {
					return http.post("/wish/join_wish", {
						params: angular.extend(angular.copy(page.api.$com_params),{
							sid: page.data.profile.sid,
							wid: wid,
							type: isJoin ? 1 : 2, // 1 报名 2 取消报名
							format: "json"
						})
					});
				},
				getMessageList: function(info) {
					return http.get("/wish/passive_msg_list", {
						params: angular.extend(angular.copy(page.api.$com_params),{
							attachinfo: info,
							format: "json"
						})
					});
				},
				setProfile: function (map) {
					return http.post("/wish/set_profile", {
						params: angular.extend(angular.copy(page.api.$com_params), map)
					});
				},
				acceptInvite: function(map) {
					return http.post("/wish/accept", {
						params: angular.extend(angular.copy(page.api.$com_params), map)
					});
				},
				refuseInvite: function (map) {
					return http.post("/wish/refuse", {
						params: angular.extend(angular.copy(page.api.$com_params), map)
					});
				},
				uploadBase64: function(data) {
					return http.post("/wish/upload", {
						params: angular.extend(angular.copy(page.api.$com_params), data)
					});
				}
			},
			wanba: {
				getQzPhoto: function () {
					// 这个接口有点儿问题
					// 回调不一定回来
					// 调用系统相册靠谱一些
					QZAppExternal.call({
						key:'custom_image',
						type:'qzonephoto',
						params:{
							width: 800,
							type:'base64'
						}
					});
				},
				getPhonePhoto: function (fn) {
					if (page.wanba.$getPhonePhotoCallback) {
						doc.removeEventListener('WEBAPP_DATA', page.wanba.$getPhonePhotoCallback);
					}
					page.wanba.$getPhonePhotoCallback = function (evt) {
						fn(evt);
					};
					doc.addEventListener('WEBAPP_DATA', page.wanba.$getPhonePhotoCallback);
					QZAppExternal.call({
						key:'custom_image',
						type:'album',
						params:{
							width: 800,
							limit: 1 // 一次传一张
						}
					});
				}
			},
			log: function (str) {
				if (win.console && win.console.log) {
					win.console.log(str);
				}
			}
		};
		page.api.$com_params = {
			sid: page.data.profile.sid,
			openid: page.data.query.openid,
			openkey: page.data.query.openkey,
			format: "json"
		};

		function convertTime(d,t) {
			var temp=new Date();
			return Math.floor(new Date(d + "T" + t + ":00" + "Z").getTime() / 1000) + temp.getTimezoneOffset() * 60;
		}

		return page;
	}
})();
