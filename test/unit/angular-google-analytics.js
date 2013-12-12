/* global module, angular, console, describe, expect, it, before, beforeEach, inject, spyOn, AnalyticsProvider */

'use strict';

describe('angular-google-analytics', function(){

    beforeEach(module('angular-google-analytics'));
    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.setAccount('UA-XXXXXX-xx');
    }));

   describe('automatic trackPages', function() {

      it('should inject the GA script', function() {
        inject(function(Analytics) {
          expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(1);
        });
      });

      it('should generate pageTracks', function() {
        inject(function(Analytics) {
          expect(Analytics._logs.length).toBe(0);
          Analytics.trackPage('test');
          expect(Analytics._logs.length).toBe(1);
          Analytics.trackEvent('test');
          expect(Analytics._logs.length).toBe(2);
        });
      });

      it('should generate an trackpage to routeChangeSuccess', function() {
        inject(function(Analytics, $rootScope) {
          $rootScope.$broadcast('$routeChangeSuccess');
          expect(Analytics._logs.length).toBe(1);
        });
      });
  });

  describe('e-commerce transactions', function() {
  
      it('should add transcation', function() {
        inject(function(Analytics) {
          expect(Analytics._logs.length).toBe(0);
          Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands');
          expect(Analytics._logs.length).toBe(1);
        });
      });
  
      it('should add an item to transaction', function() {
        inject(function(Analytics) {
          expect(Analytics._logs.length).toBe(0);
          Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
          expect(Analytics._logs.length).toBe(1);
          Analytics.addItem('1', 'sku-2', 'Test product 2', 'Testing', '1', '1');
          expect(Analytics._logs.length).toBe(2);
        });
      });
  
      it('should track the transaction', function() {
        inject(function(Analytics) {
          expect(Analytics._logs.length).toBe(0);
          Analytics.trackTrans();
          expect(Analytics._logs.length).toBe(1);
        });
      });
  });

  describe('NOT automatic trackPages', function() {
    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should NOT generate an trackpage to routeChangeSuccess', function() {
      inject(function(Analytics, $rootScope) {
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(Analytics._logs.length).toBe(0);
      });
    });
  });

  describe('Supports ignoreFirstPageLoad', function() {
    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.ignoreFirstPageLoad(true);
    }));

    it('Supports ignoreFirstPageLoad config', function() {
      inject(function(Analytics, $rootScope) {

        expect(Analytics.ignoreFirstPageLoad).toBe(true);
      });
    });
  });

  describe('supports analytics.js', function() {
    var cookieConfig = {
      cookieDomain: 'foo.example.com',
      cookieName: 'myNewName',
      cookieExpires: 20000
    };

    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(true);
      AnalyticsProvider.setCookieConfig(cookieConfig);
      AnalyticsProvider.useECommerce(true);
      AnalyticsProvider.useEnhancedLinkAttribution(true);
      AnalyticsProvider.setExperimentId('12345');
    }));

    it('should inject the Analytics script', function() {
      inject(function(Analytics) {
        expect(document.querySelectorAll("script[src='//www.google-analytics.com/analytics.js']").length).toBe(1);
      });
    });

    it('should support ecommerce config', function () {
      inject(function(Analytics) {
        expect(Analytics.ecommerce).toBe(true);
      });
    });

    it('should support enhancedLinkAttribution config', function () {
      inject(function(Analytics) {
        expect(Analytics.enhancedLinkAttribution).toBe(true);
      });
    });

    it('should support experimentId config', function () {
      inject(function(Analytics) {
        expect(Analytics.experimentId).toBe('12345');
      });
    });

    it('should allow transaction clearing', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.clearTrans();
        expect(Analytics._logs.length).toBe(1);
      });
    });

    it('should allow sending custom events', function () {
      inject(function (Analytics) {
        var social = {
          hitType: 'social',
          socialNetwork: 'facebook',
          socialAction: 'like',
          socialTarget: 'http://mycoolpage.com',
          page: '/my-new-page'
        };

        expect(Analytics._logs.length).toBe(0);
        Analytics.send(social);
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0]).toEqual({
          '0': 'send',
          '1': social
        });
      });
    });

  });

  describe('e-commerce transactions with analytics.js', function() {
    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(true);
      AnalyticsProvider.useECommerce(true);
    }));

    it('should add transcation', function() {
      inject(function(Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0]['0']).toBe('ecommerce:addTransaction');
      });
    });

    it('should add an item to transaction', function() {
      inject(function(Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0]['0']).toBe('ecommerce:addItem');
      });
    });

    it('should track the transaction', function() {
      inject(function(Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.trackTrans();
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0]['0']).toBe('ecommerce:send');
      });
    });
  });

  describe('supports arbitrary page events', function() {
    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }));

    it('should inject the Analytics script', function() {
      inject(function(Analytics, $rootScope) {
        $rootScope.$broadcast('$stateChangeSuccess');
        expect(Analytics._logs.length).toBe(1);
      });
    });

    it('should inject the Analytics script', function() {
      inject(function(Analytics, $rootScope) {
        $rootScope.$broadcast('$stateChangeSuccess');
        expect(Analytics._logs.length).toBe(1);
      });
    });

  });

  describe('supports RegExp path scrubbing', function() {
    beforeEach(module(function(AnalyticsProvider) {
      AnalyticsProvider.setRemoveRegExp(new RegExp(/\/\d+?$/));
    }));

    it('should scrub urls', function() {
      inject(function(Analytics, $rootScope, $location) {
        $location.path('/some-crazy/page/with/numbers/123456');
        expect(Analytics.getUrl()).toBe('/some-crazy/page/with/numbers');
      });

    });

  });

});

