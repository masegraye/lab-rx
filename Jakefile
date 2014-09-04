var spawn = require("child_process").spawn;

desc("Runs the app")
task("run", function() {
  var app = spawn("node", ["./scripts/app.js", "--configurationFiles=./configuration/global.json", "--scopes=global"], {stdio: "inherit"});
  app.on("close", function() {
    complete()
  })
}, {async: true});
