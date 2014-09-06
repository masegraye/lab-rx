var spawn = require("child_process").spawn;

desc("Runs the lab-rx app")
task("lab", function() {
  var app = spawn("node", ["./scripts/lab.js", "--configurationFiles=./configuration/global.json", "--scopes=global,lab-rx"], {stdio: "inherit"});
  app.on("close", function() {
    complete()
  })
}, {async: true});

desc("Runs the web-rx app")
task("web", function() {
  var app = spawn("node", ["./scripts/web.js", "--configurationFiles=./configuration/global.json,./configuration/web-rx.json", "--scopes=global,web-rx"], {stdio: "inherit"});
  app.on("close", function() {
    complete()
  })
}, {async: true});

