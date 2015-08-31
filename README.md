# angular-google-analytics

![Bower Version](https://img.shields.io/bower/v/angular-google-analytics.svg)
![NPM Version](https://img.shields.io/npm/v/angular-google-analytics.svg)

This service lets you integrate google analytics tracker in your AngularJS applications easily.

You can use basic functions, `Analytics.trackEvent('video', 'play', 'django.mp4');` or more advanced e-commerce features like product tracking, promo codes, transactions...

Proudly brought to you by [@revolunet](http://twitter.com/revolunet), [@deltaepsilon](https://github.com/deltaepsilon), [@justinsa](https://github.com/justinsa) and [contributors](https://github.com/revolunet/angular-google-analytics/graphs/contributors)

## Features

 - configurable
 - automatic page tracking
 - events tracking
 - e-commerce tracking
 - enhanced e-commerce tracking
 - multiple-domains
 - ga.js and and analytics.js support
 - cross-domain support
 - multiple tracking objects
 - offline mode

## Installation

`bower install angular-google-analytics`

Or alternatively, grab the dist/angular-google-analytics.min.js and include it in your project

## Configure Service
```js
app.config(function (AnalyticsProvider) {
  // Add configuration code as desired - see below
});
```

### Use Universal Analytics
```js
// Use analytics.js (universal) instead of ga.js (classic)
// By default, classic analytics is used, unless this is called with a truthy value.
AnalyticsProvider.useAnalytics(true);
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
  cookieConfig: {
    cookieDomain: 'foo.example.com',
    cookieName: 'myNewName',
    cookieExpires: 20000
  },
  crossDomainLinker: true,
  crossLinkDomains: ['domain-1.com', 'domain-2.com'],
  displayFeatures: true,
  enhancedLinkAttribution: true,
  trackEvent: true,
  trackEcommerce: true
});
```
**Note:** the above properties are referenced and discussed in proceeding sections.

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
```js
  // Set custom cookie parameters
  AnalyticsProvider.setCookieConfig({
    cookieDomain: 'foo.example.com',
    cookieName: 'myNewName',
    cookieExpires: 20000
  });
```
In the case of universal analytics, this cookie configuration will be used as the default for any tracker that does not have the `cookieConfig` property defined.

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

  // Enabled enhanced e-commerce module (ec.js)
  // Universal Analytics only
  AnalyticsProvider.useECommerce(true, true);
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

### Manual Script Tag Injection
If `delayScriptTag(true)` was set during configuration then manual script tag injection is required. Otherwise, the script tag will be automatically injected and configured when the service is instantiated.
```js
  // Manually create classic analytics (ga.js) script tag
  Analytics.createScriptTag({ userId: 1234 });

  // Manually create universal analytics (analytics.js) script tag
  Analytics.createAnalyticsScriptTag({ userId: 1234 });
```

### Advanced Settings / Custom Dimensions
The `set` call allows for advanced configuration and definitions in univeral analytics only. This is a no-op when using classic analytics.
```js
  // As an example, set the User Id for the default, unnamed account object:
  Analytics.set('&uid', 1234);

  // Register a custom dimension
  Analytics.set('dimension1', 'Paid');
```

### Page Tracking
```js
  // Create a new pageview event
  Analytics.trackPage('/video/detail/XXX');

  // Create a new pageview event with page title
  Analytics.trackPage('/video/detail/XXX', 'Video XXX');

  // Create a new pageview event with page title, custom dimension, and custom metric
  // Universal Analytics only
  Analytics.trackPage('/video/detail/XXX', 'Video XXX', { dimension15: 'My Custom Dimension', metric18: 8000 });
```

### Event Tracking
```js
  // Create a new tracking event
  Analytics.trackEvent('video', 'play', 'django.mp4');

  // Create a new tracking event with a value
  Analytics.trackEvent('video', 'play', 'django.mp4', 4);

  // Create a new tracking event with a value and non-interaction flag
  Analytics.trackEvent('video', 'play', 'django.mp4', 4, true);

  // Create a new tracking event with a value, non-interaction flag, custom dimension, and custom metric
  // Universal Analytics only
  Analytics.trackEvent('video', 'play', 'django.mp4', 4, true, { dimension15: 'My Custom Dimension', metric18: 8000 });
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

  // Add items to transaction
  Analytics.addItem('1', 'sku-1', 'Test product 1', 'Testing', '1', '1');
  Analytics.addItem('1', 'sku-2', 'Test product 2', 'Testing', '1', '1');

  // Complete transaction
  Analytics.trackTrans();

  // Clear transaction
  Analytics.clearTrans();
```

### Enhanced E-Commerce (ec.js)
Enhanced e-commerce is only available for universal analytics. Enhanced e-commerce and classic e-commerce are mutually exclusive.

#### Product Impression Tracking
```js
  Analytics.addImpression(productId, name, list, brand, category, variant, position, price);
  Analytics.pageView();

  // example:
  Analytics.addImpression('sku-1', 'Test Product 1', 'Category List', 'Brand 1', 'Category-1', 'variant-1', '1', '24990');
  Analytics.addImpression('sku-2', 'Test Product 2', 'Category List', 'Brand 2', 'Category-1', 'variant-3', '2', '2499');
  Analytics.pageView();
```

#### Product Click Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.productClick(listName);

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.productClick('Search Result');
```

#### Product Detail Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackDetail();

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.trackDetail();
```

#### Add to Cart Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackCart('add');

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.trackCart('add');
```

#### Remove from Cart Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackCart('remove');

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.trackCart('remove');
```

#### Checkout Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackCheckout(checkoutStep, optionValue);

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2499', '1', 'FLAT10', '1');
  Analytics.trackCheckout(1, 'Visa');
```

#### Transaction Tracking
```js
  Analytics.addProduct(productId, name, category, brand, variant, price, quantity, coupon, position);
  Analytics.trackTransaction(transactionId, affiliation, revenue, tax, shipping, coupon, list, step, option);

  // example:
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '2222', '1', 'MEN10', '1');
  Analytics.addProduct('sku-2', 'Test Product 2', 'Category-1', 'Brand 2', 'variant-3', '1111', '1', 'WOMEN10', '1');
  Analytics.trackTransaction('T1234', 'Online Store - Web', '3333', '10', '200', 'FLAT10', '', '', '');
```

#### Promotion Impressions
```js
  Analytics.addPromo(productId, name, creative, position);
  Analytics.pageView();

  // example:
  Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
  Analytics.pageView();
```
**Note:** Before tracking promotion clicks, call pageView, otherwise promotion impressions will be treated as promotion clicks.

#### Promotion Clicks
```js
  Analytics.addPromo(promotionId, promotionName, creative, position);
  Analytics.promoClick(promotionName);

  // example:
  Analytics.addPromo('PROMO_1234', 'Summer Sale', 'summer_banner2', 'banner_slot1');
  Analytics.promoClick('Summer Sale');
```

### Online / Offline Mode
```js
  // While in offline mode, no calls to the ga function or pushes to the gaq array are made.
  // This will queue all calls for later sending once offline mode is reset to false.
  Analytics.offline(true);

  // Reset offline mode to false
  Analytics.offline(false);
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
