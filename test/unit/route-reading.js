/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('Reading custom routes from $route service', function() {
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
  
  it('should not activate $route reading', function() {
    inject(function(Analytics) {
      expect(Analytics.configuration.readFromRoute).toBe(false);
    });
  });
  
  describe('activate $route service reading', function() {
    beforeEach(module(function(AnalyticsProvider){
      AnalyticsProvider.readFromRoute();
    }));
    
    it('should activate $route reading', function(){
      inject(function(Analytics){
        expect(Analytics.configuration.readFromRoute).toBe(true);
      });
    });
  });
});