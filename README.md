# angular-google-analytics

This service lets you integrate google analytics tracker in your AngularJS applications easily.

You can use basic functions, `Analytics.trackEvent('video', 'play', 'django.mp4');` or more advanced e-commerce features like product tracking, promo codes, transactions...

Proudly brought to you by [@revolunet](http://twitter.com/revolunet) and [@deltaepsilon](https://github.com/deltaepsilon).

## features

 - configurable
 - automatic page tracking
 - events tracking
 - e-commerce tracking
 - enhanced e-commerce tracking
 - multiple-domains
 - ga.js and and analytics.js support
 - cross-domain support
 - multiple tracking objects

## install

`bower install angular-google-analytics`

Or alternatively, grab the dist/angular-google-analytics.min.js and include it in your project

## example

```js
var app = angular.module('app', ['angular-google-analytics'])
    .config(function(AnalyticsProvider) {
        // initial configuration
        AnalyticsProvider.setAccount('UA-XXXXX-xx');
        // using multiple tracking objects (analytics.js only)
        // AnalyticsProvider.setAccount([
        //   { tracker: 'UA-12345-12', name: "tracker1" },
        //   { tracker: 'UA-12345-34', name: "tracker2" }
        // ]);

        // track all routes (or not)
        AnalyticsProvider.trackPages(true);
				
        // track all url query params (default is false)
        AnalyticsProvider.trackUrlParams(true);

        // Optional set domain (Use 'none' for testing on localhost)
        // AnalyticsProvider.setDomainName('XXX');

        // Use display features plugin
        AnalyticsProvider.useDisplayFeatures(true);

        // url prefix (default is empty)
        // - for example: when an app doesn't run in the root directory
        AnalyticsProvider.trackPrefix('my-application');

        // Use analytics.js instead of ga.js
        AnalyticsProvider.useAnalytics(true);

        // Use cross domain linking
        AnalyticsProvider.useCrossDomainLinker(true);
        AnalyticsProvider.setCrossLinkDomains(['domain-1.com', 'domain-2.com']);

        // Ignore first page view... helpful when using hashes and whenever your bounce rate looks obscenely low.
        AnalyticsProvider.ignoreFirstPageLoad(true);

        // Enabled eCommerce module for analytics.js(uses legacy ecommerce plugin)
        AnalyticsProvider.useECommerce(true, false);

        // Enabled eCommerce module for analytics.js(uses ec plugin instead of ecommerce plugin)
        AnalyticsProvider.useECommerce(true, true);

        // Enable enhanced link attribution
        AnalyticsProvider.useEnhancedLinkAttribution(true);

        // Enable analytics.js experiments
        AnalyticsProvider.setExperimentId('12345');

        // Set custom cookie parameters for analytics.js
        AnalyticsProvider.setCookieConfig({
          cookieDomain: 'foo.example.com',
          cookieName: 'myNewName',
          cookieExpires: 20000
        });

        // change page event name
        AnalyticsProvider.setPageEvent('$stateChangeSuccess');


        // Delay script tage creation
        // must manually call Analytics.createScriptTag(cookieConfig) or Analytics.createAnalyticsScriptTag(cookieConfig)
        AnalyticsProvider.delayScriptTag(true);
    }))
    .run(function(Analytics) {
      // In case you are relying on automatic page tracking, you need to inject Analytics
      // at least once in your application (for example in the main run() block)
    })
    .controller('SampleController', function(Analytics) {
        // create a new pageview event
        Analytics.trackPage('/video/detail/XXX');

        // or create a new pageview event with optional page title
        Analytics.trackPage('/video/detail/XXX', 'Video XXX');

        // or create a new pageview event with optional page title, custom dimension and metric
        // (analytics.js only)
        Analytics.trackPage('/video/detail/XXX', 'Video XXX', {dimension15: 'My Custom Dimension', metric18: 8000});

        // create a new tracking event
        Analytics.trackEvent('video', 'play', 'django.mp4');

        // create a new tracking event with optional value
        Analytics.trackEvent('video', 'play', 'django.mp4', 4);

        // create a new tracking event with optional value and noninteraction flag
        Analytics.trackEvent('video', 'play', 'django.mp4', 4, true);

        // create a new tracking event with optional value, noninteraction flag, and custom dimension and metric
        // (analytics.js only)
        Analytics.trackEvent('video', 'play', 'django.mp4', 4, true, {dimension15: 'My Custom Dimension', metric18: 8000});

        // tracking e-commerce
        // - create transaction
        Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands', 'EUR');

        // - add items to transaction
        Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
        Analytics.addItem('1', 'sku-2', 'Test product 2', 'Testing', '1', '1');

        // - complete transaction
        Analytics.trackTrans();

        // Enhanced Ecommerce Tracking

        // Product Impression Tracking
        Analytics.addImpression(productId, name, list, brand, category, variant, position, price);
        Analytics.pageView();
        // example:
        Analytics.addImpression('sku-1', 'Test Product 1', 'Category List', 'Brand 1', 'Category-1', 'variant-1', '1', '24990');
        Analytics.addImpression('sku-2', 'Test Product 2', 'Category List', 'Brand 2', 'Category-1', 'variant-3', '2', '2499');
        Analytics.pageView();

        // Product Click Tracking
        Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
        Analytics.productClick(listName);
        // example:
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.productClick('Search Result');

        // Product Detail Tracking
        Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
        Analytics.trackDetail();
        // example:
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackDetail();

        // Add to cart Tracking
        Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
        Analytics.trackCart('add');
        // example:
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCart('add');

        // Remove from cart Tracking
        Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
        Analytics.trackCart('remove');
        // example:
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCart('remove');

        // Checkout Tracking
        Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
        Analytics.trackCheckout(checkoutStep, optionValue);
        // example:
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
        Analytics.trackCheckout(1, 'Visa');

        // Transaction Tracking
        Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
        Analytics.trackTransaction(transactionId, affiliation, revenue, tax, shipping, coupon, list, step, option);
        // example:
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2222', '1', 'MEN10', '1');
        Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '1111', '1', 'WOMEN10', '1');
        Analytics.trackTransaction('T1234', 'Online Store - Web', '3333', '10', '200', 'FLAT10', '', '', '');

        // Promotion Impressions
        Analytics.addPromo(productId, name, creative, position);
        Analytics.addPromo(productId, name, creative, position);
        Analytics.addPromo(productId, name, creative, position);
        Analytics.pageView();
        // Note: Before tracking promotion Click, call pageView otherwise promotion impressions will be treated as promotion clicks
        // example:
        Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
        Analytics.pageView();

        // Promotion Clicks
        Analytics.addPromo(promotionId, promotionName, creative, position);
        Analytics.addPromo(promotionId, promotionName, creative, position);
        Analytics.addPromo(promotionId, promotionName, creative, position);
        Analytics.promoClick(promotionName);
        // example:
        Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
        Analytics.promoClick('Summer Sale');

        // populate a custom dimension
        Analytics.set('dimension1', 'Paid');

        // Manually create script tag after using delayScriptTag
        Analytics.createScriptTag({userId: 1234});

        // Manually create Analytics script tag after using delayScriptTag
        Analytics.createAnalyticsScriptTag({userId: 1234})
        
        //Track User Timings
        Analytics.trackTimings(timingCategory, timingVar, timingValue, timingLabel)
        //example:
        var endTime = new Date().getTime();
        var timeSpent = endTime - startTime;
        Analytics.trackTimings('Time to Checkout', 'User Timings', timeSpent);

    });
```

## configuration

```js
// setup your account
AnalyticsProvider.setAccount('UA-XXXXX-xx');
// automatic route tracking (default=true)
AnalyticsProvider.trackPages(false);
// Optional set domain (Use 'none' for testing on localhost)
AnalyticsProvider.setDomainName('XXX');
// Use display features plugin
AnalyticsProvider.useDisplayFeatures(true);
// Use analytics.js instead of ga.js
AnalyticsProvider.useAnalytics(true);
// Ignore first page view.
AnalyticsProvider.ignoreFirstPageLoad(true);
// Enable eCommerce module for analytics.js
AnalyticsProvider.useECommerce(true, false);
// Enable enhanced eCommerce module for analytics.js
AnalyticsProvider.useECommerce(true, true);
// Enable enhanced link attribution module for analytics.js or ga.js
AnalyticsProvider.useEnhancedLinkAttribution(true);
// Enable analytics.js experiments
AnalyticsProvider.setExperimentId('12345');
// Set custom cookie parameters for analytics.js
AnalyticsProvider.setCookieConfig({
  cookieDomain: 'foo.example.com',
  cookieName: 'myNewName',
  cookieExpires: 20000
});
// Change the default page event name. This is useful for ui-router, which fires $stateChangeSuccess instead of $routeChangeSuccess
AnalyticsProvider.setPageEvent('$stateChangeSuccess');
// Delay script tage creation...must manually call Analytics.createScriptTag() or Analytics.createAnalyticsScriptTag() to enable analytics
AnalyticsProvider.delayScriptTag(true);

```

## AdBlock EasyPrivacy

AdBlock has a module named [EasyPrivacy](https://easylist-downloads.adblockplus.org/easyprivacy.txt) that is meant to block web tracking scripts. angular-google-analytics.js gets filtered out by the EasyPrivacy blacklist.

Users who are already concatenating and minifying their scripts should not notice a problem as long as the new script name is not also on the EasyPrivacy blacklist. Alternatively, consider changing the filename manually.

## Licence
As AngularJS itself, this module is released under the permissive [MIT license](http://revolunet.mit-license.org). Your contributions are always welcome.
