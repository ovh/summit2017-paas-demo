'use strict';

var angularapp = angular.module('myApp', ['ui.router', 'ngSanitize', 'ngWebSocket', 'angular-clipboard']);
angularapp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/welcome');
    $stateProvider
        .state('welcome', {
            url: '/welcome',
            templateUrl: 'templates/welcome.html'
        })
        .state('demo', {
            url: '/demo',
            controller: "DemoCtrl",
            templateUrl: 'templates/demo.html'
        })
        .state('tools', {
            url: '/tools',
            controller: "ToolsCtrl",
            templateUrl: 'templates/tools.html'
        })
        .state('logs', {
            url: '/logs',
            controller: "LogsCtrl",
            templateUrl: 'templates/logs.html'
        })
        .state('metrics', {
            url: '/metrics',
            controller: "MetricsCtrl",
            templateUrl: 'templates/metrics.html'
        })
        .state('functions', {
            url: '/functions',
            controller: "FunctionsCtrl",
            templateUrl: 'templates/functions.html'
        });
});
angular.module('myApp').run(function($rootScope, $state) {
        $rootScope.getClass = function(path) {
            if ($state.current.name == path) {
                    return "active";
            } else {
                    return "";
            }
        }
})

function Heading (level, text, link) {
  this.level = level;
  this.text = text;
  this.link = link;
  this.children = [];
  //this.parent = null;
}

Heading.prototype.addChild = function(level, text, link) {
  var child = new Heading(level, text, link);
  child.parent = this;
  this.children.push(child);
};

angularapp.directive('sidenav', function(){
	  return {
	    restrict: 'A',
	    templateUrl: 'templates/sidenav.html',
	    link: function(scope) {

	      // Select headings
	      var el = document.querySelector('#main');
      	var headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');

        // Build tree object
        var tree = new Heading(0,"",""); //root

        var lastH = tree;

        var h, currentLevel=0, lastParent;

        angular.forEach(headings, function (value, key, obj){
          h = new Heading (parseInt(value.tagName.substring(1)), value.textContent, value.id);

          if (h.level > currentLevel) {
            currentLevel++;
            while (h.level > currentLevel) {
              /* add a blank heading */
              var blank = new Heading(currentLevel, "", "");
              blank.parent = lastH;
              lastH.children.push(blank);
              lastParent = blank;
              lastH = blank;
              currentLevel++;
            }
            // we're there - add the child node
            h.parent = lastH;
            lastH.children.push(h);
            lastParent = lastH;
            lastH = h;

          } else if (h.level === currentLevel) {
            h.parent = lastParent;
            lastParent.children.push(h);
            // lastParent.addChild(h.level, h.text, h.link);
            lastH = h;


          } else if (h.level < currentLevel) {
            // Go back up the tree
            while (h.level < currentLevel) {
              lastH = lastH.parent;
              currentLevel--;
            }
            h.parent = lastH.parent;
            lastH.parent.children.push(h);
            lastParent = lastH.parent;
            lastH = h;
          }

        });
        scope.tree = tree;
      }
	  };
	});


angularapp.directive('scrollSpy', function ($window) {
  return {
    restrict: 'A',
    controller: function ($scope) {
      $scope.spies = [];
      this.addSpy = function (spyObj) {
        $scope.spies.push(spyObj);
      };
    },
    link: function (scope, elem, attrs) {
      var spyElems;
      spyElems = [];

      scope.$watchCollection('spies', function (spies) {
        var spy, _i, _len, _results;
        _results = [];

        for (_i = 0, _len = spies.length; _i < _len; _i++) {
          spy = spies[_i];

          if (spyElems[spy.id] == null) {
            _results.push(spyElems[spy.id] = elem.find('#' + spy.id));
          }
        }
        return _results;

      });

      $($window).scroll(function () {
        var highlightSpy, pos, spy, _i, _len, _ref;
        highlightSpy = null;
        _ref = scope.spies;

        // cycle through `spy` elements to find which to highlight
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          spy = _ref[_i];
          spy.out();

          // catch case where a `spy` has id = ""
          if (spy.id == "") {
            continue;
          }

          // catch case where a `spy` does not have an associated `id` anchor
          if (spyElems[spy.id] === undefined) {
            continue;
          }

          if ((pos = spyElems[spy.id].offset().top) - $window.scrollY <= 0) {
            // the window has been scrolled past the top of a spy element
            spy.pos = pos;

            if (highlightSpy == null) {
              highlightSpy = spy;
            }
            if (highlightSpy.pos < spy.pos) {
              highlightSpy = spy;
            }
          }
        }

        // select the last `spy` if the scrollbar is at the bottom of the page
        if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
          if (pos) {
            spy.pos = pos;
          }
          highlightSpy = spy;
        }

        return highlightSpy != null ? highlightSpy["in"]() : void 0;
      });
    }
  };
});

angularapp.directive('spy', function ($location, $anchorScroll) {
  return {
    restrict: "A",
    require: "^scrollSpy",
    link: function(scope, elem, attrs, affix) {
      elem.click(function () {
        scope.$apply(function() {
          $location.hash(attrs.spy);
          $anchorScroll();
        });
      });

      if (attrs.spy != "") {
        affix.addSpy({
          id: attrs.spy,
          in: function() {
            elem.addClass('active');
            $('.sidenav li').has('.active').addClass('active');
          },
          out: function() {
            elem.removeClass('active');
            $('.sidenav li').not(':has(.active)').removeClass('active');
          }
        });
      }
    }
  };
});
