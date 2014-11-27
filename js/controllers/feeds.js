/*globals angular*/
;(function () {
	angular
		.module("app")
		.controller("FeedsControl", [
			"$scope",
			"$location",
			"$timeout",
			"pageService",
			"utilService",
			"$ionicNavBarDelegate",
			feeds]);

	function feeds(scope, loc, timeout, page, util, navbar) {
	}

})();
