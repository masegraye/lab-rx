var WebRx        = require("../src/web-rx"),
    thicket      = require("thicket"),
    Logger       = thicket.c("logger"),
    CLA          = thicket.c("appenders/console-log"),
    Bootstrapper = thicket.c("bootstrapper");

Logger.root().addAppender(new CLA());
Logger.root().setLogLevel(Logger.Level.Debug);

var bootstrapper = new Bootstrapper({ applicationConstructor: WebRx });

bootstrapper.bootstrap().then(function(app) {
  return app.start().thenReturn(app);
}).then(function(app) {
  // return app.stop();
});
