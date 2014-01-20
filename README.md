# angular-google-analytics

A simple service that let you integrate google analytics tracker in your AngularJS applications.

Proudly brought to you by [@revolunet](http://twitter.com/revolunet) and [@deltaepsilon](https://github.com/deltaepsilon).

## features

 - configurable
 - automatic page tracking
 - events tracking
 - e-commerce tracking
 - multiple-domains
 - ga.js and and analytics.js support

## example

```js
var app = angular.module('app', ['angular-google-analytics'])
    .config(function(AnalyticsProvider, function() {
        // initial configuration
        AnalyticsProvider.setAccount('UA-XXXXX-xx');

        // track all routes (or not)
        AnalyticsProvider.trackPages(true);

        //Optional set domain (Use 'none' for testing on localhost)
        //AnalyticsProvider.setDomainName('XXX');

        // url prefix (default is empty)
        // - for example: when an app doesn't run in the root directory
        AnalyticsProvider.trackPrefix('my-application');

        // Use analytics.js instead of ga.js
        AnalyticsProvider.useAnalytics(true);

        // Ignore first page view... helpful when using hashes and whenever your bounce rate looks obscenely low.
        AnalyticsProvider.ignoreFirstPageLoad(true);

        //Enabled eCommerce module for analytics.js
        AnalyticsProvider.useECommerce(true);

        //Enable enhanced link attribution
        AnalyticsProvider.useEnhancedLinkAttribution(true);

        //Enable analytics.js experiments
        AnalyticsProvider.setExperimentId('12345');

        //Set custom cookie parameters for analytics.js
        AnalyticsProvider.setCookieConfig({
          cookieDomain: 'foo.example.com',
          cookieName: 'myNewName',
          cookieExpires: 20000
        });

        // change page event name
        AnalyticsProvider.setPageEvent('$stateChangeSuccess');
    }))
    .controller('SampleController', function(Analytics) {
        // create a new pageview event
        Analytics.trackPage('/video/detail/XXX');

        // create a new tracking event
        Analytics.trackEvent('video', 'play', 'django.mp4');
        
        // tracking e-commerce
        // - create transaction
        Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands');
        
        // - add items to transaction
        Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
        Analytics.addItem('1', 'sku-2', 'Test product 2', 'Testing', '1', '1');
        
        // - complete transaction
        Analytics.trackTrans();
    });
```

## configuration

```js
// setup your account
AnalyticsProvider.setAccount('UA-XXXXX-xx');
// automatic route tracking (default=true)
AnalyticsProvider.trackPages(false);
//Optional set domain (Use 'none' for testing on localhost)
AnalyticsProvider.setDomainName('XXX');
//Use analytics.js instead of ga.js
AnalyticsProvider.useAnalytics(true);
// Ignore first page view.
AnalyticsProvider.ignoreFirstPageLoad(true);
//Enable eCommerce module for analytics.js
AnalyticsProvider.useECommerce(true);
//Enable enhanced link attribution module for analytics.js or ga.js
AnalyticsProvider.useEnhancedLinkAttribution(true);
//Enable analytics.js experiments
AnalyticsProvider.setExperimentId('12345');
//Set custom cookie parameters for analytics.js
AnalyticsProvider.setCookieConfig({
  cookieDomain: 'foo.example.com',
  cookieName: 'myNewName',
  cookieExpires: 20000
});
//Change the default page event name. This is useful for ui-router, which fires $stateChangeSuccess instead of $routeChangeSuccess
AnalyticsProvider.setPageEvent('$stateChangeSuccess');

```

## Licence
As AngularJS itself, this module is released under the permissive [MIT license](http://revolunet.mit-license.org). Your contributions are always welcome.
