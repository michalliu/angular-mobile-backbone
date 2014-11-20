angular.module('appViewCache', ['views/index.html']);

angular.module("views/index.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/index.html",
    "<ion-header-bar class=\"bar-positive\">\n" +
    "  <button class=\"button button-clear\">Button1</button>\n" +
    "  <h1 class=\"title\">Title!</h1>\n" +
    "  <button class=\"button button-clear\">Right Button</button>\n" +
    "</ion-header-bar>\n" +
    "<ion-content>\n" +
    "  Some content!\n" +
    "</ion-content>\n" +
    "");
}]);
