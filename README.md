# angular-google-analytics

![Bower Version](https://img.shields.io/bower/v/angular-google-analytics.svg)
![NPM Version](https://img.shields.io/npm/v/angular-google-analytics.svg)
![Master Build Status](https://codeship.com/projects/ba7a0af0-33fe-0133-927c-127922174191/status?branch=master)

This service lets you integrate google analytics tracker in your AngularJS applications easily.

You can use basic functions, `Analytics.trackEvent('video', 'play', 'django.mp4');` or more advanced e-commerce features like product tracking, promo codes, transactions...

Proudly brought to you by [@revolunet](http://twitter.com/revolunet), [@deltaepsilon](https://github.com/deltaepsilon), [@justinsa](https://github.com/justinsa) and [contributors](https://github.com/revolunet/angular-google-analytics/graphs/contributors)

## Features

 - highly configurable
 - automatic page tracking
 - event tracking
 - e-commerce (ecommerce.js) support
 - enhanced e-commerce (ec.js) support
 - multiple-domains
 - ga.js (classic) and analytics.js (universal) support
 - cross-domain support
 - multiple tracking objects
 - hybrid mobile application support
 - offline mode

## Installation

`bower install angular-google-analytics`

Or alternatively, grab the dist/angular-google-analytics.min.js and include it in your project


In your application, declare the angular-google-analytics module dependency.

```html
<script src="bower_components/angular-google-analytics/dist/angular-google-analytics.js"></script>
```

In your application, declare dependency injection like so.

```javascript
angular.module('myModule', ['angular-google-analytics']);
```

## Configure Service
```js
app.config(function (AnalyticsProvider) {
  // Add configuration code as desired - see below
});
```

### Configuration Method Chaining
```js
  // All configuration methods return the provider object and can be chained to reduce typing.
  // For example:
  AnalyticsProvider
    .logAllCalls(true)
    .startOffline(true)
    .useEcommerce(true, true);
```

### Use Classic Analytics
```js
// Use ga.js (classic) instead of analytics.js (universal)
// By default, universal analytics is used, unless this is called with a falsey value.
AnalyticsProvider.useAnalytics(false);
```

### Set Google Analytics Accounts (Required)
```js
// Set a single account
AnalyticsProvider.setAccount('UA-XXXXX-xx');
```
**Note:** the single account syntax is internally represented as an unnamed account object that will have all properties defined to defaults, except for name.

```js
// Set multiple accounts
// Universal Analytics only
AnalyticsProvider.setAccount([
   { tracker: 'UA-12345-12', name: "tracker1" },
   { tracker: 'UA-12345-34', name: "tracker2" }
]);
```
**Note:** the above account objects will have all properties defined to defaults that are not defined.

```js
// Set a single account with all properties defined
// Universal Analytics only
AnalyticsProvider.setAccount({
  tracker: 'UA-12345-12',
  name: "tracker1",
  fields: {
    cookieDomain: 'foo.example.com',
    cookieName: 'myNewName',
    cookieExpires: 20000
    // See: [Analytics Field Reference](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference) for a list of all fields.
  },
  crossDomainLinker: true,
  crossLinkDomains: ['domain-1.com', 'domain-2.com'],
  displayFeatures: true,
  enhancedLinkAttribution: true,
  select: function (args) {
    // This function is used to qualify or disqualify an account object to be run with commands.
    // If the function does not exist, is not a function, or returns true then the account object will qualify.
    // If the function exists and returns false then the account object will be disqualified.
    // The 'args' parameter is the set of arguments (which contains the command name) that will be sent to Universal Analytics.
    return true;
  },
  set: {
    forceSSL: true
    // This is any set of `set` commands to make for the account immediately after the `create` command for the account.
    // The property key is the command and the property value is passed in as the argument, _e.g._, `ga('set', 'forceSSL', true)`.
    // Order of commands is not guaranteed as it is dependent on the implementation of the `for (property in object)` iterator.
  },
  trackEvent: true,
  trackEcommerce: true
});
```
**Note:** the above properties are referenced and discussed in proceeding sections.
**Note:** the `cookieConfig` property is being **deprecated** for the `fields` property. At present `cookieConfig` is an alias for `fields` in an account object.

### Use Display Features
```js
  // Use display features module
  AnalyticsProvider.useDisplayFeatures(true);
```

If set to a truthy value then the display features module is loaded with Google Analytics.

In the case of universal analytics, this value will be used as the default for any tracker that does not have the `displayFeatures` property defined. All trackers with `displayFeatures: true` will be registered for display features.

### Use Enhanced Link Attribution
```js
  // Enable enhanced link attribution module
  AnalyticsProvider.useEnhancedLinkAttribution(true);
```

If set to a truthy value then the enhanced link attribution module is loaded with Google Analytics.

In the case of universal analytics, this value will be used as the default for any tracker that does not have the `enhancedLinkAttribution` property defined. All trackers with `enhancedLinkAttribution: true` will be registered for enhanced link attribution.

### Use Cross Domain Linking
```js
  // Use cross domain linking and set cross-linked domains
  AnalyticsProvider.useCrossDomainLinker(true);
  AnalyticsProvider.setCrossLinkDomains(['domain-1.com', 'domain-2.com']);
```

If set to a truthy value then the cross-linked domains are registered with Google Analytics.

In the case of universal analytics, these values will be used as the default for any tracker that does not have the `crossDomainLinker` and `crossLinkDomains` properties defined. All trackers with `crossDomainLinker: true` will register the cross-linked domains.

### Set Cookie Configuration
**NOTE:** This method is being **deprecated**. Use the `fields` property on the account object instead.
This property is defined for universal analytics account objects only and is set to `auto` by default.

```js
  // Set custom cookie parameters
  AnalyticsProvider.setCookieConfig({
    cookieDomain: 'foo.example.com',
    cookieName: 'myNewName',
    cookieExpires: 20000
  });
```
This cookie configuration will be used as the default for any tracker that does not have the `cookieConfig` property defined.

### Track Events
This property is defined for universal analytics account objects only and is false by default.

If `trackEvent: true` for an account object then all `trackEvent` calls will be supported for that account object.

Set `trackEvent: false` for an account object that is not tracking events.

### Track E-Commerce
This property is defined for universal analytics account objects only. This property defaults to true if e-commerce is enabled (either classic or enhanced) and false otherwise.

If `trackEcommerce: true` for an account object then all e-commerce calls will be supported for that account object.

Set `trackEcommerce: false` for an account object that is not tracking e-commerce.

### Enable E-Commerce
```js
  // Enable e-commerce module (ecommerce.js)
  AnalyticsProvider.useECommerce(true, false);

  // Enable enhanced e-commerce module (ec.js)
  // Universal Analytics only
  AnalyticsProvider.useECommerce(true, true);

  // Set Currency
  // Default is 'USD'. Use ISO currency codes.
  AnalyticsProvider.setCurrency('CDN');
```
**Note:** When enhanced e-commerce is enabled, the legacy e-commerce module is disabled and unsupported. This is a requirement of Google Analytics.

### Set Route Tracking Behaviors
```js
  // Track all routes (default is true).
  AnalyticsProvider.trackPages(true);

  // Track all URL query params (default is false).
  AnalyticsProvider.trackUrlParams(true);

  // Ignore first page view (default is false).
  // Helpful when using hashes and whenever your bounce rate looks obscenely low.
  AnalyticsProvider.ignoreFirstPageLoad(true);

  // URL prefix (default is empty).
  // Helpful when the app doesn't run in the root directory.
  AnalyticsProvider.trackPrefix('my-application');

  // Change the default page event name.
  // Helpful when using ui-router, which fires $stateChangeSuccess instead of $routeChangeSuccess.
  AnalyticsProvider.setPageEvent('$stateChangeSuccess');

  // RegEx to scrub location before sending to analytics.
  // Internally replaces all matching segments with an empty string.
  AnalyticsProvider.setRemoveRegExp(/\/\d+?$/);
```

### Set Domain Name
```js
  // Set the domain name
  AnalyticsProvider.setDomainName('XXX');
```
**Note:** Use the string `'none'` for testing on localhost.

### Enable Experiment (universal analytics only)
```js
  // Enable analytics.js experiments
  AnalyticsProvider.setExperimentId('12345');
```
**Note:** only a single experiment can be defined.

### Support Hybrid Mobile Applications
This property is defined for universal analytics only and is false by default.

```js
  // Set hybrid mobile application support
  AnalyticsProvider.setHybridMobileSupport(true);
```

If set to a truthy value then each account object will disable protocol checking and all injected scripts will use the HTTPS protocol.

### Delay Script Tag Insertion
```js
  // Must manually call create script tag method in order to insert and configure Google Analytics:
  //   Classic analytics:   Analytics.createScriptTag();
  //   Universal analytics: Analytics.createAnalyticsScriptTag();
  // Helpful when needing to do advanced configuration or user opt-out and wanting explicit control over when the Google Analytics script gets injected.
  AnalyticsProvider.delayScriptTag(true);
```

### Offline Mode
```js
  // Start in offline mode if set to true. This also calls delayScriptTag(true) since the script cannot be
  // fetched if offline and must be manually called when the application goes online.
  AnalyticsProvider.startOffline(true);
```

### Service Logging
```js
  // Log all outbound calls to an in-memory array accessible via ```Analytics.log``` (default is false).
  // This is useful for troubleshooting and seeing the order of calls with parameters.
  AnalyticsProvider.logAllCalls(true);
```

### Test Mode
```js
  // This method is designed specifically for unit testing and entering test mode cannot be changed after
  // being called. Test mode skips the insertion of the Google Analytics script tags (both classic and universal)
  // and ensures there is a $window.ga() method available for calling by unit tests. This corrects transient
  // errors that were seen during unit tests due to the operation of the Google Analtics scripts.
  AnalyticsProvider.enterTestMode();
```

## Automatic Tracking
If you are relying on automatic page tracking, you need to inject Analytics at least once in your application.
```js
  // As an example, add the service to the run call:
  app.run(function(Analytics) {});
```

## Making Calls
```js
  // As an example, a simple controller to make calls from:
  app.controller('SampleController', function (Analytics) {
    // Add calls as desired - see below
  });
```

### Accessing Configuration Settings
The following configuration settings are intended to be immutable. While the values can be changed in this list by the user, this will not impact the behavior of the service as these values are not referenced internally; exceptions are noted below but are not intended to be utilized in such a way by the user. No guarantee will be made for future versions of this service supporting any functionality beyond reading values from this list.
```js
  // This is a mutable array. Changes to this list will impact service behaviors.
  Analytics.configuration.accounts;

  // If `true` then universal analytics is being used.
  // If `false` then classic analytics is being used.
  Analytics.configuration.universalAnalytics;

  Analytics.configuration.crossDomainLinker;
  Analytics.configuration.crossLinkDomains;
  Analytics.configuration.currency;
  Analytics.configuration.delayScriptTag;
  Analytics.configuration.displayFeatures;
  Analytics.configuration.domainName;

  // ecommerce and enhancedEcommerce are mutually exclusive; either both will be false or one will be true.
  Analytics.configuration.ecommerce;
  Analytics.configuration.enhancedEcommerce;

  Analytics.configuration.enhancedLinkAttribution;
  Analytics.configuration.experimentId;
  Analytics.configuration.ignoreFirstPageLoad;
  Analytics.configuration.logAllCalls;
  Analytics.configuration.pageEvent;
  Analytics.configuration.removeRegExp;
  Analytics.configuration.trackPrefix;
  Analytics.configuration.trackRoutes;
  Analytics.configuration.trackUrlParams;
```

### Get or Set Cookie Configuration
**NOTE:** These methods are being **deprecated**. Use the `fields` property on the account object instead.

```js
  // Get the global cookie config.
  Analytics.getCookieConfig();

  // Set the global cookie config.
  // Impacts all future calls for classic analytics (ga.js).
  Analytics.setCookieConfig();
```
**Note:** Changing the cookie configuration after the AnalyticsProvider configuration does not update the individual account objects used by universal analytics (analytics.js). If you want to change the account objects used by universal analytics those can be accessed through `Analytics.configuration.accounts`, but such modification to the accounts object is unsupported.

### Get URL
```js
  // Returns the current URL that would be sent if a `trackPage` call was made.
  // The returned value takes into account all configuration settings that modify the URL.
  Analytics.getUrl();
```

### Manual Script Tag Injection
If `delayScriptTag(true)` was set during configuration then manual script tag injection is required. Otherwise, the script tag will be automatically injected and configured when the service is instantiated.
```js
  // Manually create classic analytics (ga.js) script tag
  Analytics.createScriptTag();

  // Manually create universal analytics (analytics.js) script tag
  Analytics.createAnalyticsScriptTag();
```

### Advanced Settings / Custom Dimensions
The `set` call allows for advanced configuration and definitions in univeral analytics only. This is a no-op when using classic analytics.
```js
  // Set the User Id
  Analytics.set('&uid', 1234);
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // Register a custom dimension for the default, unnamed account object
  // e.g., ga('set', 'dimension1', 'Paid');
  Analytics.set('dimension1', 'Paid');
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // Register a custom dimenstion for a named account object
  // e.g., ga('accountName.set', 'dimension2', 'Paid');
  Analytics.set('dimension2', 'Paid', 'accountName');
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.
```

### Page Tracking
```js
  // Create a new pageview event
  Analytics.trackPage('/video/detail/XXX');
  Analytics.pageView();

  // Create a new pageview event with page title
  Analytics.trackPage('/video/detail/XXX', 'Video XXX');
  Analytics.pageView();

  // Create a new pageview event with page title, custom dimension, and custom metric
  // Universal Analytics only
  Analytics.trackPage('/video/detail/XXX', 'Video XXX', { dimension15: 'My Custom Dimension', metric18: 8000 });
  Analytics.pageView();
```

### Event Tracking
```js
  // Create a new tracking event
  Analytics.trackEvent('video', 'play', 'django.mp4');
  Analytics.pageView();

  // Create a new tracking event with a value
  Analytics.trackEvent('video', 'play', 'django.mp4', 4);
  Analytics.pageView();

  // Create a new tracking event with a value and non-interaction flag
  Analytics.trackEvent('video', 'play', 'django.mp4', 4, true);
  Analytics.pageView();

  // Create a new tracking event with a value, non-interaction flag, custom dimension, and custom metric
  // Universal Analytics only
  Analytics.trackEvent('video', 'play', 'django.mp4', 4, true, { dimension15: 'My Custom Dimension', metric18: 8000 });
  Analytics.pageView();
```

### Track User Timings
The `trackTimings` call is available for univeral analytics only. This is a no-op when using classic analytics.
```js
  Analytics.trackTimings(timingCategory, timingVar, timingValue, timingLabel);

  // example:
  var endTime = new Date().getTime(),
      timeSpent = endTime - startTime;
  Analytics.trackTimings('Time to Checkout', 'User Timings', timeSpent);
```

### Classic E-Commerce (ecommerce.js)
Classic e-commerce and enhanced e-commerce are mutually exclusive.
```js
  // Create transaction
  Analytics.addTrans('1', '', '2.42', '0.42', '0', 'Amsterdam', '', 'Netherlands', 'EUR');
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // Add items to transaction
  Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
  Analytics.addItem('1', 'sku-2', 'Test product 2', 'Testing', '1', '1');
  Analytics.pageView();

  // Complete transaction
  Analytics.trackTrans();
  Analytics.pageView();

  // Clear transaction
  Analytics.clearTrans();
  Analytics.pageView();
```

### Enhanced E-Commerce (ec.js)
Enhanced e-commerce is only available for universal analytics. Enhanced e-commerce and classic e-commerce are mutually exclusive.

#### Product Impression Tracking
```js
  Analytics.addImpression(productId, name, list, brand, category, variant, position, price);
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // example:
  Analytics.addImpression('sku-1', 'Test Product 1', 'Category List', 'Brand 1', 'Category-1', 'variant-1', '1', '24990');
  Analytics.addImpression('sku-2', 'Test Product 2', 'Category List', 'Brand 2', 'Category-1', 'variant-3', '2', '2499');
  Analytics.pageView();
```

#### Product Click Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position, custom);
  Analytics.productClick(listName);
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.productClick('Search Result');
  Analytics.pageView();

  // example with custom dimension and metric:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1', { dimension4: 'strong', metric2: 5 });
  Analytics.productClick('Search Result');
  Analytics.pageView();
```

#### Product Detail Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackDetail();
  Analytics.pageView();

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.trackDetail();
  Analytics.pageView();
```

#### Add to Cart Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackCart('add');
  Analytics.pageView();

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.trackCart('add');
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.
```

#### Remove from Cart Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackCart('remove');
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.trackCart('remove');
  Analytics.pageView(); 
```

#### Checkout Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackCheckout(checkoutStep, optionValue);
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.trackCheckout(1, 'Visa');
  Analytics.pageView();
```

#### Transaction Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackTransaction(transactionId, affiliation, revenue, tax, shipping, coupon, list, step, option);
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2222', '1', 'MEN10', '1');
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '1111', '1', 'WOMEN10', '1');
  Analytics.trackTransaction('T1234', 'Online Store - Web', '3333', '10', '200', 'FLAT10', '', '', '');
  Analytics.pageView();
```

#### Promotion Impressions
```js
  Analytics.addPromo(productId, name, creative, position);
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // example:
  Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
  Analytics.pageView();
```
**Note:** Before tracking promotion clicks, call pageView, otherwise promotion impressions will be treated as promotion clicks.

#### Promotion Clicks
```js
  Analytics.addPromo(promotionId, promotionName, creative, position);
  Analytics.promoClick(promotionName);
  Analytics.pageView(); //ALWAYS user Analytics.pageView(); when you want to push the changes/functions to analytics.

  // example:
  Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
  Analytics.promoClick('Summer Sale');
  Analytics.pageView();
```

### Online / Offline Mode
```js
  // While in offline mode, no calls to the ga function or pushes to the gaq array are made.
  // This will queue all calls for later sending once offline mode is reset to false.
  Analytics.offline(true);

  // Reset offline mode to false
  Analytics.offline(false);
```

### In-Memory Queues
```js
  // If logging is enabled then all outbound calls are accessible via an in-memory array.
  // This is useful for troubleshooting and seeing the order of outbound calls with parameters.
  Analytics.log;

  // If in offline mode then all calls are queued to an in-memory array for future processing.
  // All calls queued to the offlineQueue are not outbound calls yet and hence do not show up in the log.
  Analytics.offlineQueue;
```

## Directive

Alternatively, you can use a directive to avoid filling controllers with `Analytics.trackEvent();` statements.

**Note:** the directive does not create an isolate scope.

```html
  <button type="button" ga-track-event="['video', 'play', 'django.mp4']"></button>

  <!-- OR -->

  <button type="button" ga-track-event="['video', 'play', 'django.mp4', 4, true, {dimension15: 'My Custom Dimension', metric18: 8000}]"></button>
```

You can define the properties on your controller too, `$scope.event = ['video', 'play', 'django.mp4']` and reference them.

```html
  <button type="button" ga-track-event="event"></button>
```

`ga-track-event-if` is a conditional check. If the attribute value evaluates falsey, the event will **NOT** be fired. This is useful for user tracking opt-out, _etc._

```html
  <button type="button" ga-track-event="['video', 'play', 'django.mp4']" ga-track-event-if="shouldTrack"></button>
```

## Troubleshooting
### AdBlock EasyPrivacy

AdBlock has a module named [EasyPrivacy](https://easylist-downloads.adblockplus.org/easyprivacy.txt) that is meant to block web tracking scripts. angular-google-analytics.js gets filtered out by the EasyPrivacy blacklist.

Users who are already concatenating and minifying their scripts should not notice a problem as long as the new script name is not also on the EasyPrivacy blacklist. Alternatively, consider changing the file name manually.

## Licence

As AngularJS itself, this module is released under the permissive [MIT License](http://revolunet.mit-license.org). Your contributions are always welcome.

## Development

After forking you will need to run the following from a command line to get your environment setup:

1. ```npm install```
2. ```bower install```

After install you have the following commands available to you from a command line:

1. ```grunt lint```
2. ```npm test``` or ```grunt``` or ```grunt test```
3. ```npm test-server``` or ```grunt test-server```
4. ```grunt build``` or ```grunt release```
5. ```grunt stage```
