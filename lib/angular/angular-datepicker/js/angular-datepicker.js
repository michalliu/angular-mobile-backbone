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
            return this.monthsShort[d.getMonth()] + " " + d.getFullYear();
        }
      };
    }]);

  angular.module('pickadate', ['pickadate.utils'])

    .directive('pickadate', ['$locale', 'pickadateUtils', 'dateFilter', '$sce', function($locale, dateUtils, dateFilter, sce) {
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
                                '<th colspan="5" class="switch">{{dayViewShortDesc}}</th>'+
                                '<th class="next" ng-click="changeMonth(1)" ng-show="allowNextMonth">›</th>'+
                            '</tr>'+
                            '<tr ng-bind-html="calendarHeader">' +
                            '</tr>'+
                        '</thead>'+
                        '<tbody ng-bind-html="calendarBody">'+
                        '</tbody>'+
                    '</table>'+
                '</div>'+
            '</div>',

        link: function(scope, element, attrs, ngModel)  {
          var minDate       = scope.minDate && dateUtils.stringToDate(scope.minDate),
              maxDate       = scope.maxDate && dateUtils.stringToDate(scope.maxDate),
              disabledDates = scope.disabledDates || [],
              currentDate   = new Date(),
              today         = dateFilter(currentDate, 'yyyy-MM-dd'),
              selectDate;

          //ngModel.$setViewValue("123");
          element.on('click touchdown', function (evt) {
              var el = angular.element(evt.srcElement);
              if (el.hasClass("day")) {
                if (el.hasClass('old') || el.hasClass('pickadate-disabled') || el.hasClass('pickadate-unavailable')) {
                    return;
                }
                element.find("tbody").find("td").removeClass("active");
                el.addClass('active');
                selectDate = {
                    date: el.attr("data-pickadate-id")
                };
                scope.setDate(selectDate);
              }
          });

          scope.dayNames    = dateUtils.daysShort;
          scope.dayViewShortDesc = dateUtils.getDateShortDesc(currentDate);

          scope.render = function(initialDate) {
            initialDate = new Date(initialDate.getFullYear(), initialDate.getMonth(), 1, 3);

            var currentMonth    = initialDate.getMonth() + 1,
              dayCount          = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0, 3).getDate(),
              prevDates         = dateUtils.dateRange(-initialDate.getDay(), 0, initialDate),
              currentMonthDates = dateUtils.dateRange(0, dayCount, initialDate),
              lastDate          = dateUtils.stringToDate(currentMonthDates[currentMonthDates.length - 1]),
              nextMonthDates    = dateUtils.dateRange(1, 7 - lastDate.getDay(), lastDate),
              allDates          = prevDates.concat(currentMonthDates, nextMonthDates),
              dates             = [];

            // Add an extra row if needed to make the calendar to have 6 rows
            //if (allDates.length / 7 < 6) {
            //  allDates = allDates.concat(dateUtils.dateRange(1, 8, allDates[allDates.length - 1]));
            //}

            var nextMonthInitialDate = new Date(initialDate);
            nextMonthInitialDate.setMonth(currentMonth);

            scope.allowPrevMonth = !minDate || initialDate > minDate;
            scope.allowNextMonth = !maxDate || nextMonthInitialDate < maxDate;
            scope.dayViewShortDesc = dateUtils.getDateShortDesc(initialDate);

            for (var i = 0; i < allDates.length; i++) {
              var className = "", date = allDates[i];

              if (date < scope.minDate || date > scope.maxDate || dateFilter(date, 'M') !== currentMonth.toString()) {
                className = 'day old disabled';
              } else if (indexOf.call(disabledDates, date) >= 0) {
                className = 'day old disabled unavailable';
              } else {
                className = 'day pickadate-enabled';
              }

              if (date === today) {
                className += ' today';
              }

              if (selectDate && (date === selectDate.date)) {
                className += ' active';
              }

              dates.push({date: date, className: className});
            }

            scope.calendarBody = sce.trustAsHtml(generateCalendarBody(dates));
            scope.calendarHeader = sce.trustAsHtml(generateCalendarHeader());
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
            return (/disabled/.test(dateObj.className));
          }

          function generateCalendarBody(dates) {
            var str="";
            for (var i=0;i<dates.length;i++) {
                if (i%7 === 0) {
                    str += '</tr><tr>';
                }
                str += '<td data-pickadate-id="' + dates[i].date + '" class="' + dates[i].className +'">'+ (today === dates[i].date ? "今天" : dateFilter(dates[i].date, 'd')) +'</td>';
            }
            return str.slice(5) + "</tr>";
          }

          function generateCalendarHeader(){
              var str="";
              for(var i=0;i<dateUtils.daysShort.length;i++) {
                  str += '<th class="dow">'+ dateUtils.daysShort[i] +'</th>';
              }
              return str;
          }
        }
      };
    }]);
})(window.angular);
