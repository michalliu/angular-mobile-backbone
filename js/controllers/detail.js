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
			scope.wish.nickname=wish.nickname;
			scope.wish.message =wish.content;
			scope.wish.joinList = wish.joinlist;
			scope.wish.joinCount = wish.joinlist.length;
			scope.wish.joinState = wish.join_state;
			scope.wish.isSelf = wish.uid === page.data.profile.uid;
			if (wish.photowall && wish.photowall.length > 0) {
				scope.wish.logos = wish.photowall;
			} else {
				scope.wish.logos = [wish.logo];
			}
			scope.wish.phomeNumber = wish.phone_number;
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

		// let ion-slide working with ng-repeat
		// talking
		// http://forum.ionicframework.com/t/slides-generated-with-ng-repeat-causing-issues-slide-box/394/39
		/*
		 * ray_suelzer29d
         * I know this is old, but I ran into this issue as well while using an ng-repeat on a slider.
		 * My solution was pretty simple:
         * 
         * expose $ionicSlideBoxDelegate;
         * 
         * controllersModule.controller("ViewObservationCtrl", ["$scope", "$ionicSlideBoxDelegate",
         * function ($scope, $ionicSlideBoxDelegate) {      
         * 
         *         $scope.updateSlider = function () {
         *             $ionicSlideBoxDelegate.update(); //or just return the function
         *         }
         *     });
         * ....
         * Then on my view I called the update function with ng-init:
         * 
         *  <ion-slide ng-repeat="image in observation.images.image" ng-init="updateSlider()">                  
         *          <img src="...jpg"/>                
         *   </ion-slide>
         *
         * scope.updateSlider = function() {
         * slideBox.update();
         * if (scope.wish.logos.length <= 1) {
         * $(".slider-pager").remove();
         * }
         * };
		*/

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
					timeout(function () {
						$(".detail-action-button.x-init-hide").removeClass("x-init-hide");
					},0);
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
