/*globals angular,$*/
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("IndexControl",["$scope","page","$timeout",function($scope,page,$timeout){

		$scope.navigate=function(path) {
			page.navigate(path);
		};

		$scope.items=[];

		$timeout(function () {
			$scope.items=new Array(60);
		}, 1000);

		var pullDownMessages=["Pull down to refresh","Release to refresh","Loading..."];
		var scrollOffset=$("#indexViewPullDown").height();
		var pullDownThreshold=30;

		$scope.pullDownMessage=pullDownMessages[0];

		$scope.myScrollOptions={
			"indexViewScroll": {
				topOffset:scrollOffset,
				onScrollMove: function () {
					if (this.y > pullDownThreshold) {
						if ($scope.pullDownMessage !== pullDownMessages[1]) {
							$scope.pullDownMessage=pullDownMessages[1];
							$scope.$apply();
						}
						this.minScrollY=0;
					}
					this.oldY=this.y;
				},
				onScrollEnd: function () {
					if (!this.scrollInit){
						$("#indexViewPullDown").css("visibility","visible");
						this.scrollInit=true;
					}
					if (this.oldY > pullDownThreshold) {
						if ($scope.pullDownMessage !== pullDownMessages[2]) {
							$scope.pullDownMessage=pullDownMessages[2];
							$scope.$apply();
						}
						var that = this;
						loadNewItem().then(function () {
							that.minScrollY=-scrollOffset;
							$scope.pullDownMessage = pullDownMessages[0];
						});
					}
					this.oldY=this.y;
				}
			}
		};

		$scope.$watch("items", iScrollRefresh, true);

		var newItemId=0;
		function loadNewItem() {
			return $timeout(function () {
				for (var i=0;i<5;i++){
					$scope.items.unshift("new item " + newItemId++);
				}
			}, 2000);
		}

		function iScrollRefresh(){
			$timeout(function () {
				if ($scope.myScroll && $scope.myScroll.indexViewScroll) {
					$scope.myScroll.indexViewScroll.refresh();
				}
			},0);
		}
	}]);
}());
