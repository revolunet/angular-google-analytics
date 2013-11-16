/* global angular, console */

'use strict';

angular.module('angular-google-analytics', [])
    .provider('Analytics', function() {
        var created = false,
            trackRoutes = true,
            accountId,
            trackPrefix = '',
            domainName,
            analyticsJS = false,
            pageEvent = '$routeChangeSuccess',
            cookieConfig = 'auto',
            ecommerce = false;

          this._logs = [];

          // config methods
          this.setAccount = function(id) {
              accountId = id;
              return true;
          };
          this.trackPages = function(doTrack) {
              trackRoutes = doTrack;
              return true;
          };

          this.trackPrefix = function(prefix) {
              trackPrefix = prefix;
              return true;
          };

          this.setDomainName = function(domain) {
            domainName = domain;
            return true;
          };

          this.useAnalytics = function(val) {
            analyticsJS = !!val;
            return true;
          };

          this.setPageEvent = function(name) {
            pageEvent = name;
            return true;
          };

          this.setCookieConfig = function (config) {
            cookieConfig = config;
            return true;
          };

          this.useECommerce = function (val) {
            ecommerce = !!val;
            return true;
          };

        // public service
        this.$get = ['$document', '$rootScope', '$location', '$window', function($document, $rootScope, $location, $window) {
          // private methods
          function _createScriptTag() //noinspection JSValidateTypes
          {
            // inject the google analytics tag
            if (!accountId) return;
            $window._gaq = [];
            $window._gaq.push(['_setAccount', accountId]);
            if (trackRoutes) $window._gaq.push(['_trackPageview']);
            if(domainName) $window._gaq.push(['_setDomainName', domainName]);
            (function() {
              var document = $document[0];
              var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
              ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
            created = true;
          }
          function _createAnalyticsScriptTag() {
            if (!accountId) {
              return console.warn('No account id set for Analytics.js');
            }

            var args = [$window, $document, 'script', '//www.google-analytics.com/analytics.js', 'ga'],
              scriptElement,
              firstScript,
              document = $document[0];
            // inject the Analytics.js tag
            $window['GoogleAnalyticsObject'] = 'ga';
            $window.ga = $window.ga || function () {
              (window.ga.q = window.ga.q || []).push([args]);
            };
            $window.ga.l = 1 * new Date();
            scriptElement = document.createElement('script');
            firstScript = document.getElementsByTagName('script')[0];
            scriptElement.async = 1;
            scriptElement.src = args[3];
            firstScript.parentNode.insertBefore(scriptElement, firstScript);


            $window.ga('create', accountId, cookieConfig);
            if (trackRoutes) $window.ga('send', 'pageview');
            if (ecommerce) $window.ga('require', 'ecommerce', 'ecommerce.js');

          }
          this._log = function() {
            // for testing
            //console.info('analytics log:', arguments);
            this._logs.push(arguments);
          };
          this._trackPage = function(url) {
            if (trackRoutes && !analyticsJS && $window._gaq) {
              $window._gaq.push(['_trackPageview', trackPrefix + url]);
              this._log('_trackPageview', arguments);
            } else if (trackRoutes && analyticsJS && $window.ga) {
              $window.ga('send', 'pageview');
              this._log('pageview', arguments);
            }
          };
          this._trackEvent = function(category, action, label, value) {
            if (!analyticsJS && $window._gaq) {
              $window._gaq.push(['_trackEvent', category, action, label, value]);
              this._log('trackEvent', arguments);
            } else if ($window.ga) {
              $window.ga('event', category, action, label, value);
              this._log('event', arguments);
            }

          };

          /**
           * Add transaction
           * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEcommerce#_gat.GA_Tracker_._addTrans
           * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans
           * @param transactionId
           * @param affiliation
           * @param total
           * @param tax
           * @param shipping
           * @param city
           * @param state
           * @param country
           * @private
           */
          this._addTrans = function (transactionId, affiliation, total, tax, shipping, city, state, country) {
            if (!analyticsJS && $window._gaq) {
              $window._gaq.push(['_addTrans', transactionId, affiliation, total, tax, shipping, city, state, country]);
              this._log('_addTrans', arguments);
            } else if ($window.ga) {
              if (!ecommerce) {
                console.warn('ecommerce no set. Use AnalyticsProvider.setECommerce(true);');
              } else {
                $window.ga('ecommerce:addTransaction', {
                  id: transactionId,
                  affiliation: affiliation,
                  revenue: total,
                  tax: tax,
                  shipping: shipping,
                  city: city,
                  state: state,
                  country: country
                });
                this._log('ecommerce:addTransaction', arguments);
              }

            }
          };

          /**
           * Add item to transaction
           * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEcommerce#_gat.GA_Tracker_._addItem
           * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem
           * @param transactionId
           * @param sku
           * @param name
           * @param category
           * @param price
           * @param quantity
           * @private
           */
          this._addItem = function (transactionId, sku, name, category, price, quantity) {
            if (!analyticsJS && $window._gaq) {
              $window._gaq.push(['_addItem', transactionId, sku, name, category, price, quantity]);
              this._log('_addItem', arguments);
            } else if ($window.ga) {
              $window.ga('ecommerce:addItem', {
                id: transactionId,
                sku: sku,
                name: name,
                category: category,
                price: price,
                quantity: quantity
              });
              this._log('ecommerce:addItem', arguments);
            }
          };

          /**
           * Track transaction
           * https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEcommerce#_gat.GA_Tracker_._trackTrans
           * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#sendingData
           * @private
           */
          this._trackTrans = function () {
            if (!analyticsJS && $window._gaq) {
              $window._gaq.push(['_trackTrans']);
              this._log('_trackTrans', arguments);
            } else if ($window.ga) {
              $window.ga('ecommerce:send');
              this._log('ecommerce:send', arguments);
            }

          };

          /**
           * Clear transaction
           * https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#clearingData
           *
           * @private
           */
          this._clearTrans = function () {
            if ($window.ga) {
              $window.ga('ecommerce:clear');
              this._log('ecommerce:clear', arguments);
            }
          };

          /**
           * Send custom events
           * https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings#implementation
           * https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions#implementation
           *
           * @param obj
           * @private
           */
          this._send = function (obj) {
            if ($window.ga) {
              $window.ga('send', obj);
              this._log('send', obj);
            }
          };



            // creates the ganalytics tracker
          if (analyticsJS) {
            _createAnalyticsScriptTag();
          } else {
            _createScriptTag();
          }


            var me = this;

            // activates page tracking
            if (trackRoutes) $rootScope.$on(pageEvent, function() {
              me._trackPage($location.path());
            });

            return {
                _logs: me._logs,
                cookieConfig: cookieConfig,
                ecommerce: ecommerce,
                trackPage: function(url) {
                    // add a page event
                    me._trackPage(url);
                },
                trackEvent: function(category, action, label, value) {
                    // add an action event
                    me._trackEvent(category, action, label, value);
                },
                addTrans: function (transactionId, affiliation, total, tax, shipping, city, state, country) {
                    me._addTrans(transactionId, affiliation, total, tax, shipping, city, state, country);
                },
                addItem: function (transactionId, sku, name, category, price, quantity) {
                    me._addItem(transactionId, sku, name, category, price, quantity);
                },
                trackTrans: function () {
                    me._trackTrans();
                },
                clearTrans: function () {
                  me._clearTrans();
                },
                send: function (obj) {
                  me._send(obj);
                }
            };
        }];

    });
