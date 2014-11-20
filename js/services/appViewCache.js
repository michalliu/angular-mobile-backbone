angular.module('appViewCache', ['views/index.html', 'views/login_modal.html', 'views/menu_one.html']);

angular.module("views/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/index.html",
    "<ion-header-bar class=\"bar-positive\">\n" +
    "<button class=\"button button-clear\">{{leftButtonLabel}}</button>\n" +
    "  <h1 class=\"title\">Title</h1>\n" +
    "  <button class=\"button button-clear\" ng-click=\"showLoginModal()\">{{rightButtonLabel}}</button>\n" +
    "</ion-header-bar>\n" +
    "<ion-content has-bouncing=\"true\" class=\"padding\">\n" +
    "  <ion-list>\n" +
    "  <ion-item ng-repeat=\"operation in operations\" href=\"#/{{operation.id}}\">{{operation.label}}</ion-item>\n" +
    "  <ion-list>\n" +
    "</ion-content>\n" +
    "");
}]);

angular.module("views/login_modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/login_modal.html",
    "<div class=\"modal\">\n" +
    "    <ion-header-bar class=\"bar bar-header bar-positive\">\n" +
    "        <h1 class=\"title\">新用户注册</h1>\n" +
    "        <button class=\"button button-clear button-primary\" ng-click=\"loginModal.hide()\">取消</button>\n" +
    "    </ion-header-bar>\n" +
    "    <ion-content>\n" +
    "        <div class=\"padding\">\n" +
    "            <div class=\"list\">\n" +
    "                <label class=\"item item-input\">\n" +
    "                    <span class=\"input-label\">昵称</span>\n" +
    "                    <input ng-model=\"formdata.nickName\" type=\"text\"/>\n" +
    "                </label>\n" +
    "                <button class=\"button button-full button-positive\" ng-click=\"register()\">注册</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </ion-content>\n" +
    "</div>\n" +
    "");
}]);

angular.module("views/menu_one.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/menu_one.html",
    "<ion-header-bar class=\"bar-positive\">\n" +
    "    <button class=\"button button-clear\" ng-click=\"back();\">返回</button>\n" +
    "    <h1 class=\"title\">写愿望</h1>\n" +
    "</ion-header-bar>\n" +
    "<ion-content has-bouncing=\"true\" class=\"padding\">\n" +
    "</ion-content>\n" +
    "");
}]);
