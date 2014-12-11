/*globals TCISD,angular,window*/
(function () {
	"use strict";
	// 测速上报
	var mainTimeReporter= TCISD.createTimeStat("main", [7820, 121, 1]);
	var zero;
	if (window.performance){
		zero=new Date(window.performance.timing.navigationStart);
		mainTimeReporter.setZero(zero); // 基准点
		// 1代表资源加载完毕 m.isd.com QZone->微group->管理端
		mainTimeReporter.mark(1,new Date());
		angular.mainTimeReporter=mainTimeReporter;
	}
	mainTimeReporter.report();
}());
