/*globals angular*/
// 活动管理
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("BIdControl",["$scope",
		"page",
		"$routeParams",
		function($scope,
			page,
			$routeParams){
		var id=$routeParams.id;
		$scope.message="This is module B " + id;
		$scope.back=function(){
			page.back();
		};
	}]);
}());
