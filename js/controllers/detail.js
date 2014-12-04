/*globals angular,$*/
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

	var lastWid;

	function detail(scope, loc, timeout, page, util) {
		var params = loc.search();
		var wid = params.id || lastWid;
		lastWid = wid;
		scope.wish = {};

		function handleWishData(wish) {
			scope.wish.time = util.dateTime.getTimeDesc(wish.endtime);
			scope.wish.location_addr = wish.location;
			scope.wish.message = "主人【" + wish.nickname + "】留言: " + wish.content;
			scope.wish.joinList = wish.joinlist;
			scope.wish.joinCount = wish.joinlist.length;
			scope.wish.isJoined = wish.have_joined === 1;
			scope.wish.isSelf = wish.uid === page.data.profile.uid;
			scope.wish.logo = wish.logo;
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

		function getWishDetail(){
			return page.api.getWishDetail(wid).
			success(function (response) {
				if (response &&
					response.code === 0 &&
					response.data &&
					response.data.wish) {
					// 渲染详情页
					handleWishData(response.data.wish);
					// ng-if有延迟，刷新一瞬间会先显示，再隐藏，元素会闪现一下
					$(".x-init-hide").removeClass("x-init-hide");
				} else {
					page.dialog.alert("郁闷，拉取数据失败了，" + response.message);
				}
			}).error(function publishError() {
					page.dialog.alert("郁闷，拉取数据失败了");
			});
		}

		scope.wishPromise=timeout(angular.noop,300).then(function () {
			return getWishDetail();
		});		// 报名

		// join为true表示应征，false 取消
		scope.joinWish = function (isJoin) {
			var extra = (isJoin ? "" : "取消") + "报名";

			page.dialog.loading.show(extra + "执行中...");

			page.api.joinWish(wid, isJoin).
				success(function (response) {
					if (response &&
						response.code === 0) {

						page.dialog.loading.show(extra + "成功");
						timeout(function () {
							page.dialog.loading.hide();
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
						page.dialog.alert(extra + "失败");
					},0);
				}).always(getWishDetail);
		};
	}

})();
