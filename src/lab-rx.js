"use strict";

var mod = function(
  _,
  Promise,
  Rx,
  App,
  Logger
) {

  var LabRx = function() {
    this.initialize.apply(this, arguments);
  };

  var Log = Logger.create("LabRx");

  _.extend(LabRx.prototype, App.prototype, {
    initialize: function() {
      App.prototype.initialize.apply(this, arguments);
    },

    up: Promise.method(function() {
      Log.debug("Coming up...");
      Log.debug("Config value;", this.config("lab-rx"));

      return Promise.bind(this)
        .then(function() {
          return this._exampleOne();
        })
        .then(function() {
          return this._exampleTwo();
        })
        .then(function() {
          return this._exampleThree()
        }).
        then(function() {
          return this._exampleFour();
        });
    }),

    _exampleOne: Promise.method(function() {
      var log = Logger.create("exampleOne");

      var source = Rx.Observable.create(function(observer) {
        observer.onNext(42);
        observer.onCompleted();

        return function() {
          log.debug("source; disposed");
        };
      });

      var p1 = new Promise(function(resolve, reject){
        var sub1 = source.subscribe(
          function(x){ log.debug("sub1; onNext;", x)},
          function(e){ log.debug("sub1; onError;", e) },
          function(){ log.debug("sub1; onComplete"); resolve(); });
      });

      var p2 = new Promise(function(resolve, reject) {
        var sub2 = source.subscribe(
          function(x){ log.debug("sub2; onNext;", x)},
          function(e){ log.debug("sub2; onError;", e)},
          function(){ log.debug("sub2; onComplete"); resolve(); });
      });

      return Promise.all([p1, p2]);
    }),

    _exampleTwo: Promise.method(function() {
      var log = Logger.create("exampleTwo");
      var source = Rx.Observable.range(1, 5);

      return Promise.all(_.times(5, function(i) {
        return new Promise(function(resolve, reject) {
          source.subscribe(
          function(x){
            log.debug("onNext", i, x);
          },
          function(e) {
            log.debug("onError;", i, e);
          },
          function() {
            log.debug("onComplete;", i);
            resolve();
          });
        });
      }));
    }),

    _exampleThree: Promise.method(function() {
      var log = Logger.create("exampleThree");

      var p1 = new Promise(function(resolve, reject) {
        var promise = new Promise(function(innerResolve, innerReject) {
          process.nextTick(function() {
            innerResolve(42);
          });
        });

        var source = Rx.Observable.fromPromise(promise);

        source.subscribe(
          function(x){
            log.debug("onNext;", x);
          },
          function(e) {
            log.debug("onError;", e);
          },
          function() {
            log.debug("onComplete");
            resolve()
          });
      });

      var p2 = new Promise(function(resolve, reject) {
        var promise = new Promise(function(innerResolve, innerReject) {
          process.nextTick(function(){
            innerReject(new Error("Reason for rejection"));
          });
        });

        var source = Rx.Observable.fromPromise(promise);
        source.subscribe(
          function(x){
            log.debug("onNext;", x);
          },
          function(e) {
            log.debug("onError;", e);
            resolve();
          },
          function() {
            log.debug("onComplete");
            resolve();
          });
      });

      return Promise.all([p1, p2]);
    }),

    _exampleFour: Promise.method(function() {
      var log    = Logger.create("exampleFour"),
          seq    = Rx.Observable.range(1, 100),
          bufSeq = seq.bufferWithCount(5);

      return new Promise(function(resolve, reject) {
        bufSeq
          .map(function(ary) {
            log.debug("mapped value", ary);
            return ary.length;
          })
          .subscribe(function(len) {
            log.debug("Length of buffered items", len);
          }, function(e){
            log.debug("Error", e);
          }, function(){
            log.debug("Finishing!");
            resolve();
          });
      });
    }),

    down: Promise.method(function() {
      Log.debug("Going down...");
    })
  });

  return LabRx;
};

module.exports = mod(
  require("underscore"),
  require("bluebird"),
  require("rx"),
  require("thicket").c("app"),
  require("thicket").c("logger")
);
