/*globals angular*/
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("IndexControl",["$scope","page","$timeout",function($scope,page,$timeout){
		$scope.navigate=function(path) {
			page.navigate(path);
		};
		$scope.items=[];

		$timeout(function () {
			$scope.items=new Array(40);
		}, 1000);

		$scope.$watch("items", iScrollRefresh);

		function iScrollRefresh(){
			$timeout(function () {
				$scope.myScroll.pageViewScroll.refresh();
			},0);
		}
	}]);
}());
