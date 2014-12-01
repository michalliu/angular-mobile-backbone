/* globals angular */
;(function () {
	angular
		.module("app", [
			"ionic",
			"appViewCache",
			"pasvaz.bindonce"
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
		}]).run(["utilService","$window", function (util, win) {
			var profile = util.parseJsonData("profile");
			var sid = profile.sid;
			if (!sid) {
				win.location.href = "http://ui.ptlogin2.qzone.com/cgi-bin/login?style=9&appid=1000000000&pt_ttype=1&s_url=http%3A%2F%2Fttest.m.qzone.com%2Fwish%2Flogin";
			}
		}]);
})();
