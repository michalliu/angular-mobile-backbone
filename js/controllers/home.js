/*globals angular,$,Image*/
;(function () {
	angular
		.module("app")
		.controller("HomeControl", ["$scope", "$ionicModal", "pageService", "movieDataService","$timeout","utilService", home])
		.controller("HomeTab1Control", ["$scope", "$ionicModal", "$ionicLoading", "pageService",
			"utilService","$timeout", "movieDataService","$ionicSlideBoxDelegate", homeTab1]);

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

	var GENDAR_LIST = [
		{"name": "男生", "value": 1},
		{"name": "女生", "value": 2},
		{"name": "保密", "value": 3}
	];

	// 空间这边 1 男 2 女 其它 未填
	function findGendarByValue(value) {
		switch(value) {
			case 0:
				return GENDAR_LIST[2];
			case 1:
				return GENDAR_LIST[0];
			case 2:
				return GENDAR_LIST[1];
			default:
				return GENDAR_LIST[2];
		}
	}

	function home(scope, modal, page, movieData, timeout, util) {
		$(".tab-item").removeClass("x-tab-activated");
		$("#homeTab1").addClass("x-tab-activated");

		var profile = page.data.profile;
		var city_id = profile.city_id;
		var nickName = profile.nickname;
		var photowall = profile.photowall;
		var photos = [{
				"id": "photo0"
			},{
				"id": "photo1"
			},{
				"id": "photo2"
			}];

		scope.genderList = GENDAR_LIST;
		scope.isLogin = page.isLogin();
		scope.profileValid=page.isProfileValid();

		if (photowall && photowall.length > 0) {
			angular.forEach(photowall, function (v, i) {
				photos[i].url = v;
			});
		}

		/*
		scope.photos = [
			{
				"id": "photo0",
				"url": "http://ttest.m.qzone.com/upload_files/7eef6cf6-9865-a609-0069-a609d068a609.jpeg"
			},
			{
				"id": "photo1",
				"url": "http://img1.gtimg.com/11/1128/112830/11283008_980x1200_850.jpg"
			},
			{
				"id": "photo2",
				"url": "http://img1.gtimg.com/11/1128/112830/11283005_980x1200_850.jpg"
			},
			{
				"id": "photo3",
				"url": "http://img1.gtimg.com/11/1128/112830/11283006_980x1200_850.jpg"
			}
		];
		*/

		scope.photos = photos; // 默认三张空白图片

		// 说明未登录
		if (!scope.isLogin){
			page.log("当前用户未登录");
			return;
		}

		// 没有登录没有 gopublish函数，相当于禁用了按钮
		scope.goPublish = function goPublish() {
			page.navigation.redirect("/publish");
		};

		scope.profileData = {
			city: util.findCityById(movieData.hotCityList,city_id) || movieData.hotCityList[0],
			phoneNumber: profile.phone_number || "",
			gender: findGendarByValue(profile.gender || profile.qz_gender || ""),
			nickName: nickName || profile.qz_nickname
		};

		// 完善资料
		if (!scope.profileValid) {
			page.log("用户资料不完整，要求补充数据");
			openProfileModal(modal, scope);
		} else {
			page.log("用户资料ok");
		}

		scope.openSettingModal = function () {
			openProfileModal(modal, scope);
		};
		scope.cityList = movieData.hotCityList;

		function getPhotoWall() {
			var ret=[];
			angular.forEach(scope.photos, function (v) {
				if (v.url) {
					ret.push(v.url);
				}
			});
			return angular.toJson(ret);
		}

		scope.fillProfile = function () {
			timeout(function () {
				if (!util.isPhoneNumberValid(scope.profileData.phoneNumber)){
					page.dialog.alert("手机号码输入不正确噢");
					return;
				}
				page.dialog.loading.show("资料提交中...");
				page.api.setProfile({
					phone_number: scope.profileData.phoneNumber,
					city_id: scope.profileData.city.id,
					nickname: scope.profileData.nickName,
					gender: scope.profileData.gender.value,
					photowall: getPhotoWall()
				}).
					success(function updateSuccess(response) {
						if (response && response.code === 0) {
							page.dialog.loading.show("资料更新成功");
							timeout(function () {
								page.dialog.loading.hide();
								onSetProfileSuccess();
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

		scope.hideProfileModal = function () {
			scope.modal.hide();
		};

		scope.removePhoto = function (photo) {
			page.dialog.confirm("确定要移除这张照片吗?", null, function () {
				photo.url = null;
			});
		};

		scope.replacePhoto = function (oldPhoto) {
			page.log("更换形象照");
			uploadNewPhoto(oldPhoto);
		};

		// 上传照片
		function uploadNewPhoto(old) {
			page.wanba.getPhonePhoto(function (data) {
				page.dialog.loading.show("正在上传形象照片...");
				page.api.uploadBase64({
					data: data
				}).success(function (res) {
					if (res && res.code === 0 && res.data) {
						page.dialog.loading.show("照片上传成功");
						timeout(function () {
							page.dialog.loading.hide();
							old.url = res.data.url;
						},500);
					} else {
						page.dialog.loading.show(res.message);
						timeout(function () {
							page.dialog.loading.hide();
						},2000); // 2 秒后错误提示消失
					}
				}).error(function () {
					page.dialog.loading.show("照片上传失败，服务器错误");
					timeout(function () {
						page.dialog.loading.hide();
					},2000); // 2 秒后错误提示消失
				});
			});
		}

		function onSetProfileSuccess() {
			scope.modal.hide();
			profile.phone_number=scope.profileData.phoneNumber;
			profile.city_id=scope.profileData.city.id;
			profile.nickname=scope.profileData.nickName;
			profile.gender=scope.profileData.gender.value;
			profile.photowall=angular.fromJson(getPhotoWall());
			timeout(function () {
				page.navigation.reloadState();
			},200);
		}

		timeout(function () {
			// 必然出现多个按钮重现路径
			// 设置-》取消-》看被动-》返回
			// 实在搞不懂为什么会这样，只好强制移除，估计是ionic的bug
			var buttons = $(".setting-button");
			for (var i=0,l=buttons.length;i<l-1;i++) {
				$(buttons[i]).parent().remove();
			}
		},300);
	}

	function processWish(data, util) {
		var ret = {};
		ret.logo = data.logo;
		ret.location = data.location;
		ret.location_addr = data.location_addr;
		ret.id = data.wid;
		ret.uid = data.uid;
		ret.timedesc = "【" + data.nickname + "】 " + util.dateTime.getTimeDesc(data.endtime);
		if (data.needgender === 2) {
			ret.wantGender = "仅限女生报名";
		} else if(data.needgender === 1) {
			ret.wantGender = "仅限男生应征，非诚勿扰";
		} else {
			ret.wantGender = "无要求，开心就好";
		}
		if (data.type === 1) {
			ret.typeDesc="发贴者请客";
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

	function homeTab1(scope, modal, loading, page, util, timeout, movieData, slideBox) {
		var profile = page.data.profile;
		var city_id = profile.city_id;

		// 资料不完善不拉数据
		if (!page.isProfileValid()) {
			scope.message="还不知道你所在的城市呢，请点右上角补充资料";
			scope.moredata = true; // 不显示loading
			$(".home-message").removeClass("x-init-hide");
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
							if (scope.items.length === 0 && angular.mainTimeReporter) {
								// 说明是首屏加载成功
								angular.mainTimeReporter.mark(2,new Date());
								angular.mainTimeReporter.report();
							}
						} else {
							//page.dialog.toast("没有更多数据了");
						}
						if (scope.items.length > 100 || res.data.hasmore === 0) { // 最多100条最新数据
							scope.moredata = true; // 不再加载更多
						}
						scope.$broadcast('scroll.infiniteScrollComplete');
					} else {
						page.dialog.alert("数据加载失败，" + res.message);
						scope.moredata = true; // 不再加载更多
					}
				}).error(function () {
					page.dialog.alert("数据加载失败");
					scope.moredata = true; // 不再加载更多
				}).always(function () {
					$(".no-wish").removeClass("x-init-hide");
				});
			});
		};
		// 进入详情页
		scope.goWishDetail = function (item) {
			page.navigation.redirect("/detail", {id: item.id});
		};

		scope.updateSlider = function() {
			slideBox.update();
			if (scope.viewimages.length <= 1) {
				$(".slider-pager").remove();
			}
		};

		// 显示头像的形象照
		scope.showPhoto = function(item){
			scope.viewimages = [];
			page.api.getProfile({
				other_uid: item.uid
			}).success(function (res) {
				if (res.code === 0 && res.data) {
					if (res.data.photowall && res.data.photowall.length > 0) {
						scope.viewimages = res.data.photowall;
					}
				}
			});
			page.dialog.photoviewer.open(scope);
		};

		scope.closePhoto = function () {
			page.dialog.photoviewer.close(scope);
		};
	}
})();
