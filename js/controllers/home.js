/*globals angular*/
;(function () {
	angular
		.module("app")
		.controller("HomeControl", ["$scope", "$ionicModal", "pageService", home])
		.controller("HomeTab1Control", ["$scope", "$ionicModal", "pageService", homeTab1]);

	function home(scope, modal, page) {
		scope.goPublish = function goPublish() {
			page.navigation.redirect("/publish");
		};
	}

	function homeTab1(scope, modal, page) {
		scope.message="Today is" + new Date();
	}
})();
