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
