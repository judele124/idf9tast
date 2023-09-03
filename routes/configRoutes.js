const indexR = require("./index");
const usersR = require("./users");
const gamesR = require("./games");


exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/games", gamesR);

}

