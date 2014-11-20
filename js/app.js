/* globals angular */
;(function () {
	angular
		.module("app", [
			"ionic",
			"appViewCache"
			])
		.run(["$ionicPlatform","$ionicLoading","$rootScope", "$window",
			function (ionicPlatform, ionicLoading, rootScope) {
				rootScope.$on('$stateChangeStart', function () {
					ionicLoading.show({
						template: '<i class="icon ion-loading-b"></i>'
					});
				});
				rootScope.$on("$stateChangeSuccess", function () {
					ionicLoading.hide();
				});
		}]);
})();
