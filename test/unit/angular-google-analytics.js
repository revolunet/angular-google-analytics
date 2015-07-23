/* global before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('angular-google-analytics', function() {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider.setAccount('UA-XXXXXX-xx');
  }));

  describe('required settings missing', function () {
    describe('for default ga script injection', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount(false);
        AnalyticsProvider.useAnalytics(false);
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

    describe('for analytics script injection', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.setAccount(false);
        AnalyticsProvider.useAnalytics(true);
      }));

      it('should not inject a script tag', function () {
        inject(function (Analytics) {
          expect(document.querySelectorAll("script[src='//www.google-analytics.com/analytics.js']").length).toBe(0);
        });
      });

      it('should issue a warning to the log', function () {
        inject(function ($log) {
          spyOn($log, 'warn');
          inject(function (Analytics) {
            expect(Analytics._logs.length).toBe(1);
            expect(Analytics._logs[0][0]).toBe('warn');
            expect(Analytics._logs[0][1]).toBe('No account id set to create analytics script tag');
            expect($log.warn).toHaveBeenCalledWith(['No account id set to create analytics script tag']);
          });
        });
      });
    });
  });

  describe('enabled delayedScriptTag', function () {
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

  describe('automatic trackPages with ga.js', function () {
    it('should inject the GA script', function () {
      inject(function (Analytics) {
        expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(1);
      });
    });

    it('should generate trackPages', function () {
      inject(function (Analytics, $window) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.trackPage('test');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('_trackPageview');
        expect($window._gaq.length).toBe(4);
        expect($window._gaq[0][0]).toBe('_setAccount');
        expect($window._gaq[2][0]).toBe('_set');
        expect($window._gaq[2][1]).toBe('title');
        expect($window._gaq[2][2]).toBe('');
        expect($window._gaq[3][0]).toBe('_trackPageview');
        expect($window._gaq[3][1]).toBe('test');
      });
    });

    it('should generate a trackPage on routeChangeSuccess', function () {
      inject(function (Analytics, $rootScope) {
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('_trackPageview');
      });
    });
  });

  describe('NOT automatic trackPages', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should NOT generate a trackpage on routeChangeSuccess', function () {
      inject(function (Analytics, $rootScope) {
        $rootScope.$broadcast('$routeChangeSuccess');
        expect(Analytics._logs.length).toBe(0);
      });
    });

    it('should generate a trackpage when explicitly called', function () {
      inject(function (Analytics, $window) {
        Analytics.trackPage('/page/here');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('_trackPageview');
        expect($window._gaq.length).toBe(3);
        expect($window._gaq[0][0]).toBe('_setAccount');
        expect($window._gaq[1][0]).toBe('_set');
        expect($window._gaq[1][1]).toBe('title');
        expect($window._gaq[1][2]).toBe('');
        expect($window._gaq[2][0]).toBe('_trackPageview');
        expect($window._gaq[2][1]).toBe('/page/here');
      });
    });
  });

  describe('eventTracks with ga.js', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.trackPages(false);
    }));

    it('should generate eventTracks', function () {
      inject(function (Analytics, $window) {
        Analytics.trackEvent('test');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('trackEvent');
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0][0]).toBe('_setAccount');
        expect($window._gaq[1][0]).toBe('_trackEvent');
        expect($window._gaq[1][1]).toBe('test');
        expect($window._gaq[1][2]).toBe(undefined);
        expect($window._gaq[1][3]).toBe(undefined);
        expect($window._gaq[1][4]).toBe(undefined);
        expect($window._gaq[1][5]).toBe(false);
      });
    });

    it('should generate eventTracks with non-interactions', function () {
      inject(function (Analytics, $window) {
        Analytics.trackEvent('test', 'action', 'label', 0, true);
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('trackEvent');
        expect($window._gaq.length).toBe(2);
        expect($window._gaq[0][0]).toBe('_setAccount');
        expect($window._gaq[1][0]).toBe('_trackEvent');
        expect($window._gaq[1][1]).toBe('test');
        expect($window._gaq[1][2]).toBe('action');
        expect($window._gaq[1][3]).toBe('label');
        expect($window._gaq[1][4]).toBe(0);
        expect($window._gaq[1][5]).toBe(true);
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
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands');
        expect(Analytics._logs.length).toBe(1);
      });
    });

    it('should add an item to transaction', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
        expect(Analytics._logs.length).toBe(1);
        Analytics.addItem('1', 'sku-2', 'Test product 2', 'Testing', '1', '1');
        expect(Analytics._logs.length).toBe(2);
      });
    });

    it('should track the transaction', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.trackTrans();
        expect(Analytics._logs.length).toBe(1);
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

  describe('supports analytics.js', function () {
    var cookieConfig = {
      cookieDomain: 'foo.example.com',
      cookieName: 'myNewName',
      cookieExpires: 20000
    };

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(true);
      AnalyticsProvider.setCookieConfig(cookieConfig);
      AnalyticsProvider.useDisplayFeatures(true);
      AnalyticsProvider.useECommerce(true);
      AnalyticsProvider.useEnhancedLinkAttribution(true);
      AnalyticsProvider.setExperimentId('12345');
    }));

    it('should inject the Analytics script', function () {
      inject(function (Analytics) {
        expect(document.querySelectorAll("script[src='//www.google-analytics.com/analytics.js']").length).toBe(1);
      });
    });

    it('should respect cookieConfig', function () {
      inject(function (Analytics) {
        expect(Analytics.getCookieConfig()).toEqual(cookieConfig);
      });
    });

    it('should support displayFeatures config', function () {
      inject(function (Analytics) {
        expect(Analytics.displayFeatures).toBe(true);
      });
    });

    it('should support ecommerce config', function () {
      inject(function (Analytics) {
        expect(Analytics.ecommerce).toBe(true);
      });
    });

    it('should support enhancedLinkAttribution config', function () {
      inject(function (Analytics) {
        expect(Analytics.enhancedLinkAttribution).toBe(true);
      });
    });

    it('should support experimentId config', function () {
      inject(function (Analytics) {
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
          '0': ['send', social]
        });
      });
    });

    it('should allow setting custom dimensions, metrics or experiment', function () {
      inject(function (Analytics) {
        var data = {
          name: "dimension1",
          value: "value1"
        };
        expect(Analytics._logs.length).toBe(0);
        Analytics.set(data.name, data.value);
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0]).toEqual({
          '0': 'set',
          '1': data.name,
          '2': data.value
        });
      });
    });

    describe('with eventTracks', function () {
      beforeEach(module(function (AnalyticsProvider) {
        AnalyticsProvider.trackPages(false);
      }));

      it('should generate eventTracks', function () {
        inject(function ($window) {
          spyOn($window, 'ga');
          inject(function (Analytics) {
            Analytics.trackEvent('test');
            expect(Analytics._logs.length).toBe(1);
            expect(Analytics._logs[0][0]).toBe('event');
            expect($window.ga).toHaveBeenCalledWith('send', 'event', 'test', undefined, undefined, undefined, {});
          });
        });
      });

      it('should generate eventTracks and honour non-interactions', function () {
        inject(function ($window) {
          spyOn($window, 'ga');
          inject(function (Analytics) {
            Analytics.trackEvent('test', 'action', 'label', 0, true);
            expect(Analytics._logs.length).toBe(1);
            expect(Analytics._logs[0][0]).toBe('event');
            expect($window.ga).toHaveBeenCalledWith('send', 'event', 'test', 'action', 'label', 0, {nonInteraction: true});
          });
        });
      });
    });
  });

  describe('e-commerce transactions with analytics.js', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(true);
      AnalyticsProvider.useECommerce(true);
    }));

    it('should have ecommerce enabled', function () {
      inject(function (Analytics) {
        expect(Analytics.ecommerceEnabled()).toBe(true);
      });
    });

    it('should have enhanced ecommerce disabled', function () {
      inject(function (Analytics) {
        expect(Analytics.enhancedEcommerceEnabled()).toBe(false);
      });
    });

    it('should add transcation', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('ecommerce:addTransaction');
      });
    });

    it('should add an item to transaction', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('ecommerce:addItem');
      });
    });

    it('should track the transaction', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.trackTrans();
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('ecommerce:send');
      });
    });
  });

  describe('enhanced e-commerce transactions with analytics.js', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(true);
      AnalyticsProvider.useECommerce(true, true);
    }));

    it('should have ecommerce disabled', function () {
      inject(function (Analytics) {
        expect(Analytics.ecommerceEnabled()).toBe(false);
      });
    });

    it('should have enhanced ecommerce enabled', function () {
      inject(function (Analytics) {
        expect(Analytics.enhancedEcommerceEnabled()).toBe(true);
      });
    });

    it('should add product impression', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addImpression('sku-1', 'Test Product 1', 'Category List', 'Brand 1', 'Category-1', 'variant-1', '1', '24990');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('ec:addImpression');
      });
    });

    it('should add product data', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect(Analytics._logs.length).toBe(0);
          Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
          expect(Analytics._logs.length).toBe(1);
          expect(Analytics._logs[0][0]).toBe('ec:addProduct');
          expect(Analytics._logs[0][1][0]).toBe('sku-2');
          expect(Analytics._logs[0][1][1]).toBe('Test Product 2');
          expect(Analytics._logs[0][1][2]).toBe('Category-1');
          expect(Analytics._logs[0][1][3]).toBe('Brand 2');
          expect(Analytics._logs[0][1][4]).toBe('variant-3');
          expect(Analytics._logs[0][1][5]).toBe('2499');
          expect(Analytics._logs[0][1][6]).toBe('1');
          expect(Analytics._logs[0][1][7]).toBe('FLAT10');
          expect(Analytics._logs[0][1][8]).toBe('1');
          expect($window.ga).toHaveBeenCalledWith('ec:addProduct', {
            id: 'sku-2',
            name: 'Test Product 2',
            category: 'Category-1',
            brand: 'Brand 2',
            variant: 'variant-3',
            price: '2499',
            quantity: '1',
            coupon: 'FLAT10',
            position: '1'
          });
        });
      });
    });

    it('should add promo data', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('ec:addPromo');
      });
    });

    it('should set Action', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        var dummyAction = 'dummy';
        Analytics.setAction(dummyAction);
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('ec:setAction');
        expect(Analytics._logs[0][1][0]).toBe(dummyAction);
      });
    });

    it('should track product click', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        var dummyList = 'dummy list';
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.productClick(dummyList);
        expect(Analytics._logs.length).toBe(3);
        expect(Analytics._logs[0][0]).toBe('ec:addProduct');
        expect(Analytics._logs[1][0]).toBe('ec:setAction');
        expect(Analytics._logs[1][1][0]).toBe('click');
        expect(Analytics._logs[1][1][1].list).toBe(dummyList);
        expect(Analytics._logs[2][0]).toEqual([ 'send', 'event', 'UX', 'click', 'dummy list' ]);
      });
    });

    it('should track product detail', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackDetail();
        expect(Analytics._logs.length).toBe(3);
        expect(Analytics._logs[0][0]).toBe('ec:addProduct');
        expect(Analytics._logs[1][0]).toBe('ec:setAction');
        expect(Analytics._logs[1][1][0]).toBe('detail');
        expect(Analytics._logs[2][0]).toEqual(['send', 'pageview']);
      });
    });

    it('should track add to cart event', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCart('add');
        expect(Analytics._logs.length).toBe(3);
        expect(Analytics._logs[0][0]).toBe('ec:addProduct');
        expect(Analytics._logs[1][0]).toBe('ec:setAction');
        expect(Analytics._logs[1][1][0]).toBe('add');
        expect(Analytics._logs[2][0]).toEqual([ 'send', 'event', 'UX', 'click', 'add to cart' ]);
      });
    });

    it('should track remove from cart event', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCart('remove');
        expect(Analytics._logs.length).toBe(3);
        expect(Analytics._logs[0][0]).toBe('ec:addProduct');
        expect(Analytics._logs[1][0]).toBe('ec:setAction');
        expect(Analytics._logs[1][1][0]).toBe('remove');
        expect(Analytics._logs[2][0]).toEqual([ 'send', 'event', 'UX', 'click', 'remove to cart' ]);
      });
    });

    it('should track checkout', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCheckout();
        expect(Analytics._logs.length).toBe(2);
        expect(Analytics._logs[0][0]).toBe('ec:addProduct');
        expect(Analytics._logs[1][0]).toBe('ec:setAction');
        expect(Analytics._logs[1][1][0]).toBe('checkout');
      });
    });

    it('should track transaction', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.addProduct('sku-3', 'Test Product 3', 'Category-1', 'Brand 2', 'variant-5', '299', '1', 'FLAT10', '1');
        Analytics.trackTransaction();
        expect(Analytics._logs.length).toBe(3);
        expect(Analytics._logs[0][0]).toBe('ec:addProduct');
        expect(Analytics._logs[1][0]).toBe('ec:addProduct');
        expect(Analytics._logs[2][0]).toBe('ec:setAction');
        expect(Analytics._logs[2][1][0]).toBe('purchase');
      });
    });

    it('should track promo click', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
        Analytics.promoClick('Summer Sale');
        expect(Analytics._logs.length).toBe(3);
        expect(Analytics._logs[0][0]).toBe('ec:addPromo');
        expect(Analytics._logs[1][0]).toBe('ec:setAction');
        expect(Analytics._logs[1][1][0]).toBe('promo_click');
        expect(Analytics._logs[2][0]).toEqual([ 'send', 'event', 'Internal Promotions', 'click', 'Summer Sale' ]);
      });
    });
  });

  describe('supports arbitrary page events', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }));

    it('should inject the Analytics script', function () {
      inject(function (Analytics, $rootScope) {
        $rootScope.$broadcast('$stateChangeSuccess');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('_trackPageview');
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
        Analytics.trackPage();
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('_trackPageview');
        expect(Analytics._logs[0][1]).toBe('/page/here');
        expect(Analytics._logs[0][2]).toBe('title here');
      });
    });

    it('should set title when no title provided', function () {
      inject(function (Analytics, $document) {
        $document[0] = { title: 'title here' };
        Analytics.trackPage('/page/here');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toBe('_trackPageview');
        expect(Analytics._logs[0][1]).toBe('/page/here');
        expect(Analytics._logs[0][2]).toBe('title here');
      });
    });
  });

  describe('supports multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: "tracker1" },
      { tracker: 'UA-12345-34', name: "tracker2" },
      { tracker: 'UA-12345-45' }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
      AnalyticsProvider.useAnalytics(true);
    }));

    it('should call ga create event for each tracker', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect($window.ga).toHaveBeenCalledWith('create', trackers[0].tracker, 'auto', { name: trackers[0].name });
          expect($window.ga).toHaveBeenCalledWith('create', trackers[1].tracker, 'auto', { name: trackers[1].name });
          expect($window.ga).toHaveBeenCalledWith('create', trackers[2].tracker, 'auto');
        });
      });
    });

    describe('#trackPage', function () {
      it('should call ga send pageview event for each tracker', function () {
        inject(function ($window) {
          spyOn($window, 'ga');
          inject(function (Analytics) {
            Analytics.trackPage('/mypage', 'My Page');
            expect($window.ga).toHaveBeenCalledWith(trackers[0].name + '.send', 'pageview', { page: '/mypage', title: 'My Page' });
            expect($window.ga).toHaveBeenCalledWith(trackers[1].name + '.send', 'pageview', { page: '/mypage', title: 'My Page' });
            expect($window.ga).toHaveBeenCalledWith('send', 'pageview', { page: '/mypage', title: 'My Page' });
          });
        });
      });
    });
  });

  describe('supports advanced options for multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: "tracker1", crossDomainLinker: true },
      { tracker: 'UA-12345-34', name: "tracker2", crossDomainLinker: true, crossLinkDomains: ['domain-1.com'] },
      { tracker: 'UA-12345-45', crossDomainLinker: true, crossLinkDomains: ['domain-2.com'] },
      { tracker: 'UA-12345-67', cookieConfig: 'yourdomain.org' }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
      AnalyticsProvider.useAnalytics(true);
    }));

    it('should call ga require for each tracker', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect($window.ga).toHaveBeenCalledWith('tracker1.require', 'linker');
          expect($window.ga).toHaveBeenCalledWith('tracker2.require', 'linker');
          expect($window.ga).toHaveBeenCalledWith('require', 'linker');
        });
      });
    });

    it('should call ga linker autoLink for configured tracking objects only', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect($window.ga).not.toHaveBeenCalledWith('tracker1.linker:autoLink');
          expect($window.ga).toHaveBeenCalledWith('tracker2.linker:autoLink', ['domain-1.com']);
          expect($window.ga).toHaveBeenCalledWith('linker:autoLink', ['domain-2.com']);
        });
      });
    });

    it ('should call ga create with custom cookie config', function() {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          expect($window.ga).toHaveBeenCalledWith('create', 'UA-12345-67', 'yourdomain.org');
        });
      });
    });
  });

  describe('supports advanced tracking for multiple tracking objects', function () {
    var trackers = [
      { tracker: 'UA-12345-12', name: "tracker1", trackEvent: true },
      { tracker: 'UA-12345-34', name: "tracker2" },
      { tracker: 'UA-12345-45', trackEvent: true }
    ];

    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.setAccount(trackers);
      AnalyticsProvider.useAnalytics(true);
    }));

    it('should track events for configured tracking objects only', function () {
      inject(function ($window) {
        spyOn($window, 'ga');
        inject(function (Analytics) {
          Analytics.trackEvent('category', 'action', 'label', 'value');
          expect($window.ga).toHaveBeenCalledWith('tracker1.send', 'event', 'category', 'action', 'label', 'value', {});
          expect($window.ga).not.toHaveBeenCalledWith('tracker2.send', 'event', 'category', 'action', 'label', 'value', {});
          expect($window.ga).toHaveBeenCalledWith('send', 'event', 'category', 'action', 'label', 'value', {});
        });
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

  describe('createAnalyticsScriptTag', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.delayScriptTag(true);
    }));

    it('should inject a script tag', function () {
      inject(function (Analytics, $location) {
        var scriptCount = document.querySelectorAll("script[src='//www.google-analytics.com/analytics.js']").length;

        Analytics.createAnalyticsScriptTag({userId: 1234});
        expect(Analytics.getCookieConfig().userId).toBe(1234);
        expect(document.querySelectorAll("script[src='//www.google-analytics.com/analytics.js']").length).toBe(scriptCount + 1);
      });
    });

  });

  describe('createAnalyticsScriptTag', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.delayScriptTag(true);
    }));

    it('should inject a script tag', function () {
      inject(function (Analytics, $location) {
        var scriptCount = document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length;

        Analytics.createScriptTag({userId: 1234});
        expect(Analytics.getCookieConfig().userId).toBe(1234);
        expect(document.querySelectorAll("script[src='http://www.google-analytics.com/ga.js']").length).toBe(scriptCount + 1);
      });
    });
  });


  describe('should add user timing', function () {
    beforeEach(module(function (AnalyticsProvider) {
      AnalyticsProvider.useAnalytics(true);
    }));

    it('should add user timing', function () {
      inject(function (Analytics) {
        expect(Analytics._logs.length).toBe(0);
        Analytics.trackTimings('Time to Checkout', 'User Timings', '32', 'My Timings');
        expect(Analytics._logs.length).toBe(1);
        expect(Analytics._logs[0][0]).toEqual([ 'send', 'timing', 'Time to Checkout', 'User Timings', '32', 'My Timings']);
      });
    });
  });

  describe('directives', function () {
    describe('gaTrackEvent', function () {

      it('should evaluate scope params', function () {
        inject(function (Analytics, $rootScope, $compile) {
          spyOn(Analytics, 'trackEvent');
          var scope = $rootScope.$new(),
              element = '<div ga-track-event="[event, action, label]">test</div>',
              compiled = $compile(element)(scope);

          scope.event = 'button';
          scope.action = 'click';
          scope.label = 'Some Button';

          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent).toHaveBeenCalledWith('button', 'click', 'Some Button');
        });
      });

      it('should track an event when clicked', function () {
        inject(function (Analytics, $rootScope, $compile) {
          spyOn(Analytics, 'trackEvent');
          var scope = $rootScope.$new(),
              element = '<div ga-track-event="[\'button\', \'click\', \'Some Button\']">test</div>',
              compiled = $compile(element)(scope);
          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent).toHaveBeenCalledWith('button', 'click', 'Some Button');
        });
      });

      it('should inherit parent scope', function () {
        inject(function (Analytics, $rootScope, $compile) {
          spyOn(Analytics, 'trackEvent');
          var scope = $rootScope.$new(), element, compiled;
          scope.event = ['button', 'click', 'Some Button'];
          element = '<div ga-track-event="event">test</div>';
          compiled = $compile(element)(scope);
          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent).toHaveBeenCalledWith('button', 'click', 'Some Button');
        });
      });

      it('should abort if gaTrackEventIf is false', function () {
        inject(function (Analytics, $rootScope, $compile) {
          spyOn(Analytics, 'trackEvent');
          var scope = $rootScope.$new(),
              element = '<div ga-track-event="[\'button\', \'click\', \'Some Button\']" ga-track-event-if="false">test</div>',
              compiled = $compile(element)(scope);
          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent.calls.length).toBe(0);

          element = '<div ga-track-event="[\'button\', \'click\', \'Some Button\']" ga-track-event-if="true">test</div>';
          compiled = $compile(element)(scope);
          scope.$digest();
          compiled.triggerHandler('click');
          expect(Analytics.trackEvent.calls.length).toBe(1);
        });
      });

    });
  });

});
