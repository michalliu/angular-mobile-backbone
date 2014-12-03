/*globals angular,$*/
;(function () {
	angular
		.module("app")
		.controller("FeedsControl", [
			"$scope",
			"$location",
			"$timeout",
			"pageService",
			"$ionicNavBarDelegate",
			feeds]);

	function processWish(data) {
		var ret = {};
		ret.logo = data.op_logo;
		ret.location = data.op_nickname;
		ret.location_addr = data.op_nickname;
		ret.id = data.wid;
		ret.timedesc = data.uid;
		return ret;
	}

	function processWishList(list) {
		var newList = []; // 简单的list，去除不必要的信息
		for (var i=0,l=list.length,one;i<l;i++) {
			one=list[i];
			newList.push(processWish(one));
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

	function feeds(scope, loc, timeout, page) {
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
					console.log(res);
					if (res && res.code === 0 && res.data) {
						attachInfo = res.data.attachinfo;
						wishList = res.data.wishlist;
						if (wishList) {
							scope.items=concat(scope.items, processWishList(wishList));
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
	}

})();
