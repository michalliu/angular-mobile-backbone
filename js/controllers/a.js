/*globals angular*/
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("AControl",["$scope",
		"page",
		function($scope,
			page){
		$scope.message="This is the start point of your awesome app";
		$scope.back=function(){
			page.back();
		};
	}]);
}());
