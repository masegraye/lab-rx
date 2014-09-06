"use strict";

var mod = function(
  _,
  Promise,
  Rx,
  express,
  EventEmitter,
  App,
  Logger
) {

  var ServeRx = function() {
    this.initialize.apply(this, arguments);
  };

  var Log = Logger.create("ServeRx");

  _.extend(ServeRx.prototype, App.prototype, {
    initialize: function() {
      App.prototype.initialize.apply(this, arguments);
      this._web = express();
      var bridge = new EventEmitter();


      this._close = new Rx.Subject();
      var fromExpress = new Rx.Observable.fromEvent(bridge, "request");

      this._web.use(_.bind(function(req, res, next) {
        bridge.emit('request', {
          request: req,
          req: req,
          response: res,
          res: res,
          next: next
        });
      }, this));

      this._webRequests = fromExpress.takeUntil(this._close);
      this._server = null;
    },

    up: Promise.method(function() {
      return Promise.bind(this)
        .then(this._connectHandlers)
        .then(function() {
          return new Promise(_.bind(function(resolve, reject) {
            Log.debug("Starting server on port", this.config("port"), "...");
            this._server = this._web.listen(this.config("port"), _.bind(function() {
              Log.debug("App listening on port", this.config("port"));
              resolve();
            }, this));
          }, this));
        });
    }),

    down: Promise.method(function() {
    }),

    _connectHandlers: Promise.method(function() {
      this._webRequests.forEach(function(ctx) {
        Log.debug("Rejecting request for URL", ctx.req.url);
        ctx.next();
      });

    })
  });

  return ServeRx;
};

module.exports = mod(
  require("underscore"),
  require("bluebird"),
  require("rx"),
  require("express"),
  require("events").EventEmitter,
  require("thicket").c("app"),
  require("thicket").c("logger")
);
