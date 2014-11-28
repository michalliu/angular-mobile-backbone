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
		$(".tab-item").removeClass("x-tab-activated");
		$("#homeTab2").addClass("x-tab-activated");
	}

})();
