/*globals angular,$*/
(function indexControllerInit() { "use strict";

	angular.module("appControllers").

	controller("Pullup4ResultControl",["$scope","page","$timeout",function($scope,page,$timeout){
		$scope.showNamePullup=false;
		$scope.askName=function () {
			$scope.showNamePullup=true;
		};
		$scope.closePopup=function(){
			$scope.showNamePullup=false;
		};
	}]);
}());
