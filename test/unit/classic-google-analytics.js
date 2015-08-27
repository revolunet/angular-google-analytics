/* global before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('angular-google-analytics classic (ga.js)', function() {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider.setAccount('UA-XXXXXX-xx');
    AnalyticsProvider.useAnalytics(false);
    AnalyticsProvider.logAllCalls(true);
  }));

  describe('required settings missing', function () {
    describe('for default ga script injection', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount(undefined);
      }));

      it('should not inject a script tag', function () {
        inject(function (Analytics) {
          expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(0);
        });
      });

      it('should issue a warning to the log', function () {
        inject(function ($log) {
          spyOn($log, 'warn');
          inject(function (Analytics) {
            expect(Analytics._logs.length).toBe(1);
            expect(Analytics._logs[0][0]).toBe('warn');
            expect(Analytics._logs[0][1]).toBe('No account id set to create script tag');
            expect($log.warn).toHaveBeenCalledWith(['No account id set to create script tag']);
          });
        });
      });
    });
  });

  describe('enabled delayed script tag', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.delayScriptTag(true);
    }));

    it('should have a truthy value for Analytics.delayScriptTag', function () {
      inject(function (Analytics, $location) {
        expect(Analytics.delayScriptTag).toBe(true);
      });
    });

    it('should not inject a script tag', function () {
      inject(function (Analytics) {
        expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(0);
      });
    });
  });

  describe('does not support multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: "tracker1" },
      { tracker: 'UA-12345-45' }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
    }));

    it('should issue a warning to the log', function () {
      inject(function ($log) {
        spyOn($log, 'warn');
        inject(function (Analytics) {
          expect(Analytics._logs.length).toBe(3);
          expect(Analytics._logs[0][0]).toBe('warn');
          expect(Analytics._logs[0][1]).toBe('Multiple trackers are not supported with ga.js. Using first tracker only');
          expect($log.warn).toHaveBeenCalledWith(['Multiple trackers are not supported with ga.js. Using first tracker only']);
        });
      });
    });
  });
  
  describe('create script tag', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.delayScriptTag(true);
    }));

    it('should inject a script tag', function () {
      inject(function (Analytics) {
        var scriptCount = document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length;
        Analytics.createScriptTag({ userId: 1234 });
        expect(Analytics.getCookieConfig().userId).toBe(1234);
        expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(scriptCount + 1);
      });
    });

    it('should warn and prevent a second attempt to inject a script tag', function () {
      inject(function ($log) {
        spyOn($log, 'warn');
        inject(function (Analytics) {
          var scriptCount = document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length;
          Analytics.createScriptTag({ userId: 1234 });
          expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(scriptCount + 1);
          Analytics.createScriptTag({ userId: 1234 });
          expect($log.warn).toHaveBeenCalledWith(['ga.js or analytics.js script tag already created']);
          expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(scriptCount + 1);
        });
      });
    });
  });

  describe('automatic trackPages with ga.js', function () {
    it('should inject the GA script', function () {
      var scriptCount = document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length;
      inject(function (Analytics) {
        expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(scriptCount + 1);
      });
    });

    it('should generate trackPages', function () {
      inject(function (Analytics, $window) {
        var length = $window._gaq.length;
        Analytics.trackPage('test');
        expect(length + 2).toBe($window._gaq.length);
        expect($window._gaq[length]).toEqual(['_set', 'title', '']);
        expect($window._gaq[length + 1]).toEqual(['_trackPageview', 'test']);
      });
    });

    it('should generate a trackPage on routeChangeSuccess', function () {
      inject(function (Analytics, $rootScope, $window) {
        var length = $window._gaq.length;
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(length + 2).toBe($window._gaq.length);
        expect($window._gaq[length]).toEqual(['_set', 'title', '']);
        expect($window._gaq[length + 1]).toEqual(['_trackPageview', '']);
      });
    });
  });

  describe('NOT automatic trackPages', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should NOT generate a trackpage on routeChangeSuccess', function () {
      inject(function (Analytics, $rootScope, $window) {
        var length = $window._gaq.length;
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(length).toBe($window._gaq.length);
      });
    });

    it('should generate a trackpage when explicitly called', function () {
      inject(function (Analytics, $window) {
        var length = $window._gaq.length;
        Analytics.trackPage('/page/here');
        expect(length + 2).toBe($window._gaq.length);
        expect($window._gaq[length]).toEqual(['_set', 'title', '']);
        expect($window._gaq[length + 1]).toEqual(['_trackPageview', '/page/here']);
      });
    });
  });

  describe('eventTracks with ga.js', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should generate eventTracks', function () {
      inject(function (Analytics, $window) {
        var length = $window._gaq.length;
        Analytics.trackEvent('test');
        expect(length + 1).toBe($window._gaq.length);
        expect($window._gaq[length]).toEqual(['_trackEvent', 'test', undefined, undefined, undefined, false]);
      });
    });

    it('should generate eventTracks with non-interactions', function () {
      inject(function (Analytics, $window) {
        var length = $window._gaq.length;
        Analytics.trackEvent('test', 'action', 'label', 0, true);
        expect(length + 1).toBe($window._gaq.length);
        expect($window._gaq[length]).toEqual(['_trackEvent', 'test', 'action', 'label', 0, true]);
      });
    });
  });

  describe('supports dc.js', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useDisplayFeatures(true);
    }));

    it('should inject the DC script', function () {
      inject(function (Analytics) {
        expect(document.querySelectorAll("script[src='http://stats.g.doubleclick.net/dc.js']").length).toBe(1);
      });
    });
  });

  describe('e-commerce transactions', function () {
    it('should add transcation', function () {
      inject(function (Analytics, $window) {
        var length = $window._gaq.length;
        Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands');
        expect(length + 1).toBe($window._gaq.length);
        expect($window._gaq[length]).toEqual(['_addTrans', '1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands']);
      });
    });

    it('should add an item to transaction', function () {
      inject(function (Analytics, $window) {
        var length = $window._gaq.length;
        Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
        expect(length + 1).toBe($window._gaq.length);
        expect($window._gaq[length]).toEqual(['_addItem', '1', 'sku-1', 'Test product 1', 'Testing', '1', '1']);
        Analytics.addItem('1', 'sku-2', 'Test product 2', 'Testing', '1', '1');
        expect(length + 2).toBe($window._gaq.length);
        expect($window._gaq[length + 1]).toEqual(['_addItem', '1', 'sku-2', 'Test product 2', 'Testing', '1', '1']);
      });
    });

    it('should track the transaction', function () {
      inject(function (Analytics, $window) {
        var length = $window._gaq.length;
        Analytics.trackTrans();
        expect(length + 1).toBe($window._gaq.length);
        expect($window._gaq[length]).toEqual(['_trackTrans']);
      });
    });
  });

  describe('supports ignoreFirstPageLoad', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.ignoreFirstPageLoad(true);
    }));

    it('supports ignoreFirstPageLoad config', function () {
      inject(function (Analytics, $rootScope) {
        expect(Analytics.ignoreFirstPageLoad).toBe(true);
      });
    });
  });

  describe('supports arbitrary page events', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }));

    it('should inject the Analytics script', function () {
      inject(function (Analytics, $rootScope) {
        var length = Analytics._logs.length;
        $rootScope.$broadcast('$stateChangeSuccess');
        expect(length + 2).toBe(Analytics._logs.length);
        expect(Analytics._logs[length][0]).toEqual(['_set', 'title', '']);
        expect(Analytics._logs[length + 1][0]).toEqual(['_trackPageview', '']);
      });
    });
  });

  describe('supports RegExp path scrubbing', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setRemoveRegExp(new RegExp(/\/\d+?$/));
    }));

    it('should scrub urls', function () {
      inject(function (Analytics, $location) {
        $location.path('/some-crazy/page/with/numbers/123456');
        expect(Analytics.getUrl()).toBe('/some-crazy/page/with/numbers');
      });
    });
  });

  describe('parameter defaulting on trackPage', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should set url and title when no parameters provided', function () {
      inject(function (Analytics, $document, $location) {
        $location.path('/page/here');
        $document[0] = { title: 'title here' };
        var length = Analytics._logs.length;
        Analytics.trackPage();
        expect(length + 2).toBe(Analytics._logs.length);
        expect(Analytics._logs[length][0]).toEqual(['_set', 'title', 'title here']);
        expect(Analytics._logs[length + 1][0]).toEqual(['_trackPageview', '/page/here']);
      });
    });

    it('should set title when no title provided', function () {
      inject(function (Analytics, $document) {
        $document[0] = { title: 'title here' };
        var length = Analytics._logs.length;
        Analytics.trackPage('/page/here');
        expect(length + 2).toBe(Analytics._logs.length);
        expect(Analytics._logs[length][0]).toEqual(['_set', 'title', 'title here']);
        expect(Analytics._logs[length + 1][0]).toEqual(['_trackPageview', '/page/here']);
      });
    });
  });

  describe('enabled url params tracking', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackUrlParams(true);
    }));

    it('should grab query params in the url', function () {
      inject(function (Analytics, $location) {
        $location.url('/some/page?with_params=foo&more_param=123');
        expect(Analytics.getUrl()).toContain('?with_params=foo&more_param=123');
      });
    });
  });
});
