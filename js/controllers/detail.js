/*globals angular*/
;(function () {
	angular
		.module("app")
		.controller("DetailControl", [
			"$scope",
			"$location",
			"$timeout",
			"pageService",
			"utilService",
			"$ionicNavBarDelegate",
			detail]);

	function detail(scope, loc, timeout, page, util, navbar) {
		var params = loc.search();
		var wid = params.id;
		scope.wish = {};

		function handleWishData(wish) {
			scope.wish.time = util.dateTime.getTimeDesc(wish.endtime).slice(0,-6);
			scope.wish.location_addr = wish.location;
			scope.wish.message = wish.content;
			scope.wish.joinCount = wish.joinlist.length;
			if (wish.needgender === 2) {
				scope.wish.wantGender = "女生";
			} else if(wish.needgender === 1) {
				scope.wish.wantGender = "男生";
			} else {
				scope.wish.wantGender = "无要求";
			}
			if (wish.type === 1) {
				scope.wish.typeDesc="发贴人请客";
			} else if(wish.type === 2) {
				scope.wish.typeDesc="应征者请客";
			} else {
				scope.wish.typeDesc="AA";
			}
		}

		page.api.getWishDetail(wid).
			success(function (response) {
				if (response &&
					response.code === 0 &&
					response.data &&
					response.data.wish) {
					// 渲染详情页
					handleWishData(response.data.wish);
				} else {
					page.dialog.alert("郁闷，拉取数据失败了" + response.message);
				}
			}).error(function publishError() {
					page.dialog.alert("郁闷，拉取数据失败了");
			});

		// 报名
		scope.joinWish = function () {
			page.api.joinWish(wid).
				success(function (response) {
					if (response &&
						response.code === 0) {
						// 渲染详情页
						page.dialog.alert("报名成功");
					} else {
						page.dialog.alert("报名失败" + response.message);
					}
				}).error(function publishError() {
						page.dialog.alert("报名失败");
				});
		};
	}

})();
