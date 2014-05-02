/*globals angular,$*/
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("IndexControl",["$scope","page","$timeout",function($scope,page,$timeout){
		$scope.navigate=function(path) {
			page.navigate(path);
		};

		var refreshScrollThreshold=100; // trigger the refresh action only if the scroll bigger than this value
		var refreshTips=["Pull to refresh","Release to refresh","Loading..."];

		$scope.items=[];

		$scope.refreshTip=refreshTips[0];

		$scope.myScrollOptions={
			"indexViewScroll":{
				onScrollMove: function (){
					if(this.y > refreshScrollThreshold) {
						if ($scope.refreshTip !== refreshTips[1]){
							$scope.refreshTip=refreshTips[1];
							$scope.$apply();
						}
					}
					this.lastY=this.y;
				},
				onTouchEnd: function() {
					if (this.lastY > refreshScrollThreshold) {
						$("#indexViewScroller").css("top","48px"); // let "pull to refresh" visible
					}
				},
				onScrollEnd: function () {
					if (this.lastY > refreshScrollThreshold) {
						if ($scope.refreshTip !== refreshTips[2]){
							$scope.refreshTip=refreshTips[2];
							$scope.$apply();
						}
						loadNewItem().then(function () {
							$("#indexViewScroller").animate({
								top: 0
							}, 200, "ease", function () {
								if ($scope.refreshTip !== refreshTips[0]){
									$scope.refreshTip=refreshTips[0];
									$scope.$apply();
								}
							}); // let "pull to refresh" invisible
						});
					}
					this.lastY=this.y; // this.y should be 0 here
				}
			}
		};

		$timeout(function () {
			$scope.items=new Array(60);
		}, 1000);

		$scope.$watch("items", iScrollRefresh, true);

		function iScrollRefresh(){
			$timeout(function () {
				if ($scope.myScroll && $scope.myScroll.indexViewScroll) {
					$scope.myScroll.indexViewScroll.refresh();
				}
			},0);
		}

		var newItemId=0;
		function loadNewItem() {
			return $timeout(function () {
				for (var i=0;i<10;i++){
					$scope.items.unshift("new item " + newItemId++);
				}
			},2000);
		}
	}]);
}());
