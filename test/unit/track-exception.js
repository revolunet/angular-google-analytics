/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('universal analytics exception tracking', function () {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider
      .setAccount('UA-XXXXXX-xx')
      .useAnalytics(true)
      .logAllCalls(true)
      .enterTestMode();
  }));

  afterEach(inject(function (Analytics) {
    Analytics.log.length = 0; // clear log
  }));

  it('should have a trackException method', function () {
    inject(function (Analytics) {
      expect(typeof Analytics.trackException === 'function').toBe(true);
    });
  });

  it('should allow for tracking an exception with no parameters provided', function () {
    inject(function (Analytics) {
      Analytics.log.length = 0; // clear log
      Analytics.trackException();
      expect(Analytics.log[0]).toEqual(['send', 'exception', { exDescription: undefined, exFatal: false }]);
    });
  });

  it('should allow for tracking an exception with all parameters provided', function () {
    inject(function (Analytics) {
      Analytics.log.length = 0; // clear log
      Analytics.trackException('Something fatal happened!', true);
      expect(Analytics.log[0]).toEqual(['send', 'exception', { exDescription: 'Something fatal happened!', exFatal: true }]);
    });
  });
});
