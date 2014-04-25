/*globals angular*/
// 活动管理
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("BControl",["$scope",
		"page",
		function($scope,
			page){
		$scope.message="This is Module B";
		$scope.back=function(){
			page.back();
		};
	}]);
}());
