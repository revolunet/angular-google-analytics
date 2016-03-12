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
    beforeEach(module(function(AnalyticsProvider, $provide){
      AnalyticsProvider.readFromRoute(true);
      $provide.service('$log', function() {
        this.messages = [];
        this.warn = function (message) {
          this.messages.push(message);
        };
      });
    }));
    
    it('should log warning if service is missing', function() {
      inject(function(Analytics, $log) {
        expect($log.messages.length).toBe(1);
        expect($log.messages[0]).toBe('$route service is not available. Make sure you have included ng-route in your application dependencies.');
      });
    });
  });
  
  describe('after setting readFromRoute', function() {
    beforeEach(module(function(AnalyticsProvider, $provide){
      AnalyticsProvider.readFromRoute(true);
      $provide.service('$route', function () {
        this.routes = {
          someroute: {
            regexp: /\/someroute/,
            pageTrack: '/some'
          },
          otherroute: {
            regexp: /\/otherroute/
          }
        };
      });
    }));
    
    it('should activate $route reading', function(){
      inject(function(Analytics){
        expect(Analytics.configuration.readFromRoute).toBe(true);
      });
    });
    
    it('should read \'/someroute\' from routes object', function(){
      inject(function(Analytics, $location){
        $location.url('/someroute');
        expect(Analytics.getUrl()).toBe('/some');
      });
    });
    
    it('should fallback to url for \'/otherroute\' without \'pageTrack\' property', function(){
      inject(function(Analytics, $location){
        $location.url('/otherroute');
        expect(Analytics.getUrl()).toBe('/otherroute');
      });
    });
    
    it('should fallback to url for \'/undefinedroute\' which is not present in $route config', function(){
      inject(function(Analytics, $location){
        $location.url('/undefinedroute');
        expect(Analytics.getUrl()).toBe('/undefinedroute');
      });
    });
  });
});