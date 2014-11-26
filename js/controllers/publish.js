/*globals angular*/
;(function () {
	angular
		.module("app")
		.controller("PublishControl", [
			"$scope",
			"$timeout",
			"pageService",
			"movieDataService",
			publish]);

	function publish(scope, timeout, page, movieData) {
		scope.wantList = [
			{"name": "限男生", "value": 1},
			{"name": "限女生", "value": 2},
			{"name": "无所谓", "value": 3}
		];
		scope.typeList = [
			{"name": "我请客", "value": 1},
			{"name": "求请客", "value": 2},
			{"name": "AA", "value": 3}
		];
		scope.formData={
			city: movieData.hotCityList[3], // 默认选择深圳
			theater: null,
			date: null,
			type: scope.typeList[0],
			want: scope.wantList[1],
			message: ""
		};
		scope.cityList = movieData.hotCityList;
		scope.$watch("formData.city", function cityChanged() {
			movieData.getTheaterListByCityId(scope.formData.city.id).
			then(function (data) {
				scope.formData.theater = data.info[0];
				scope.theaterList = data.info;
			}, function () {
				scope.theaterList = [];
				scope.formData.theater = null;
				page.dialog.alert("获取影院数据失败了");
			});
		});
		scope.publishEvent = function () {
			page.api.publishWish(scope.formData).
				success(function publishSuccess(response) {
					if (response.code === 0) {
						page.dialog.alert("发表成功");
					} else {
						page.dialog.alert("发表失败" + response.message);
					}
				}, function publishError() {
						page.dialog.alert("发表失败");
				});
			var message = scope.formData.message;
			var date = scope.formData.date;
			if (!date) {
				page.dialog.alert("还没有填写时间呢");
				return;
			}
			if (message.length <= 0) {
				page.dialog.alert("写点儿留言能提高成功率哟");
				return;
			}
		};
	}

})();
