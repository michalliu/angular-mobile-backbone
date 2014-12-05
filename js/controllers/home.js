/*globals angular,$*/
;(function () {
	angular
		.module("app")
		.controller("HomeControl", ["$scope", "$ionicModal", "pageService", "movieDataService","$timeout","utilService", home])
		.controller("HomeTab1Control", ["$scope", "$ionicModal", "$ionicLoading", "pageService",
			"utilService","$timeout", "movieDataService", homeTab1]);

	function concat(a1, a2) {
		for (var i=0,l=a2.length,one;i<l;i++) {
			one = a2[i];
			a1.push(one);
		}
		return a1;
	}

	function openProfileModal(modal, scope) {
		modal.fromTemplateUrl("views/profile.modal.html", {
			scope: scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			scope.modal = modal;
		}).then(function () {
			scope.modal.show();
		});
		// unregister event "$destroy" listeners
		scope.$$listeners.$destroy = [];
	}

	function home(scope, modal, page, movieData, timeout, util) {
		scope.goPublish = function goPublish() {
			page.navigation.redirect("/publish");
		};
		$(".tab-item").removeClass("x-tab-activated");
		$("#homeTab1").addClass("x-tab-activated");

		var profile = page.data.profile;
		var phone_number = profile.phone_number;
		var city_id = profile.city_id;

		// 说明未登录
		if (!profile.sid) return;

		// 完善资料
		if (!phone_number || !city_id || !util.isPhoneNumberValid(phone_number)) {
			openProfileModal(modal, scope);
		}
		scope.profileData = {
			city: util.findCityById(movieData.hotCityList,city_id) || movieData.hotCityList[0],
			phoneNumber: profile.phone_number || ""
		};
		scope.openSettingModal = function () {
			openProfileModal(modal, scope);
		};
		scope.cityList = movieData.hotCityList;
		scope.fillProfile = function () {
			timeout(function () {
				if (!util.isPhoneNumberValid(scope.profileData.phoneNumber)){
					page.dialog.alert("手机号码输入不正确噢");
					return;
				}
				page.dialog.loading.show("资料提交中...");
				page.api.setProfile({
					phone_number: scope.profileData.phoneNumber,
					city_id: scope.profileData.city.id
				}).
					success(function updateSuccess(response) {
						if (response && response.code === 0) {
							page.dialog.loading.show("设置成功了");
							timeout(function () {
								page.dialog.loading.hide();
								onPublishSuccess();
							},500);
						} else {
							page.dialog.loading.hide();
							timeout(function () {
								page.dialog.alert(response.message);
							},0);
						}
					}).error(function publishError() {
							page.dialog.loading.hide();
							timeout(function () {
								page.dialog.alert("提交失败");
							},0);
					});
			},500);
		};

		function onPublishSuccess() {
			scope.modal.hide();
			profile.phone_number=scope.profileData.phoneNumber;
			profile.city_id=scope.profileData.city.id;
			timeout(function () {
				$(".setting-button").first().remove(); // 实在搞不懂为什么这里会出现两个设置按钮，只好强制移除一个，估计是ionic的bug
				page.navigation.reloadState();
			},200);
		}
	}

	function processWish(data, util) {
		var ret = {};
		ret.logo = data.logo;
		ret.location = data.location;
		ret.location_addr = data.location_addr;
		ret.id = data.wid;
		ret.timedesc = data.nickname + " " + util.dateTime.getTimeDesc(data.endtime);
		if (data.needgender === 2) {
			ret.wantGender = "仅限女生报名";
		} else if(data.needgender === 1) {
			ret.wantGender = "仅限男生应征，非诚勿扰";
		} else {
			ret.wantGender = "无要求，开心就好";
		}
		if (data.type === 1) {
			ret.typeDesc="发贴人主动请客";
		} else if(data.type === 2) {
			ret.typeDesc="应征者请客";
		} else {
			ret.typeDesc="大家AA吧";
		}
		return ret;
	}

	function processWishList(list, util) {
		var newList = []; // 简单的list，去除不必要的信息
		for (var i=0,l=list.length,one;i<l;i++) {
			one=list[i];
			newList.push(processWish(one, util));
		}
		return newList;
	}

	function homeTab1(scope, modal, loading, page, util, timeout, movieData) {
		var profile = page.data.profile;
		var phone_number = profile.phone_number;
		var city_id = profile.city_id;
		// 资料不完善不拉数据
		if (!phone_number || !city_id || !util.isPhoneNumberValid(phone_number)) {
			return;
		}
		var attachInfo=""; // 翻页信息位
		scope.items = [];
		scope.moredata = false;
		scope.city = util.findCityById(movieData.hotCityList,city_id);
		scope.loadMoreData = function () {
			// 初始化时执行的东西不要太多，可以有效避免卡顿
			timeout(angular.noop,500).then(function () {
				page.api.getWishList(city_id,attachInfo).success(function (res) {
					var wishList;
					if (res && res.code === 0 && res.data) {
						attachInfo = res.data.attachinfo;
						wishList = res.data.wishlist;
						if (wishList && wishList.length > 0) {
							scope.items=concat(scope.items, processWishList(wishList, util));
						} else {
							//page.dialog.toast("没有更多数据了");
						}
						if (scope.items.length > 100 || res.data.hasmore === 0) { // 最多100条最新数据
							scope.moredata = true; // 不再加载更多
						}
						scope.$broadcast('scroll.infiniteScrollComplete');
					} else {
						page.dialog.alert("数据加载失败，" + res.message);
					}
				}).error(function () {
					page.dialog.alert("数据加载失败");
				}).always(function () {
					$(".x-init-hide").removeClass("x-init-hide");
				});
			});
		};
		// 进入详情页
		scope.goWishDetail = function (item) {
			page.navigation.redirect("/detail", {id: item.id});
		};
	}
})();
