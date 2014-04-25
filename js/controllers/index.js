/*globals angular*/
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("IndexControl",["$scope","page",function($scope,page){
		$scope.navigate=function(path) {
			page.navigate(path);
		};
		$scope.params=page.params;
	}]);
}());
