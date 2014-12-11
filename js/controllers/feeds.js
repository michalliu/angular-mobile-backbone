/*globals angular,$*/
;(function () {
	angular
		.module("app")
		.controller("FeedsControl", [
			"$scope",
			"$location",
			"$timeout",
			"pageService",
			"utilService",
			"$ionicNavBarDelegate",
			feeds]);

	function processWish(data, util) {
		var ret = {};
		ret.id = data.wid;
		ret.opuid = data.opuid;
		ret.logo = data.op_logo;
		ret.nickname = "【" + data.op_nickname + "】";
		ret.timedesc = util.dateTime.getTimeDesc(data.createtime);
		ret.msglogo = data.op_logo;
		ret.message = data.title;
		ret.summary = data.summary;
		ret.type = data.type; // 1 通知 2 可操作
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

	function concat(a1, a2) {
		for (var i=0,l=a2.length,one;i<l;i++) {
			one = a2[i];
			a1.push(one);
		}
		return a1;
	}

	function feeds(scope, loc, timeout, page, util) {
		$(".tab-item").removeClass("x-tab-activated");
		$("#homeTab2").addClass("x-tab-activated");
		// 拉被动消息
		var attachInfo=""; // 翻页信息位
		scope.items = [];
		scope.moredata = false;
		scope.loadMoreData = function () {
			// 初始化时执行的东西不要太多，可以有效避免卡顿
			timeout(angular.noop,500).then(function () {
				page.api.getMessageList(attachInfo).success(function (res) {
					var wishList;
					if (res && res.code === 0 && res.data) {
						attachInfo = res.data.attachinfo;
						wishList = res.data.wishlist;
						if (wishList) {
							scope.items=concat(scope.items, processWishList(wishList, util));
							$("#tab2badge").addClass("x-init-hide"); // 隐藏消息角标
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
					$(".no-feeds").removeClass("x-init-hide");
				});
			});
		};

		scope.showDetail = function (item) {
			page.navigation.redirect("/detail", {id: item.id});
		};

		scope.accept = function (item) {
			page.dialog.loading.show("执行中...");

			timeout(function () {
				page.api.acceptInvite({
					other_uid: item.opuid,
					wid: item.id
				}).
					success(function publishSuccess(response) {
						if (response && response.code === 0) {
							page.dialog.loading.show("已同意对方的报名");
							timeout(function () {
								page.dialog.loading.hide();
								page.navigation.reloadState();
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
								page.dialog.alert("操作失败");
							},0);
					});
			},500);
		};

		scope.refuse = function (item) {
			page.dialog.loading.show("执行中...");

			timeout(function () {
				page.api.refuseInvite({
					other_uid: item.opuid,
					wid: item.id
				}).
					success(function publishSuccess(response) {
						if (response && response.code === 0) {
							page.dialog.loading.show("已拒绝对方的报名");
							timeout(function () {
								page.dialog.loading.hide();
								page.navigation.reloadState();
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
								page.dialog.alert("操作失败");
							},0);
					});
			},500);
		};
	}

})();
