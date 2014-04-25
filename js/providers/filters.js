/*globals angular*/

(function pageProviderInit(){ "use strict";

	angular.module('appFilters', []).

    filter('helloFilter', function(){
        return function(){
            return "Hello world";
        };
    });

}());
