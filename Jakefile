var spawn = require("child_process").spawn;

desc("Runs the app")
task("run", function() {
  var app = spawn("node", ["./index.js", "--configurationFiles=./configuration/global.json", "--scopes=global"], {stdio: "inherit"});
  app.on("close", function() {
    complete()
  })
}, {async: true});
