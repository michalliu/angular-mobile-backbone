/*globals angular,console*/
;(function () {
	angular
		.module("app")
		.controller("Index", ["$scope", "$ionicModal", index]);

	function index(scope, modal) {
		scope.operations = [
				{label: '写愿望', id: 'addwish'},
				{label: '愿望列表', id: 'wishlist'},
				{label: '联系人列表', id: 'sessionlist'},
				{label: '我的主页', id: 'profile'}
		];
		scope.leftButtonLabel="未找到";
		scope.rightButtonLabel="未登录";

		modal.fromTemplateUrl('views/login_modal.html', {
			animation: "slide-in-up",
			scope: scope // let modal knows scope
		}).then(function (instance) {
			scope.loginModal = instance;
		});

		scope.showLoginModal = function () {
			scope.loginModal.show();
		};

		scope.formdata = {}; //
		scope.register = function () {
			// TODO: send register request
			console.log("nickName -> " + scope.formdata.nickName);
		};

		//Cleanup the modal when we're done with it!
		scope.$on('$destroy', function() {
			scope.loginModal.remove();
			console.log("loginModal destory");
		});

		scope.$on('modal.hidden', function() {
			console.log("loginModal hidden");
		});

		scope.$on('modal.shown', function() {
			console.log("loginModal shown");
		});

		scope.$on('modal.removed', function() {
			console.log("loginModal removed");
		});
	}
})();
