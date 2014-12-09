/*globals angular*/
;(function () {
	angular
		.module("app")
		.controller("PublishControl", [
			"$scope",
			"$timeout",
			"pageService",
			"movieDataService",
			"$ionicNavBarDelegate",
			"utilService",
			publish]);

	function createRange(min, max, step){
		var ret=[];
		step = step || 1;
		for (var i=min;i<max;i+=step){
			if (i<10) {
				ret.push("0" + i);
			} else {
				ret.push(i);
			}
		}
		return ret;
	}

	function publish(scope, timeout, page, movieData, navbar, util) {
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
		scope.hourRange = createRange(0,24);
		scope.minuteRange = createRange(0,60,15);
		var baseTime = page.data.profile.current_time * 1000;
		var baseDate = new Date();
		var maxDate = new Date();
		var timeLimit = page.data.profile.add_wish_time_limit;
		baseDate.setTime(baseTime);
		maxDate.setTime(baseTime + timeLimit * 24 * 3600 * 1000);
		var userCityId = page.data.profile.city_id;
		scope.formData={
			city: util.findCityById(movieData.hotCityList,userCityId),
			theater: null,
			date: null,
			baseDate: baseDate,
			maxDate: maxDate,
			minDate: baseDate,
			hour: "00",
			minute: "00",
			time: null,
			type: scope.typeList[0],
			want: scope.wantList[2],
			message: ""
		};

		movieData.getTheaterListByCityId(scope.formData.city.id).
		then(function (data) {
			scope.formData.theater = data.info[0];
			scope.theaterList = data.info;
		}, function () {
			scope.theaterList = [];
			scope.formData.theater = null;
			page.dialog.alert("获取影院数据失败了");
		});
		/*scope.cityList = movieData.hotCityList;
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
		});*/
		scope.openDatePickerModal = function openDatepickerModal() {
			scope.formData.date = null;
			page.dialog.datepicker.open(scope);
		};
		scope.closeDatePickerModal = function (date) {
			if (!date) {
				page.dialog.alert("日期不能为空噢");
				return;
			}
			page.dialog.datepicker.close(scope);
			timeout(function () {
				scope.formData.time = null;
				page.dialog.timepicker.open(scope);
			},200);
		};
		scope.closeTimePickerModal = function(hour, minute){
			if (!hour || !minute) {
				page.dialog.alert("时间不能为空噢");
				return;
			}
			page.dialog.timepicker.close(scope);
			scope.formData.time = hour + ":" + minute;
			scope.formData.displayDate= hour + ":" + minute + " " + scope.formData.date;
		};
		scope.publishEvent = function () {
			var message = scope.formData.message;
			if (!scope.formData.date || !scope.formData.time) {
				page.dialog.alert("还没有填写时间呢");
				return;
			}
			if (message.length <= 0) {
				page.dialog.alert("写点儿留言能提高成功率哟");
				return;
			}

			page.dialog.loading.show("努力发表中...");

			timeout(function () {
				page.api.publishWish(scope.formData).
					success(function publishSuccess(response) {
						if (response && response.code === 0) {
							page.dialog.loading.show("恭喜，发表成功了");
							timeout(function () {
								page.dialog.loading.hide();
								onPublishSuccess();
							},500);
						} else {
							page.dialog.loading.hide();
							timeout(function () {
								page.dialog.alert(response.message);
							},0);
						}
					}).error(function publishError() {
							page.dialog.loading.hide();
							timeout(function () {
								page.dialog.alert("发表失败");
							},0);
					});
			},500);

			function onPublishSuccess() {
				timeout(function () {
					navbar.back();
				}, 300);
			}

		};
	}

})();
