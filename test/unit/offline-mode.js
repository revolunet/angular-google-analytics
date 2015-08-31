/* global before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('angular-google-analytics offline mode', function () {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider
      .setAccount('UA-XXXXXX-xx')
      .logAllCalls(true);
  }));

  describe('with universal analytics', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(true);
    }));

    describe('at startup', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.startOffline(true);
      }));

      it('should have offline set to true', function () {
        inject(function (Analytics) {
          expect(Analytics.offline()).toBe(true);
        });
      });

      it('should have delay script tag set to true', function () {
        inject(function (Analytics) {
          expect(Analytics.delayScriptTag).toBe(true);
        });
      });

      it('should not have sent any commands while offline', function () {
        inject(function (Analytics) {
          Analytics.log.length = 0; // clear log
          Analytics.trackPage('/page/here');
          expect(Analytics.log.length).toBe(0);
        });
      });

      it('should send everything when script is added and reset to online', function () {
        inject(function (Analytics, $window) {
          Analytics.log.length = 0; // clear log
          Analytics.createAnalyticsScriptTag();
          Analytics.offline(false);
          expect(Analytics.log.length).toBe(2);
          expect(Analytics.log[0]).toEqual(['create', 'UA-XXXXXX-xx', 'auto', { allowLinker : false }]);
          expect(Analytics.log[1]).toEqual(['send', 'pageview', '']);
        });
      });
    });

    it('should be online by default', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
      });
    });

    it('should respect being set to offline', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
        Analytics.offline(true);
        expect(Analytics.offline()).toBe(true);
      });
    });

    it('should respect being reset to online', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
        Analytics.offline(true);
        expect(Analytics.offline()).toBe(true);
        Analytics.offline(false);
        expect(Analytics.offline()).toBe(false);
      });
    });

    it('should not send any commands while offline', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.offline(true);
        Analytics.trackPage('/page/here');
        expect(Analytics.log.length).toBe(0);
      });
    });

    it('should send all queued commands when reset to online', function () {
      inject(function (Analytics) {
        Analytics.log.length = 0; // clear log
        Analytics.offline(true);
        Analytics.trackPage('/page/here');
        expect(Analytics.log.length).toBe(0);
        Analytics.offline(false);
        expect(Analytics.log.length).toBe(1);
        expect(Analytics.log[0]).toEqual(['send', 'pageview', { page : '/page/here', title : '' }]);
      });
    });
  });

  describe('with classic analytics', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(false);
    }));

    describe('at startup', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.startOffline(true);
      }));

      it('should have offline set to true', function () {
        inject(function (Analytics) {
          expect(Analytics.offline()).toBe(true);
        });
      });

      it('should have delay script tag set to true', function () {
        inject(function (Analytics) {
          expect(Analytics.delayScriptTag).toBe(true);
        });
      });

      it('should not have sent any commands while offline', function () {
        inject(function (Analytics, $window) {
          $window._gaq.length = 0; // clear queue
          Analytics.trackPage('/page/here');
          expect($window._gaq.length).toBe(0);
        });
      });

      it('should send everything when script is added and reset to online', function () {
        inject(function (Analytics, $window) {
          $window._gaq.length = 0; // clear queue
          Analytics.createScriptTag();
          Analytics.offline(false);
          expect($window._gaq.length).toBe(2);
          expect($window._gaq[0]).toEqual(['_setAccount', 'UA-XXXXXX-xx']);
          expect($window._gaq[1]).toEqual(['_trackPageview']);
        });
      });
    });

    it('should be online by default', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
      });
    });

    it('should respect being set to offline', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
        Analytics.offline(true);
        expect(Analytics.offline()).toBe(true);
      });
    });

    it('should respect being reset to online', function () {
      inject(function (Analytics) {
        expect(Analytics.offline()).toBe(false);
        Analytics.offline(true);
        expect(Analytics.offline()).toBe(true);
        Analytics.offline(false);
        expect(Analytics.offline()).toBe(false);
      });
    });

    it('should not send any commands while offline', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.offline(true);
        Analytics.trackPage('/page/here');
        expect($window._gaq.length).toBe(0);
      });
    });

    it('should send all queued commands when reset to online', function () {
      inject(function (Analytics, $window) {
        $window._gaq.length = 0; // clear queue
        Analytics.offline(true);
        Analytics.trackPage('/page/here');
        expect($window._gaq.length).toBe(0);
        Analytics.offline(false);
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0]).toEqual(['_set', 'title', '']);
        expect($window._gaq[1]).toEqual(['_trackPageview', '/page/here']);
      });
    });
  });
});
