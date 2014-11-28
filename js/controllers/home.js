/*globals angular,$*/
;(function () {
	angular
		.module("app")
		.controller("HomeControl", ["$scope", "$ionicModal", "pageService", home])
		.controller("HomeTab1Control", ["$scope", "$ionicModal", "$ionicLoading", "pageService",
			"utilService","$timeout", homeTab1]);

	function concat(a1, a2) {
		for (var i=0,l=a2.length,one;i<l;i++) {
			one = a2[i];
			a1.push(one);
		}
		return a1;
	}

	function home(scope, modal, page) {
		scope.goPublish = function goPublish() {
			page.navigation.redirect("/publish");
		};
		$(".tab-item").removeClass("x-tab-activated");
		$("#homeTab1").addClass("x-tab-activated");
	}

	function processWish(data, util) {
		var ret = {};
		ret.logo = data.logo;
		ret.location = data.location;
		ret.location_addr = data.location_addr;
		ret.id = data.wid;
		ret.timedesc = util.dateTime.getTimeDesc(data.endtime);
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

	function homeTab1(scope, modal, loading, page, util, timeout) {
		var attachInfo=""; // 翻页信息位
		scope.items = [];
		scope.moredata = false;
		scope.loadMoreData = function () {
			// 初始化时执行的东西不要太多，可以有效避免卡顿
			timeout(angular.noop,500).then(function () {
				page.api.getWishList(221,attachInfo).success(function (res) {
					var wishList;
					if (res && res.code === 0 && res.data) {
						attachInfo = res.data.attachinfo;
						wishList = res.data.wishlist;
						if (wishList) {
							scope.items=concat(scope.items, processWishList(wishList, util));
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
				});
			});
		};
		// 进入详情页
		scope.goWishDetail = function (item) {
			page.navigation.redirect("/detail", {id: item.id});
		};
	}
})();
