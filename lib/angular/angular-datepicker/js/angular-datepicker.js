/*globals window*/
;(function(angular){
  var indexOf = [].indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }
    return -1;
  };

  angular.module('pickadate.utils', [])
    .factory('pickadateUtils', ['dateFilter', function(dateFilter) {
      return {
        daysShort  : ["日", "一", "二", "三", "四", "五", "六"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        isDate: function(obj) {
          return Object.prototype.toString.call(obj) === '[object Date]';
        },

        stringToDate: function(dateString) {
          if (this.isDate(dateString)) return new Date(dateString);
          var dateParts = dateString.split('-'),
            year  = dateParts[0],
            month = dateParts[1],
            day   = dateParts[2];

          // set hour to 3am to easily avoid DST change
          return new Date(year, month - 1, day, 3);
        },

        dateRange: function(first, last, initial, format) {
          var date, i, _i, dates = [];

          if (!format) format = 'yyyy-MM-dd';

          for (i = _i = first; first <= last ? _i < last : _i > last; i = first <= last ? ++_i : --_i) {
            date = this.stringToDate(initial);
            date.setDate(date.getDate() + i);
            dates.push(dateFilter(date, format));
          }
          return dates;
        },

        getDateShortDesc: function (d) {
            console.log(d);
            return this.monthsShort[d.getMonth()] + " " + d.getFullYear();
        }
      };
    }]).
    filter('slice', function () {
        return function (arr,start,end) {
            return (arr || []).slice(start,end);
        }
    });

  angular.module('pickadate', ['pickadate.utils'])

    .directive('pickadate', ['$locale', 'pickadateUtils', 'dateFilter', function($locale, dateUtils, dateFilter) {
      return {
        require: 'ngModel',
        scope: {
          date: '=ngModel',
          minDate: '=',
          maxDate: '=',
          disabledDates: '='
        },
        template:
            '<div class="datepicker dropdown-menu">' +
                '<div class="datepicker-days">'+
                    '<table class="table-condensed">'+
                        '<thead>'+
                            '<tr>'+
                                '<th class="prev" ng-click="changeMonth(-1)" ng-show="allowPrevMonth">‹</th>'+
                                '<th colspan="5" class="switch">{{currentDateShortDesc}}</th>'+
                                '<th class="next" ng-click="changeMonth(1)" ng-show="allowNextMonth">›</th>'+
                            '</tr>'+
                            '<tr>'+
                                '<th class="dow" ng-repeat="dayName in dayNames">{{dayName}}</th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<td class="{{d.className}}" ng-class="{\'active\': date == d.date}" ng-click="setDate(d)" ng-repeat="d in dates | slice:0:7">{{d.date | date:"d"}}</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="{{d.className}}" ng-class="{\'active\': date == d.date}" ng-click="setDate(d)" ng-repeat="d in dates | slice:7:14">{{d.date | date:"d"}}</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="{{d.className}}" ng-class="{\'active\': date == d.date}" ng-click="setDate(d)" ng-repeat="d in dates | slice:14:21">{{d.date | date:"d"}}</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="{{d.className}}" ng-class="{\'active\': date == d.date}" ng-click="setDate(d)" ng-repeat="d in dates | slice:21:28">{{d.date | date:"d"}}</td>'+
                            '</tr>'+
                            '<tr>'+
                                '<td class="{{d.className}}" ng-class="{\'active\': date == d.date}" ng-click="setDate(d)" ng-repeat="d in dates | slice:28:35">{{d.date | date:"d"}}</td>'+
                            '</tr>'+
                        '</tbody>'+
                    '</table>'+
                '</div>'+
            '</div>',

        link: function(scope, element, attrs, ngModel)  {
          var minDate       = scope.minDate && dateUtils.stringToDate(scope.minDate),
              maxDate       = scope.maxDate && dateUtils.stringToDate(scope.maxDate),
              disabledDates = scope.disabledDates || [],
              currentDate   = new Date();

          scope.dayNames    = dateUtils.daysShort;
          scope.currentDateShortDesc = dateUtils.getDateShortDesc(currentDate);

          scope.render = function(initialDate) {
            initialDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 3);

            var currentMonth    = initialDate.getMonth() + 1,
              dayCount          = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0, 3).getDate(),
              prevDates         = dateUtils.dateRange(-initialDate.getDay(), 0, initialDate),
              currentMonthDates = dateUtils.dateRange(0, dayCount, initialDate),
              lastDate          = dateUtils.stringToDate(currentMonthDates[currentMonthDates.length - 1]),
              nextMonthDates    = dateUtils.dateRange(1, 7 - lastDate.getDay(), lastDate),
              allDates          = prevDates.concat(currentMonthDates, nextMonthDates),
              dates             = [],
              today             = dateFilter(new Date(), 'yyyy-MM-dd');

            // Add an extra row if needed to make the calendar to have 6 rows
            if (allDates.length / 7 < 6) {
              allDates = allDates.concat(dateUtils.dateRange(1, 8, allDates[allDates.length - 1]));
            }

            var nextMonthInitialDate = new Date(initialDate);
            nextMonthInitialDate.setMonth(currentMonth);

            scope.allowPrevMonth = !minDate || initialDate > minDate;
            scope.allowNextMonth = !maxDate || nextMonthInitialDate < maxDate;
            scope.currentDateShortDesc = dateUtils.getDateShortDesc(initialDate);

            for (var i = 0; i < allDates.length; i++) {
              var className = "", date = allDates[i];

              if (date < scope.minDate || date > scope.maxDate || dateFilter(date, 'M') !== currentMonth.toString()) {
                className = 'day old pickadate-disabled';
              } else if (indexOf.call(disabledDates, date) >= 0) {
                className = 'day old pickadate-disabled pickadate-unavailable';
              } else {
                className = 'day pickadate-enabled';
              }

              if (date === today) {
                className += 'day pickadate-today';
              }

              dates.push({date: date, className: className});
            }

            scope.dates = dates;
          };

          scope.setDate = function(dateObj) {
            if (isDateDisabled(dateObj)) return;
            ngModel.$setViewValue(dateObj.date);
          };

          ngModel.$render = function () {
            var date;
            if ((date = ngModel.$modelValue) && (indexOf.call(disabledDates, date) === -1)) {
              currentDate = dateUtils.stringToDate(date);
            } else if (date) {
              // if the initial date set by the user is in the disabled dates list, unset it
              scope.setDate({});
            }
            scope.render(currentDate);
          };

          scope.changeMonth = function (offset) {
            // If the current date is January 31th, setting the month to date.getMonth() + 1
            // sets the date to March the 3rd, since the date object adds 30 days to the current
            // date. Settings the date to the 2nd day of the month is a workaround to prevent this
            // behaviour
            currentDate.setDate(1);
            currentDate.setMonth(currentDate.getMonth() + offset);
            scope.render(currentDate);
          };

          function isDateDisabled(dateObj) {
            return (/pickadate-disabled/.test(dateObj.className));
          }
        }
      };
    }]);
})(window.angular);
