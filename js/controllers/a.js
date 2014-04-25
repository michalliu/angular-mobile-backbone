/*globals angular*/
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("AControl",["$scope",
		"page",
		function($scope,
			page){
		$scope.message="This is Module A";
		$scope.back=function(){
			page.back();
		};
	}]);
}());
