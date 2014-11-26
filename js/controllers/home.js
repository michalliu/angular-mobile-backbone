/*globals angular*/
;(function () {
	angular
		.module("app")
		.controller("HomeControl", ["$scope", "$ionicModal", "pageService", home])
		.controller("HomeTab1Control", ["$scope", "$ionicModal", "$ionicLoading", "pageService", homeTab1]);

	function home(scope, modal, page) {
		scope.goPublish = function goPublish() {
			page.navigation.redirect("/publish");
		};
	}

	function homeTab1(scope, modal, loading, page) {
		var attachInfo=""; // 翻页信息位
		scope.items = [];
		scope.moredata = false;
		scope.loadMoreData = function () {
			page.api.getWishList(221,attachInfo).success(function (res) {
				if (res && res.code === 0) {
					attachInfo = res.data.attachinfo;
					scope.items=scope.items.concat(res.data.wishlist);
					if (scope.items.length > 100) {
						scope.moredata = true; // 不再加载更多
					}
					scope.$broadcast('scroll.infiniteScrollComplete');
				} else {
					page.dialog.alert("数据加载失败" + res.message);
				}
			}).error(function () {
				page.dialog.alert("数据加载失败");
			});
		};
	}
})();
