/* global afterEach, before, beforeEach, describe, document, expect, inject, it, module, spyOn */
'use strict';

describe('Reading from $route service', function() {
  beforeEach(module('angular-google-analytics'));
  beforeEach(module(function (AnalyticsProvider) {
    AnalyticsProvider
      .setAccount('UA-XXXXXX-xx')
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
  
  describe('without $route service available', function() {
    beforeEach(module(function(AnalyticsProvider){
      AnalyticsProvider.readFromRoute(true);
    }));
    
    it('should log warning if service is missing', function() {
      inject(function($log) {
        spyOn($log, 'warn');
        inject(function(Analytics) {
          expect($log.warn).toHaveBeenCalledWith('$route service is not available. Make sure you have included ng-route in your application dependencies.');
        });
      });
    });
  });
  
  describe('after setting readFromRoute', function() {
    beforeEach(module(function(AnalyticsProvider, $provide){
      AnalyticsProvider.readFromRoute(true);
      $provide.service('$route', function () {
        this.routes = {
          someroute: { pageTrack: '/some' },
          otherroute: { },
          null: { }
        };
        this.current = { };
      });
    }));
    
    it('should activate $route reading', function(){
      inject(function(Analytics){
        expect(Analytics.configuration.readFromRoute).toBe(true);
      });
    });
    
    it('should read \'/someroute\' from routes object', function(){
      inject(function(Analytics, $route){
        $route.current = $route.routes.someroute;
        expect(Analytics.getUrl()).toBe('/some');
      });
    });
    
    it('should fallback to url for \'/otherroute\' without \'pageTrack\' property', function(){
      inject(function(Analytics, $route, $location){
        $route.current = $route.routes.otherroute;
        $location.url('/otherroute');
        expect(Analytics.getUrl()).toBe('/otherroute');
      });
    });
    
    it('should fallback to url for \'/undefinedroute\' which is not present in $route config', function(){
      inject(function(Analytics, $location) {
        $location.url('/undefinedroute');
        expect(Analytics.getUrl()).toBe('/undefinedroute');
      });
    });
  });
});